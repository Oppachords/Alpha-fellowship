import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { InlineSermonPlayer } from "@/components/public/sermon-card";
import { ButtonLink } from "@/components/ui/button-link";
import {
  fetchFeaturedPlayback,
  fetchRecentVideos,
  getYouTubeChannelUrl,
  mergeSermonVideos,
} from "@/lib/integrations/youtube";

export const metadata: Metadata = {
  title: "Watch Live",
  description:
    "Watch Alpha Fellowship Uganda services live or catch up on the latest message.",
};

export const revalidate = 300;

export default async function WatchLivePage() {
  const [featured, youtubeVideos] = await Promise.all([
    fetchFeaturedPlayback(),
    fetchRecentVideos(50),
  ]);

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
                No live stream right now. Browse recorded messages on the sermons page
                or visit our YouTube channel.
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
