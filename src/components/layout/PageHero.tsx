import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  title: string;
  intro?: ReactNode;
  /** Current page label for the breadcrumb */
  crumb: string;
  /** Route path of the page, e.g. "/about" (used for breadcrumb structured data) */
  path: string;
};

/** Compact banner used at the top of inner pages. */
export function PageHero({ title, intro, crumb, path }: PageHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="page-title">
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ol className={styles.crumbs}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <h1 id="page-title">{title}</h1>
        {intro ? <p className={styles.intro}>{intro}</p> : null}
      </div>
      <JsonLd data={breadcrumbJsonLd(crumb, path)} />
    </section>
  );
}
