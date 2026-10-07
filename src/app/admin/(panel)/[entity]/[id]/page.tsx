import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { entities, isEntityKey } from "@/lib/admin/entities";
import { EntityForm } from "@/components/admin/EntityForm";
import { Notice } from "@/components/admin/Notice";
import styles from "@/components/admin/admin.module.css";

type Params = { params: Promise<{ entity: string; id: string }>; searchParams: Promise<{ saved?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { entity } = await params;
  return { title: isEntityKey(entity) ? `Edit ${entities[entity].singular}` : "Not found" };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditEntityPage({ params, searchParams }: Params) {
  const { entity, id } = await params;
  if (!isEntityKey(entity) || !UUID.test(id)) notFound();
  const def = entities[entity];
  const { saved } = await searchParams;
  const { supabase } = await requireAdminPage();
  const { data, error } = await supabase.from(def.table).select("*").eq("id", id).maybeSingle();
  if (!error && !data) notFound();

  return (
    <>
      <Link href={`/admin/${entity}`} className={styles.backLink}>
        ← {def.label}
      </Link>
      <div className={styles.pageHeader}>
        <div>
          <h1>Edit {def.singular.toLowerCase()}</h1>
          <p>{data ? String(data[def.titleField] ?? "") : ""}</p>
        </div>
      </div>
      {error || !data ? (
        <Notice kind="error">This {def.singular.toLowerCase()} could not be loaded. Please refresh the page.</Notice>
      ) : (
        <EntityForm entityKey={entity} id={id} initial={data} savedNotice={saved === "1"} />
      )}
    </>
  );
}
