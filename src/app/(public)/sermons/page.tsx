import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { SermonPlayerLibrary } from "@/components/public/sermon-player-library";
import { ButtonLink } from "@/components/ui/button-link";
import { db } from "@/lib/db";
import {
  fetchFeaturedPlayback,
  fetchRecentVideos,
  getYouTubeChannelUrl,
  isYouTubeConfigured,
  mergeSermonVideos,
  type YouTubeVideo,
} from "@/lib/integrations/youtube";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Watch recent sermons and messages from Alpha Fellowship Uganda.",
};

export const revalidate = 1800;

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

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v: videoFromQuery } = await searchParams;
  const configured = isYouTubeConfigured();
  const [dbSermons, youtubeVideos, featured] = await Promise.all([
    getDbSermons(),
    configured ? fetchRecentVideos(50) : Promise.resolve([]),
    configured ? fetchFeaturedPlayback() : Promise.resolve(null),
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
        imageKey="sermons"
        eyebrow="Messages"
        title="Sermons & teachings"
        description="Watch live services and recorded messages here — no need to leave the site."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          {videos.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-10 md:p-14 text-center">
              <p className="type-subheading mb-3">Sermons coming soon</p>
              <p className="type-body-sm mx-auto mb-4 max-w-md text-muted-foreground">
                {configured
                  ? "We could not load videos from YouTube yet. Confirm YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID are set on Vercel, then redeploy."
                  : "Add YOUTUBE_API_KEY (and optionally YOUTUBE_CHANNEL_ID) in Vercel environment variables, then redeploy."}
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
            />
          )}
        </div>
      </section>
    </>
  );
}
