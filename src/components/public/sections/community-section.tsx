import Image from "next/image";
import { Check } from "lucide-react";
import { churchContent } from "@/lib/content/church-content";

const highlights = [
  "A non-denominational fellowship working among young people",
  "Live worship, word, prayer, and fellowship every week",
  "Counselling and pastoral care for those who need it",
  "Charity, book printing, and outreach across Uganda",
];

export function CommunitySection() {
  return (
    <section id="community" className="section-padding bg-cream">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/images/hero-sanctuary.png"
              alt="Alpha Fellowship community in prayer and fellowship"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="type-eyebrow mb-4">Community</p>
            <h2 className="type-heading mb-6 text-balance">
              You&apos;re already part of the story
            </h2>
            <p className="type-body text-muted-foreground mb-8">{churchContent.story.extended}</p>
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-4 w-4 shrink-0 mt-1 text-primary" />
                  <span className="type-body-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
