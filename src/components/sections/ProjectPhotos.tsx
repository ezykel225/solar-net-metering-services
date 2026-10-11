"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "./ProjectPhotos.module.css";

type Photo = { src: string; alt: string };

/**
 * "View photos" button + simple full-screen viewer (native <dialog>: focus
 * trap, Escape to close). Photos are shown whole (object-fit: contain).
 */
export function ProjectPhotos({ title, photos }: { title: string; photos: Photo[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const go = (step: number) => setIndex((i) => (i + step + count) % count);
  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const photo = photos[index];

  return (
    <>
      <div className={styles.thumbs}>
        {photos.slice(0, 4).map((p, i) => (
          <button key={p.src} type="button" className={styles.thumb} onClick={() => open(i)}>
            <Image src={p.src} alt="" fill sizes="64px" className={styles.thumbImage} />
            <span className="sr-only">
              View photo {i + 1} of {count}
            </span>
            {i === 3 && count > 4 ? (
              <span className={styles.more} aria-hidden="true">
                +{count - 4}
              </span>
            ) : null}
          </button>
        ))}
        <button type="button" className={styles.viewAll} onClick={() => open(0)}>
          <Icon name="panel" size={16} /> View photos ({count})
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={`${title} — photos`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onClick={(e) => {
          // Click on the dark backdrop closes the viewer.
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className={styles.frame}>
          <div className={styles.stage}>
            {photo ? <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="100vw" className={styles.full} /> : null}
          </div>
          <div className={styles.bar}>
            <button type="button" className={styles.navBtn} onClick={() => go(-1)} aria-label="Previous photo" disabled={count < 2}>
              <Icon name="arrowRight" size={20} className={styles.flip} />
            </button>
            <p className={styles.counter} aria-live="polite">
              {index + 1} / {count}
            </p>
            <button type="button" className={styles.navBtn} onClick={() => go(1)} aria-label="Next photo" disabled={count < 2}>
              <Icon name="arrowRight" size={20} />
            </button>
            <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()} autoFocus>
              <Icon name="close" size={20} /> Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
