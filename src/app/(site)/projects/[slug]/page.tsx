import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { ProjectPhotos } from "@/components/sections/ProjectPhotos";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { getProjectBySlug, getProjects } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import styles from "./project.module.css";

type Props = { params: Promise<{ slug: string }> };

/** Published projects are pre-rendered; other slugs are looked up on request (unknown or unpublished → 404). */
export async function generateStaticParams() {
  const { data } = await getProjects();
  return data.map((p) => ({ slug: p.slug }));
}

const summary = (text: string) => (text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text);

export async function generateMetadata({ params }: Props) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return {};
  const realPhoto = project.image && !project.imageIsIllustration ? project.image : undefined;
  return buildMetadata({
    title: project.title,
    description: summary(project.description),
    path: `/projects/${project.slug}`,
    image: realPhoto,
    imageAlt: realPhoto ? project.imageAlt : undefined,
  });
}

const completedLabel = (date: string) => {
  const d = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        timeZone: "UTC",
      });
};

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();

  const completed = project.completedOn ? completedLabel(project.completedOn) : null;
  const photos = project.gallery ?? [];
  const similarHref = `/contact?${new URLSearchParams({ similar: project.title })}#quote`;

  return (
    <>
      <PageHero
        crumb={project.title}
        path={`/projects/${project.slug}`}
        parents={[{ label: "Projects", href: "/projects" }]}
        title={project.title}
        intro={
          project.location ? (
            <span className={styles.location}>
              <Icon name="mapPin" size={18} /> {project.location}
            </span>
          ) : undefined
        }
      />

      <section className="section" aria-label="Project details">
        <div className={`container ${styles.layout}`}>
          <div className={styles.media}>
            <figure className={styles.figure}>
              <div className={styles.mainImage}>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className={styles.image}
                  />
                ) : (
                  <span className={styles.noImage} aria-hidden="true">
                    <Icon name="panel" size={48} />
                  </span>
                )}
                {project.image && project.imageIsIllustration ? (
                  <span className={styles.illustration}>Illustration · project photo coming soon</span>
                ) : null}
              </div>
              {project.image && project.imageIsIllustration ? (
                <figcaption className={styles.caption}>
                  This image is illustrative and does not show the actual installation. Real project photos will be
                  added soon.
                </figcaption>
              ) : null}
            </figure>
          </div>

          <div className={styles.details}>
            {project.tags.length > 0 ? (
              <ul className={styles.tags} aria-label="Project type">
                {project.tags.map((tag, i) => (
                  <li key={tag} className={`${styles.tag} ${i > 0 ? styles.tagSecondary : ""}`}>
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <dl className={styles.facts}>
              {project.system ? (
                <div>
                  <dt>
                    <Icon name="bolt" size={18} /> System
                  </dt>
                  <dd>{project.system}</dd>
                </div>
              ) : null}
              {completed ? (
                <div>
                  <dt>
                    <Icon name="check" size={18} /> Status
                  </dt>
                  <dd>Completed {completed}</dd>
                </div>
              ) : null}
            </dl>

            <p className={styles.description}>{project.description}</p>

            <div className={styles.cta}>
              <h2 className={styles.subheading}>Interested in a system like this?</h2>
              <p>
                Every home and business is different. Tell us about your property and monthly bill and we’ll recommend a
                system for your needs.
              </p>
              <ButtonLink href={similarHref} variant="primary">
                Ask About a Similar System
              </ButtonLink>
            </div>

            <p className={styles.back}>
              <Link href="/projects">
                <Icon name="arrowRight" size={16} className={styles.flip} /> Back to all projects
              </Link>
            </p>
          </div>
          {photos.length > 1 ? (
            <div className={styles.gallery}>
              <h2 className={styles.subheading}>Project photos</h2>
              <ProjectPhotos title={project.title} photos={photos} layout="grid" />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
