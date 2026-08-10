import { churchContent } from "@/lib/content/church-content";

export function HeartbeatSection() {
  return (
    <section data-nav-theme="light" className="section-padding bg-background section-glow section-fade-in">
      <div className="container-content">
        <p className="type-eyebrow mb-6 text-center">Our heartbeat</p>
        <h2 className="type-heading text-center mb-8 text-balance">
          {churchContent.mission}
        </h2>
        <p className="type-body-lg text-muted-foreground text-center mb-6">
          {churchContent.story.intro}
        </p>
        <p className="type-body-lg text-muted-foreground text-center">
          {churchContent.story.description}
        </p>
      </div>
    </section>
  );
}
