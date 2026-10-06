import { projects } from "@/data/projects";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGallery } from "./ProjectGallery";
import styles from "./Projects.module.css";

type ProjectsSectionProps = {
  limit?: number;
  filterable?: boolean;
  showHeading?: boolean;
};

export function ProjectsSection({ limit, filterable = false, showHeading = true }: ProjectsSectionProps) {
  const items = limit ? projects.slice(0, limit) : projects;
  return (
    <section className="section" aria-labelledby={showHeading ? "projects-title" : undefined} aria-label={showHeading ? undefined : "Project gallery"}>
      <div className="container">
        {showHeading ? (
          <SectionHeading
            id="projects-title"
            eyebrow="Our Work"
            title="Recent Solar Projects"
            intro="A selection of residential and commercial installations completed by our team."
          />
        ) : null}
        <ProjectGallery projects={items} filterable={filterable} />
        {limit ? (
          <div className={styles.footer}>
            <ButtonLink href="/projects" variant="secondary">
              View All Projects
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
