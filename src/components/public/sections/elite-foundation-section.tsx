import Image from "next/image";
import { churchContent } from "@/lib/content/church-content";

type EliteFoundationSectionProps = {
  name?: string;
  schedule?: string | null;
  description?: string | null;
};

export function EliteFoundationSection({
  name = churchContent.eliteFoundation.name,
  schedule,
  description,
}: EliteFoundationSectionProps) {
  const body =
    description ??
    `${churchContent.eliteFoundation.mission}\n\n${churchContent.eliteFoundation.vision}`;
  const scheduleLine =
    schedule ?? `Founded ${churchContent.eliteFoundation.founded}`;

  return (
    <section className="section-padding bg-cream">
      <div className="site-shell">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-10 lg:gap-16 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[320px]">
              <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/10" />
              <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-[2rem] bg-sky/10" />
              <div className="relative rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-border/60">
                <Image
                  src="/images/elite-foundation-logo.png"
                  alt={`${name} logo`}
                  width={280}
                  height={280}
                  className="mx-auto h-auto w-full max-w-[240px] object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <div>
            <p className="type-eyebrow mb-4">{name}</p>
            <h2 className="type-heading mb-4">Where hope meets action</h2>
            {scheduleLine && (
              <p className="type-body-sm text-muted-foreground mb-6">{scheduleLine}</p>
            )}
            {body.split(/\n\n+/).map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="type-body text-muted-foreground mb-4 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
            <ul className="flex flex-wrap gap-3 mt-8">
              {churchContent.eliteFoundation.focusAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-border bg-white px-4 py-2 type-body-sm text-foreground"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
