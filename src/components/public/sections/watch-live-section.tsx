import { Play, Radio } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/public/animated-section";
import { YouTubeEmbed } from "@/components/public/youtube-embed";
import { ButtonLink } from "@/components/ui/button-link";
import {
  fetchFeaturedPlayback,
  fetchRecentVideos,
  isYouTubeConfigured,
} from "@/lib/integrations/youtube";

export async function WatchLiveSection() {
  const configured = isYouTubeConfigured();
  const featured = configured ? await fetchFeaturedPlayback() : null;
  const fallbackRecent =
    configured && !featured ? (await fetchRecentVideos(1))[0] ?? null : null;
  const playback = featured ?? (fallbackRecent ? { video: fallbackRecent, mode: "recent" as const } : null);

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
                Can&apos;t make it in person? Watch our live services and recorded
                messages right here — worship, the word of God, and prayer from
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
                  href="/sermons"
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  All sermons
                </ButtonLink>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            {playback ? (
              <div className="space-y-4">
                {playback.mode === "live" ? (
                  <div className="flex items-center gap-2 text-red-400">
                    <Radio className="h-4 w-4 animate-pulse" />
                    <span className="text-sm font-medium uppercase tracking-wide">
                      Live now
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-white/70">
                      No live stream now
                    </p>
                    <p className="text-sm text-white/60">Showing our latest sermon</p>
                  </div>
                )}
                <YouTubeEmbed
                  videoId={playback.video.id}
                  title={playback.video.title}
                  autoplay={playback.mode === "live"}
                />
                <p className="text-sm text-white/70 line-clamp-2">{playback.video.title}</p>
                <Link
                  href={`/sermons?v=${playback.video.id}`}
                  className="inline-flex text-sm font-semibold text-white/90 hover:text-white hover:underline"
                >
                  Browse all messages
                </Link>
              </div>
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/10 border border-white/20 flex flex-col items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm mb-5">
                  <Play className="h-9 w-9 text-white fill-white ml-1" />
                </div>
                <p className="text-white/70 text-sm mb-4 px-6 text-center">
                  {configured
                    ? "Live stream appears here when available"
                    : "Connect YouTube in Vercel to show live and recorded services"}
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
