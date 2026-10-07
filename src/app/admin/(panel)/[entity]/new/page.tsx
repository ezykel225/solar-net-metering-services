import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { entities, isEntityKey } from "@/lib/admin/entities";
import { EntityForm } from "@/components/admin/EntityForm";
import styles from "@/components/admin/admin.module.css";

type Params = { params: Promise<{ entity: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { entity } = await params;
  return { title: isEntityKey(entity) ? `Add ${entities[entity].singular}` : "Not found" };
}

export default async function NewEntityPage({ params }: Params) {
  const { entity } = await params;
  if (!isEntityKey(entity)) notFound();
  await requireAdminPage();
  const def = entities[entity];
  return (
    <>
      <Link href={`/admin/${entity}`} className={styles.backLink}>
        ← {def.label}
      </Link>
      <div className={styles.pageHeader}>
        <div>
          <h1>Add {def.singular.toLowerCase()}</h1>
          <p>{def.description}</p>
        </div>
      </div>
      <EntityForm entityKey={entity} id={null} initial={def.defaults} />
    </>
  );
}
