import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { InlineSermonPlayer } from "@/components/public/sermon-card";
import { ButtonLink } from "@/components/ui/button-link";
import {
  fetchFeaturedPlayback,
  fetchRecentVideos,
  getYouTubeChannelUrl,
  isYouTubeConfigured,
  mergeSermonVideos,
} from "@/lib/integrations/youtube";

export const metadata: Metadata = {
  title: "Watch Live",
  description:
    "Watch Alpha Fellowship Uganda services live or catch up on the latest message.",
};

export const revalidate = 300;

export default async function WatchLivePage() {
  const configured = isYouTubeConfigured();
  const [featured, youtubeVideos] = configured
    ? await Promise.all([fetchFeaturedPlayback(), fetchRecentVideos(50)])
    : [null, []];

  const videos = mergeSermonVideos(youtubeVideos);
  const initialVideoId = featured?.video.id ?? videos[0]?.id;

  return (
    <>
      <PageHero
        imageKey="watch-live"
        eyebrow="Watch & listen"
        title="Join us online"
        description="Experience worship, the word of God, and prayer without leaving the site."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-5xl">
          {videos.length > 0 && initialVideoId ? (
            <InlineSermonPlayer
              videos={videos}
              initialVideoId={initialVideoId}
              liveMode
            />
          ) : (
            <div className="rounded-2xl border border-border bg-white p-10 md:p-14 text-center">
              <p className="type-subheading mb-3">No live stream right now</p>
              <p className="type-body-sm mx-auto mb-8 max-w-md text-muted-foreground">
                {configured
                  ? "We could not load videos from YouTube. Check YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID on Vercel, then redeploy."
                  : "Add YOUTUBE_API_KEY in Vercel environment variables, then redeploy."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <ButtonLink href="/sermons">Browse sermons</ButtonLink>
                <ButtonLink
                  href={getYouTubeChannelUrl()}
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
