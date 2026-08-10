import Image from "next/image";
import { AnimatedSection } from "@/components/public/animated-section";
import type { PublicLeader } from "@/lib/content/format-service";

type LeadershipProfileCardProps = {
  leader: PublicLeader;
  index?: number;
};

export function LeadershipProfileCard({ leader, index = 0 }: LeadershipProfileCardProps) {
  return (
    <AnimatedSection delay={index * 0.1}>
      <article className="overflow-hidden rounded-2xl border border-border bg-white transition-shadow duration-300 hover:shadow-lg">
        <div className="grid grid-cols-1 items-center lg:grid-cols-2">
          {leader.photoUrl ? (
            <div className="relative aspect-[4/5] w-full bg-muted lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={leader.photoUrl}
                alt={leader.name}
                fill
                className="object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center bg-cream text-sm text-muted-foreground lg:aspect-auto lg:min-h-[420px]">
              Photo coming soon
            </div>
          )}
          <div className="p-7 text-center lg:p-10 lg:text-left">
            <h3 className="type-subheading mb-1">{leader.name}</h3>
            <p className="type-label mb-4">{leader.position}</p>
            {leader.bio && (
              <p className="type-body-sm text-muted-foreground">{leader.bio}</p>
            )}
          </div>
        </div>
      </article>
    </AnimatedSection>
  );
}
