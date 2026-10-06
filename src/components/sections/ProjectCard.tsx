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
        <span className={`${styles.tag} ${project.category === "Commercial" ? styles.tagCommercial : ""}`}>
          {project.category}
        </span>
      </div>
      <div className={styles.body}>
        <h3>{project.title}</h3>
        <p className={styles.meta}>
          <span>
            <Icon name="mapPin" size={16} /> {project.location}
          </span>
          <span>
            <Icon name="bolt" size={16} /> {project.systemSize}
          </span>
        </p>
        <p className={styles.description}>{project.description}</p>
      </div>
    </article>
  );
}
