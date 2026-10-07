"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET, publicMediaUrl } from "@/lib/supabase/env";
import { IMAGE_RULES, type MediaFolder } from "@/lib/admin/entities";
import styles from "./admin.module.css";

/**
 * Validates and uploads one image to Supabase Storage (website-media/<folder>/<uuid>.<ext>)
 * using the signed-in admin's session. Returns the stored path.
 * The bucket also enforces type/size limits and admin-only upload policies.
 */
async function uploadImage(file: File, folder: MediaFolder): Promise<string> {
  const ext = IMAGE_RULES.types[file.type];
  if (!ext) throw new Error("Please choose a JPG, PNG, WebP or AVIF image.");
  if (file.size > IMAGE_RULES.maxBytes) throw new Error("The image is larger than 5 MB. Please choose a smaller file.");
  if (file.type !== "image/avif" && typeof createImageBitmap === "function") {
    // Make sure the file really is an image (not just renamed).
    try {
      (await createImageBitmap(file)).close();
    } catch {
      throw new Error("This file could not be read as an image.");
    }
  }
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Image uploads are not configured.");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("size") || msg.includes("too large")) throw new Error("The image is larger than 5 MB.");
    if (msg.includes("mime") || msg.includes("type")) throw new Error("This file type is not allowed.");
    if (msg.includes("row-level") || msg.includes("unauthorized") || msg.includes("403")) {
      throw new Error("You are not allowed to upload images. Please sign in again.");
    }
    throw new Error("The image could not be uploaded. Please try again.");
  }
  return path;
}

type ImageFieldProps = {
  name: string;
  label: string;
  folder: MediaFolder;
  initialPath: string | null;
  error?: string;
  help?: string;
};

/** Single image: upload, replace, remove, preview. Saves the path in a hidden input. */
export function ImageField({ name, label, folder, initialPath, error, help }: ImageFieldProps) {
  const [path, setPath] = useState<string | null>(initialPath);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const url = publicMediaUrl(path);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setUploadError("");
    try {
      setPath(await uploadImage(file, folder));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const message = uploadError || error;
  return (
    <div className={styles.field}>
      <span className={styles.label} id={`${id}-label`}>
        {label}
      </span>
      <input type="hidden" name={name} value={path ?? ""} />
      <div className={styles.imageField}>
        <div className={styles.imagePreview}>
          {url ? (
            <Image src={url} alt="Preview" fill sizes="200px" unoptimized />
          ) : (
            <span className={styles.imagePlaceholder}>No image</span>
          )}
        </div>
        <div className={styles.imageButtons}>
          <input
            ref={inputRef}
            id={`${id}-file`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className={styles.fileInput}
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-help`}
            onChange={(e) => onFile(e.target.files?.[0])}
            disabled={busy}
          />
          <label htmlFor={`${id}-file`} className={`${styles.btn} ${busy ? styles.disabledLabel : ""}`} aria-hidden="true">
            {busy ? "Uploading…" : path ? "Replace image" : "Upload image"}
          </label>
          {path ? (
            <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setPath(null)} disabled={busy}>
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <p id={`${id}-help`} className={styles.hint}>
        {help ?? "JPG, PNG, WebP or AVIF, up to 5 MB. Changes are applied when you save."}
      </p>
      {message ? (
        <p className={styles.fieldError} role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}

/** Multiple images (e.g. additional project photos). Saves a JSON list of paths. */
export function ImagesField({ name, label, folder, initialPaths, maxItems, error }: {
  name: string;
  label: string;
  folder: MediaFolder;
  initialPaths: string[];
  maxItems: number;
  error?: string;
}) {
  const [paths, setPaths] = useState<string[]>(initialPaths);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setUploadError("");
    const room = maxItems - paths.length;
    const selected = Array.from(files).slice(0, room);
    if (files.length > room) setUploadError(`You can add up to ${maxItems} images.`);
    const added: string[] = [];
    for (const file of selected) {
      try {
        added.push(await uploadImage(file, folder));
      } catch (e) {
        setUploadError(`${file.name}: ${e instanceof Error ? e.message : "Upload failed."}`);
      }
    }
    setPaths((prev) => [...prev, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const message = uploadError || error;
  return (
    <div className={styles.field}>
      <span className={styles.label} id={`${id}-label`}>
        {label}
      </span>
      <input type="hidden" name={name} value={JSON.stringify(paths)} />
      {paths.length > 0 ? (
        <ul className={styles.gallery}>
          {paths.map((p, i) => (
            <li key={p} className={styles.galleryItem}>
              <div className={styles.imagePreview} style={{ width: "100%" }}>
                <Image src={publicMediaUrl(p) ?? ""} alt={`Additional image ${i + 1}`} fill sizes="160px" unoptimized />
              </div>
              <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setPaths((prev) => prev.filter((x) => x !== p))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {paths.length < maxItems ? (
        <div className={styles.imageButtons}>
          <input
            ref={inputRef}
            id={`${id}-file`}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className={styles.fileInput}
            aria-labelledby={`${id}-label`}
            onChange={(e) => onFiles(e.target.files)}
            disabled={busy}
          />
          <label htmlFor={`${id}-file`} className={styles.btn} aria-hidden="true">
            {busy ? "Uploading…" : "Add images"}
          </label>
        </div>
      ) : null}
      <p className={styles.hint}>Up to {maxItems} images, 5 MB each. Changes are applied when you save.</p>
      {message ? (
        <p className={styles.fieldError} role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
