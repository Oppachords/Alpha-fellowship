import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { SermonCard } from "@/components/public/sermon-card";
import { ButtonLink } from "@/components/ui/button-link";
import { db } from "@/lib/db";
import {
  fetchRecentVideos,
  getYouTubeChannelUrl,
  isYouTubeConfigured,
  type YouTubeVideo,
} from "@/lib/integrations/youtube";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Watch recent sermons and messages from Alpha Fellowship Uganda.",
};

async function getDbSermons(): Promise<YouTubeVideo[]> {
  try {
    const sermons = await db.sermon.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { sermonDate: "desc" }],
      take: 12,
    });

    return sermons
      .filter((sermon) => sermon.youtubeId)
      .map((sermon) => ({
        id: sermon.youtubeId!,
        title: sermon.title,
        description: sermon.description ?? "",
        thumbnailUrl: sermon.thumbnailUrl ?? "",
        publishedAt: sermon.sermonDate?.toISOString() ?? sermon.createdAt.toISOString(),
      }));
  } catch {
    return [];
  }
}

export default async function SermonsPage() {
  const [dbSermons, youtubeVideos] = await Promise.all([
    getDbSermons(),
    isYouTubeConfigured() ? fetchRecentVideos(12) : Promise.resolve([]),
  ]);

  const videos = dbSermons.length > 0 ? dbSermons : youtubeVideos;

  return (
    <>
      <PageHero
        imageKey="sermons"
        eyebrow="Messages"
        title="Sermons & teachings"
        description="Recent messages from Alpha Fellowship Uganda."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          {videos.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-10 md:p-14 text-center">
              <p className="type-subheading mb-3">Sermons coming soon</p>
              <p className="type-body-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Visit our YouTube channel for the latest messages and live services.
              </p>
              <ButtonLink
                href={getYouTubeChannelUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                YouTube channel
              </ButtonLink>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <SermonCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
