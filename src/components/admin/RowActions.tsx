"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { deleteEntityAction, moveEntityAction, setEntityFlagAction, type FormState } from "@/app/admin/actions/content";
import { entities, type EntityKey } from "@/lib/admin/entities";
import { Icon } from "@/components/ui/Icon";
import styles from "./admin.module.css";

type Props = {
  entityKey: EntityKey;
  id: string;
  title: string;
  status?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isFirst: boolean;
  isLast: boolean;
};

/** Per-row actions with a confirmation dialog for permanent deletion. */
export function RowActions({ entityKey, id, title, status, isActive, isFeatured, isFirst, isLast }: Props) {
  const def = entities[entityKey];
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const run = (fn: () => Promise<FormState>) =>
    startTransition(async () => {
      setError("");
      const result = await fn();
      if (result.error) setError(result.error);
    });

  const archived = status === "archived";

  return (
    <div className={styles.rowActions}>
      <Link href={`/admin/${entityKey}/${id}`} className={styles.btn}>
        <Icon name="wrench" size={14} /> Edit
      </Link>

      {def.model.status && !archived ? (
        <button
          type="button"
          className={styles.btn}
          disabled={pending}
          onClick={() => run(() => setEntityFlagAction(entityKey, id, "status", status === "published" ? "draft" : "published"))}
        >
          {status === "published" ? "Unpublish" : "Publish"}
        </button>
      ) : null}

      {def.model.active ? (
        <button type="button" className={styles.btn} disabled={pending} onClick={() => run(() => setEntityFlagAction(entityKey, id, "is_active", !isActive))}>
          {isActive ? "Deactivate" : "Activate"}
        </button>
      ) : null}

      {def.model.featured && !archived ? (
        <button
          type="button"
          className={styles.btn}
          disabled={pending}
          aria-pressed={!!isFeatured}
          onClick={() => run(() => setEntityFlagAction(entityKey, id, "is_featured", !isFeatured))}
        >
          {isFeatured ? "Unfeature" : "Feature"}
        </button>
      ) : null}

      {!archived ? (
        <>
          <button
            type="button"
            className={`${styles.btn} ${styles.iconBtn}`}
            disabled={pending || isFirst}
            onClick={() => run(() => moveEntityAction(entityKey, id, "up"))}
            aria-label={`Move “${title}” up`}
          >
            <span aria-hidden="true">↑</span>
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.iconBtn}`}
            disabled={pending || isLast}
            onClick={() => run(() => moveEntityAction(entityKey, id, "down"))}
            aria-label={`Move “${title}” down`}
          >
            <span aria-hidden="true">↓</span>
          </button>
        </>
      ) : null}

      {def.model.status ? (
        archived ? (
          <button type="button" className={styles.btn} disabled={pending} onClick={() => run(() => setEntityFlagAction(entityKey, id, "status", "draft"))}>
            Restore as draft
          </button>
        ) : (
          <button type="button" className={styles.btn} disabled={pending} onClick={() => run(() => setEntityFlagAction(entityKey, id, "status", "archived"))}>
            Archive
          </button>
        )
      ) : null}

      <button type="button" className={`${styles.btn} ${styles.btnDanger}`} disabled={pending} onClick={() => dialogRef.current?.showModal()}>
        Delete
      </button>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={`del-${id}`}>
        <h2 id={`del-${id}`}>Delete this {def.singular.toLowerCase()}?</h2>
        <p>
          “{title}” will be permanently deleted{def.folder ? ", including its uploaded images" : ""}. This cannot be undone.
          {def.model.status ? " To hide it without deleting, use Archive or Unpublish instead." : def.model.active ? " To hide it without deleting, use Deactivate instead." : ""}
        </p>
        <div className={styles.dialogActions}>
          <button type="button" className={styles.btn} onClick={() => dialogRef.current?.close()} autoFocus>
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDangerSolid}`}
            onClick={() => {
              dialogRef.current?.close();
              run(() => deleteEntityAction(entityKey, id));
            }}
          >
            Delete permanently
          </button>
        </div>
      </dialog>

      {error ? (
        <p className={styles.fieldError} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
