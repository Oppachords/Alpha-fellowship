import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { SermonPlayerLibrary } from "@/components/public/sermon-player-library";
import { ButtonLink } from "@/components/ui/button-link";
import { db } from "@/lib/db";
import {
  fetchFeaturedPlayback,
  fetchRecentVideos,
  getYouTubeChannelUrl,
  mergeSermonVideos,
  type YouTubeVideo,
} from "@/lib/integrations/youtube";

export const metadata: Metadata = {
  title: "Watch Live",
  description:
    "Watch Alpha Fellowship Uganda services live or explore recent sermons and teachings.",
};

export const revalidate = 300;

async function getDbSermons(): Promise<YouTubeVideo[]> {
  try {
    const sermons = await db.sermon.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { sermonDate: "desc" }],
      take: 50,
    });

    return sermons
      .filter((sermon) => sermon.youtubeId)
      .map((sermon) => ({
        id: sermon.youtubeId!,
        title: sermon.title,
        description: sermon.description ?? "",
        thumbnailUrl:
          sermon.thumbnailUrl ?? `https://i.ytimg.com/vi/${sermon.youtubeId}/hqdefault.jpg`,
        publishedAt: sermon.sermonDate?.toISOString() ?? sermon.createdAt.toISOString(),
      }));
  } catch {
    return [];
  }
}

export default async function WatchLivePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v: videoFromQuery } = await searchParams;
  const [dbSermons, youtubeVideos, featured] = await Promise.all([
    getDbSermons(),
    fetchRecentVideos(50),
    fetchFeaturedPlayback(),
  ]);

  const videos = mergeSermonVideos(youtubeVideos, dbSermons);
  const initialVideoId =
    (videoFromQuery && videos.some((video) => video.id === videoFromQuery)
      ? videoFromQuery
      : undefined) ??
    featured?.video.id ??
    videos[0]?.id;

  return (
    <>
      <PageHero
        imageKey="watch-live"
        eyebrow="Watch & listen"
        title="Watch live & sermons"
        description="Join live services when we're streaming, or explore recent messages — all right here."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          {videos.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center md:p-14">
              <p className="type-subheading mb-3">Messages coming soon</p>
              <p className="type-body-sm mx-auto mb-4 max-w-md text-muted-foreground">
                We&apos;re syncing videos from our YouTube channel. Check back shortly,
                or visit the channel directly below.
              </p>
              <ButtonLink href={getYouTubeChannelUrl()} target="_blank" rel="noopener noreferrer">
                Visit YouTube channel
              </ButtonLink>
            </div>
          ) : (
            <SermonPlayerLibrary
              key={initialVideoId}
              videos={videos}
              initialVideoId={initialVideoId}
              playbackMode={featured?.mode}
            />
          )}
        </div>
      </section>
    </>
  );
}
