import Image from "next/image";
import type { Project } from "@/data/projects";
import { Icon } from "@/components/ui/Icon";
import styles from "./Projects.module.css";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={styles.image}
        />
        {project.tags.length > 0 ? (
          <ul className={styles.tags} aria-label="Project type">
            {project.tags.map((tag, i) => (
              <li key={tag} className={`${styles.tag} ${i > 0 ? styles.tagSecondary : ""}`}>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        {project.imageIsIllustration ? (
          <span className={styles.illustration}>Illustration · project photo coming soon</span>
        ) : null}
      </div>
      <div className={styles.body}>
        <h3>{project.title}</h3>
        <p className={styles.meta}>
          <span>
            <Icon name="mapPin" size={16} /> {project.location}
          </span>
          {project.system ? (
            <span>
              <Icon name="bolt" size={16} /> {project.system}
            </span>
          ) : null}
        </p>
        <p className={styles.description}>{project.description}</p>
      </div>
    </article>
  );
}
