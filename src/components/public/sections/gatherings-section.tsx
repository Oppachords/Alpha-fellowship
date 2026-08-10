import { AnimatedSection } from "@/components/public/animated-section";

type GatheringsSectionProps = {
  serviceDescription: string;
};

export function GatheringsSection({ serviceDescription }: GatheringsSectionProps) {
  return (
    <section
      data-nav-theme="light"
      className="section-padding bg-background section-fade-in"
    >
      <div className="container-wide max-w-3xl">
        <AnimatedSection>
          <p className="type-eyebrow mb-4 text-center">A rhythm for the week</p>
          <h2 className="type-heading text-center mb-6">Gather with us</h2>
          <p className="type-body-lg text-muted-foreground text-center max-w-lg mx-auto">
            {serviceDescription}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
