import { PageHero } from "@/components/layout/PageHero";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projects & Results",
  description:
    "Solar installations by EG Solar Products Trading in Negros Oriental, including a hybrid solar and net-metering system with a 10.8kW array, 12kW hybrid inverter and 32kWh battery storage in Tierra Alta, Valencia.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumb="Projects"
        path="/projects"
        title="Our Solar Projects"
        intro="Recent installations and customer results from around Negros Oriental."
      />
      <ProjectsSection filterable showHeading={false} />
      <section className="section section--soft" aria-labelledby="results-title">
        <div className="container" style={{ maxWidth: 760 }}>
          <SectionHeading
            id="results-title"
            eyebrow="Customer Result"
            title="A Real Bill Before and After Solar"
            intro="A customer shared how their monthly electricity bill changed after installing a hybrid solar system."
          />
          <CaseStudyCard />
        </div>
      </section>
      <Testimonials />
      <CtaBanner spaced={false} title="Want to see what solar could do for you?" />
    </>
  );
}
