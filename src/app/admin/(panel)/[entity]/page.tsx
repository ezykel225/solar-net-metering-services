import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadAdminPage } from "@/lib/admin/auth";
import { entities, isEntityKey } from "@/lib/admin/entities";
import { formatDate, formatPhp } from "@/lib/admin/format";
import { publicMediaUrl } from "@/lib/supabase/env";
import { RowActions } from "@/components/admin/RowActions";
import { Notice } from "@/components/admin/Notice";
import { Icon } from "@/components/ui/Icon";
import styles from "@/components/admin/admin.module.css";

type Params = { params: Promise<{ entity: string }>; searchParams: Promise<{ view?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { entity } = await params;
  return { title: isEntityKey(entity) ? entities[entity].label : "Not found" };
}

type ListRow = { id: string; status?: string; is_active?: boolean; is_featured?: boolean } & Record<string, unknown>;

/** Only the columns the list shows (not long descriptions, answers or galleries). */
function listSelect(def: (typeof entities)[keyof typeof entities]) {
  const cols = new Set(["id", def.titleField, ...def.listColumns.map((c) => c.field)]);
  if (def.model.status) cols.add("status");
  if (def.model.active) cols.add("is_active");
  if (def.model.featured) cols.add("is_featured");
  const image = def.fields.find((f) => f.type === "image");
  if (image) cols.add(image.name);
  return [...cols].join(",");
}

function cell(field: string, value: unknown) {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (field === "price_php") return formatPhp(value as number);
  if (field.endsWith("_on")) return formatDate(String(value));
  const s = String(value);
  return s.length > 90 ? `${s.slice(0, 90)}…` : s;
}

export default async function EntityListPage({ params, searchParams }: Params) {
  const { entity } = await params;
  if (!isEntityKey(entity)) notFound();
  const def = entities[entity];
  const { view } = await searchParams;
  const showArchived = def.model.status && view === "archived";
  const imageField = def.fields.find((f) => f.type === "image");
  const {
    data: { data, error },
  } = await loadAdminPage((supabase) => {
    let query = supabase.from(def.table).select(listSelect(def)).order("display_order", { ascending: true }).order("created_at", { ascending: true });
    if (def.model.status) query = showArchived ? query.eq("status", "archived") : query.neq("status", "archived");
    return query;
  });
  const rows = data as ListRow[] | null;

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>{def.label}</h1>
          <p>{def.description}</p>
        </div>
        <Link href={`/admin/${entity}/new`} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
          + Add {def.singular.toLowerCase()}
        </Link>
      </div>

      {def.model.status ? (
        <nav className={styles.tabs} aria-label="Filter">
          <Link href={`/admin/${entity}`} className={styles.tab} aria-current={!showArchived ? "page" : undefined}>
            Current
          </Link>
          <Link href={`/admin/${entity}?view=archived`} className={styles.tab} aria-current={showArchived ? "page" : undefined}>
            Archived
          </Link>
        </nav>
      ) : null}

      {error ? (
        <Notice kind="error">The list could not be loaded. Please refresh the page.</Notice>
      ) : !rows?.length ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <Icon name="fileText" size={32} />
          <h2>{showArchived ? "Nothing archived" : `No ${def.label.toLowerCase()} yet`}</h2>
          {!showArchived ? (
            <p>
              <Link href={`/admin/${entity}/new`}>Add the first {def.singular.toLowerCase()}</Link>
            </p>
          ) : null}
        </div>
      ) : (
        <ul className={styles.rows}>
          {rows.map((row, i) => {
            const title = String(row[def.titleField] ?? "Untitled");
            const img = imageField ? publicMediaUrl(row[imageField.name] as string | null) : null;
            return (
              <li key={row.id} className={styles.row}>
                <div className={styles.rowMain}>
                  {imageField ? (
                    <div className={styles.thumb}>{img ? <Image src={img} alt="" fill sizes="64px" unoptimized /> : null}</div>
                  ) : null}
                  <div className={styles.rowText}>
                    <div className={styles.badges}>
                      {def.model.status ? (
                        <span className={`${styles.badge} ${row.status === "published" ? styles.badgeGreen : ""}`}>
                          {row.status === "published" ? "Published" : row.status === "archived" ? "Archived" : "Draft"}
                        </span>
                      ) : null}
                      {def.model.active ? (
                        <span className={`${styles.badge} ${row.is_active ? styles.badgeGreen : ""}`}>{row.is_active ? "Active" : "Inactive"}</span>
                      ) : null}
                      {def.model.featured && row.is_featured ? <span className={`${styles.badge} ${styles.badgeOrange}`}>Featured</span> : null}
                    </div>
                    <Link href={`/admin/${entity}/${row.id}`} className={styles.rowTitle}>
                      {title}
                    </Link>
                    {def.listColumns.length ? (
                      <span className={styles.rowMeta}>
                        {def.listColumns.map((c) => (
                          <span key={c.field}>
                            {c.label}: {cell(c.field, row[c.field])}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </div>
                </div>
                <RowActions
                  entityKey={entity}
                  id={row.id}
                  title={title}
                  status={row.status}
                  isActive={row.is_active}
                  isFeatured={row.is_featured}
                  isFirst={i === 0}
                  isLast={i === rows.length - 1}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
