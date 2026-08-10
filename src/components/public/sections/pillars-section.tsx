import { churchContent } from "@/lib/content/church-content";

const pillars = [
  {
    label: "Worship",
    title: "Gather in praise",
    description:
      "Come as you are and experience live worship, sharing of the word of God, and a time of prayer and fellowship. All are welcome.",
  },
  {
    label: "Pray",
    title: "Walk in faith together",
    description:
      "Join us for a journey of faith, prayer, counselling and guidance. We are a vibrant prayerful community walking this walk of faith together.",
  },
  {
    label: "Grow",
    title: "Transform young lives",
    description: churchContent.vision,
  },
];

export function PillarsSection() {
  return (
    <section data-nav-theme="light" className="section-padding bg-cream section-fade-in">
      <div className="container-wide">
        <p className="type-eyebrow mb-4 text-center">What we do</p>
        <h2 className="type-heading text-center mb-14">
          Three rhythms of faith
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.label}
              className="rounded-2xl border border-border bg-white p-7 text-center"
            >
              <p className="type-label mb-4">{pillar.label}</p>
              <h3 className="type-subheading mb-3">{pillar.title}</h3>
              <p className="type-body-sm text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
