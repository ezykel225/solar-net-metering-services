import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGallery } from "./ProjectGallery";
import styles from "./Projects.module.css";
import { getProjects, getSiteSettings } from "@/lib/cms";

type ProjectsSectionProps = {
  limit?: number;
  filterable?: boolean;
  showHeading?: boolean;
};

export async function ProjectsSection({ limit, filterable = false, showHeading = true }: ProjectsSectionProps) {
  const settings = await getSiteSettings();
  const { data: projects } = await getProjects();
  const items = limit ? projects.slice(0, limit) : projects;
  return (
    <section className="section" aria-labelledby="projects-title">
      <div className="container">
        {showHeading ? (
          <SectionHeading
            id="projects-title"
            eyebrow="Our Work"
            title="Recent Solar Projects"
            intro="Installations we have shared from around Negros Oriental."
          />
        ) : (
          <h2 id="projects-title" className="sr-only">
            Project gallery
          </h2>
        )}
        {items.length > 0 ? (
          <ProjectGallery projects={items} filterable={filterable} />
        ) : (
          <p className={styles.more}>New project photos and details will be shared here soon.</p>
        )}
        {limit ? (
          <div className={styles.footer}>
            <ButtonLink href="/projects" variant="secondary">
              View Projects &amp; Results
            </ButtonLink>
          </div>
        ) : (
          <p className={styles.more}>
            More of our recent installations are posted on our{" "}
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer">
              Facebook page<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
