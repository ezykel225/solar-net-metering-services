"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "./Projects.module.css";

type Filter = "All" | ProjectCategory;
const filters: Filter[] = ["All", "Residential", "Commercial"];

/** Project grid with an optional Residential/Commercial filter. */
export function ProjectGallery({ projects, filterable = false }: { projects: Project[]; filterable?: boolean }) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      {filterable ? (
        <div className={styles.filters} role="group" aria-label="Filter projects by type">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={styles.filter}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {filterable ? `Showing ${visible.length} ${filter === "All" ? "" : filter.toLowerCase() + " "}projects` : ""}
      </p>
      <ul className={styles.grid}>
        {visible.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </>
  );
}
