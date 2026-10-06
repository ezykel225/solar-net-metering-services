import { PageHero } from "@/components/layout/PageHero";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projects",
  description: "Browse residential and commercial solar installations completed by Solar Net Metering Services.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumb="Projects"
        path="/projects"
        title="Our Solar Projects"
        intro="Residential and commercial solar installations designed to lower electricity costs for our clients."
      />
      <ProjectsSection filterable showHeading={false} />
      <div className="section--soft">
        <Testimonials />
      </div>
      <CtaBanner title="Want results like these?" />
    </>
  );
}
