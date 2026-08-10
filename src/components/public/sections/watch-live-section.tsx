import { Play, Radio } from "lucide-react";
import { AnimatedSection } from "@/components/public/animated-section";
import { YouTubeIcon } from "@/components/public/brand-icons";
import { YouTubeEmbed } from "@/components/public/youtube-embed";
import { ButtonLink } from "@/components/ui/button-link";
import { churchContent } from "@/lib/content/church-content";
import {
  fetchFeaturedPlayback,
  isYouTubeConfigured,
} from "@/lib/integrations/youtube";

export async function WatchLiveSection() {
  const featured = isYouTubeConfigured() ? await fetchFeaturedPlayback() : null;

  return (
    <section
      data-nav-theme="dark"
      className="section-padding bg-sky-deep text-white overflow-hidden section-fade-in"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection>
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
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 font-sans text-sm font-bold bg-[#FF0000] text-white hover:bg-[#CC0000] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTubeIcon className="mr-2 h-4 w-4" />
                  YouTube Channel
                </ButtonLink>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            {featured ? (
              <div className="space-y-4">
                {featured.mode === "live" && (
                  <div className="flex items-center gap-2 text-red-400">
                    <Radio className="h-4 w-4 animate-pulse" />
                    <span className="text-sm font-medium uppercase tracking-wide">
                      Live now
                    </span>
                  </div>
                )}
                {featured.mode === "recent" && (
                  <p className="text-sm text-white/70 uppercase tracking-wide">
                    Most recent message
                  </p>
                )}
                <YouTubeEmbed
                  videoId={featured.video.id}
                  title={featured.video.title}
                  autoplay={featured.mode === "live"}
                />
                <p className="text-sm text-white/70 line-clamp-2">
                  {featured.video.title}
                </p>
              </div>
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/10 border border-white/20 flex flex-col items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm mb-5">
                  <Play className="h-9 w-9 text-white fill-white ml-1" />
                </div>
                <p className="text-white/70 text-sm mb-4 px-6 text-center">
                  Live stream appears here when available
                </p>
                <ButtonLink
                  variant="link"
                  href="/sermons"
                  className="text-white hover:text-white/80"
                >
                  Browse Sermons
                </ButtonLink>
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
