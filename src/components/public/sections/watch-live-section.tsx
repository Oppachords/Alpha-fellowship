import { Play, ExternalLink, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { churchContent } from "@/lib/content/church-content";

export function WatchLiveSection() {
  return (
    <section className="section-padding bg-sky-deep text-white overflow-hidden">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="font-sans text-sm font-bold uppercase tracking-[0.25em] text-white/70 mb-4">
              Watch &amp; Listen
            </p>
            <h2 className="type-heading-lg mb-6">Join Us Online</h2>
            <div className="h-px w-12 bg-white/30 mb-8" />
            <p className="text-white/80 leading-relaxed mb-8 text-lg font-light">
              Can&apos;t make it in person? Watch our live services and sermons
              on YouTube. Experience worship, the word of God, and prayer from
              wherever you are.
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink
                href="/watch-live"
                className="rounded-full bg-primary hover:bg-primary/90 text-white"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Watch Live
              </ButtonLink>
              <ButtonLink
                href={churchContent.social.youtube}
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                YouTube Channel
              </ButtonLink>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/10 border border-white/20 group cursor-pointer">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm mb-5 group-hover:bg-white/25 transition-colors">
                <Play className="h-9 w-9 text-white fill-white ml-1" />
              </div>
              <p className="text-white/70 text-sm mb-4">
                Live stream appears here when available
              </p>
              <ButtonLink
                variant="link"
                href="/sermons"
                className="text-white hover:text-white/80"
              >
                Browse Sermons
                <ArrowRight className="ml-1 h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
