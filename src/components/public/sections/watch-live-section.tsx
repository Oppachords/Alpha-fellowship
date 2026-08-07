import { Play, ExternalLink, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { churchContent } from "@/lib/content/church-content";

export function WatchLiveSection() {
  return (
    <section className="section-padding bg-brand-dark text-white overflow-hidden">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="eyebrow text-brand-gold mb-4">Watch &amp; Listen</p>
            <h2 className="heading-section text-white mb-6">
              Join Us Online
            </h2>
            <div className="divider-gold mb-8" />
            <p className="text-white/65 leading-relaxed mb-8 text-lg font-light">
              Can&apos;t make it in person? Watch our live services and sermons
              on YouTube. Experience worship, the word of God, and prayer from
              wherever you are.
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink
                href="/watch-live"
                className="rounded-full bg-brand hover:bg-brand/90 text-white"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Watch Live
              </ButtonLink>
              <ButtonLink
                href={churchContent.social.youtube}
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                YouTube Channel
              </ButtonLink>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/20 backdrop-blur-sm mb-5 group-hover:bg-brand/30 transition-colors">
                <Play className="h-9 w-9 text-brand-gold fill-brand-gold ml-1" />
              </div>
              <p className="text-white/50 text-sm mb-4">
                Live stream appears here when available
              </p>
              <ButtonLink
                variant="link"
                href="/sermons"
                className="text-brand-gold hover:text-brand-gold/80"
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
