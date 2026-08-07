import type { Metadata } from "next";
import { ExternalLink, Radio } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { YouTubeEmbed } from "@/components/public/youtube-embed";
import { ButtonLink } from "@/components/ui/button-link";
import {
  fetchLiveStream,
  getYouTubeChannelUrl,
  isYouTubeConfigured,
} from "@/lib/integrations/youtube";

export const metadata: Metadata = {
  title: "Watch Live",
  description:
    "Watch Alpha Fellowship Uganda services live on YouTube when available.",
};

export default async function WatchLivePage() {
  const liveStream = isYouTubeConfigured() ? await fetchLiveStream() : null;

  return (
    <>
      <PageHero
        eyebrow="Watch & listen"
        title="Join us online"
        description="Experience worship, the word of God, and prayer from wherever you are."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          {liveStream ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-red-600">
                <Radio className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium uppercase tracking-wide">
                  Live now
                </span>
              </div>
              <YouTubeEmbed
                videoId={liveStream.id}
                title={liveStream.title}
                autoplay
              />
              <p className="type-body-sm text-muted-foreground">{liveStream.title}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-white p-10 md:p-14 text-center">
              <p className="type-subheading mb-3">No live stream right now</p>
              <p className="type-body-sm text-muted-foreground mb-8 max-w-md mx-auto">
                {isYouTubeConfigured()
                  ? "Check back during our Tuesday or Sunday gatherings, or browse recent sermons."
                  : "YouTube integration is not configured yet. Visit our channel directly below."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <ButtonLink href="/sermons">Browse sermons</ButtonLink>
                <ButtonLink
                  href={getYouTubeChannelUrl()}
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  YouTube channel
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
