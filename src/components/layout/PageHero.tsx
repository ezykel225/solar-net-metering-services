import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  title: string;
  intro?: ReactNode;
  /** Current page label for the breadcrumb */
  crumb: string;
};

/** Compact banner used at the top of inner pages. */
export function PageHero({ title, intro, crumb }: PageHeroProps) {
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
    </section>
  );
}
