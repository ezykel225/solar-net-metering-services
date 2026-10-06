import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  /** id applied to the <h2> so sections can use aria-labelledby */
  id?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, intro, align = "center", onDark, id, as: Tag = "h2" }: SectionHeadingProps) {
  const classes = [styles.heading, align === "center" && styles.center, onDark && styles.onDark].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Tag id={id}>{title}</Tag>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </div>
  );
}
