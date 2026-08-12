"use client";

import { useMemo, useState } from "react";
import { Calendar, Radio } from "lucide-react";
import { YouTubeEmbed } from "@/components/public/youtube-embed";
import type { YouTubeVideo } from "@/lib/integrations/youtube";
import { cn } from "@/lib/utils";

type SermonPlayerLibraryProps = {
  videos: YouTubeVideo[];
  initialVideoId?: string;
  showLiveBanner?: boolean;
};

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function SermonPlayerLibrary({
  videos,
  initialVideoId,
  showLiveBanner = false,
}: SermonPlayerLibraryProps) {
  const defaultId = initialVideoId ?? videos[0]?.id;
  const [selectedId, setSelectedId] = useState(defaultId);

  const selectedVideo = useMemo(
    () => videos.find((video) => video.id === selectedId) ?? videos[0],
    [videos, selectedId]
  );

  if (!selectedVideo) return null;

  return (
    <div className="space-y-10">
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="border-b border-border bg-cream/60 px-5 py-4 sm:px-6">
          {showLiveBanner && selectedVideo.isLive ? (
            <div className="mb-2 flex items-center gap-2 text-red-600">
              <Radio className="h-4 w-4 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wide">Live now</span>
            </div>
          ) : showLiveBanner ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              No live stream now · Latest sermon
            </p>
          ) : null}
          <h2 className="type-subheading text-balance">{selectedVideo.title}</h2>
          <p className="mt-2 flex items-center gap-2 type-body-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            {formatPublishedDate(selectedVideo.publishedAt)}
          </p>
        </div>
        <div className="p-4 sm:p-6">
          <YouTubeEmbed
            videoId={selectedVideo.id}
            title={selectedVideo.title}
            autoplay={selectedVideo.isLive}
            className="w-full"
          />
          {selectedVideo.description && (
            <p className="mt-4 type-body-sm text-muted-foreground line-clamp-3">
              {selectedVideo.description}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-eyebrow mb-2">Library</p>
            <h3 className="type-heading text-2xl sm:text-3xl">All messages</h3>
          </div>
          <p className="type-body-sm text-muted-foreground">
            {videos.length} video{videos.length === 1 ? "" : "s"} · newest first
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => {
            const isSelected = video.id === selectedVideo.id;
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => setSelectedId(video.id)}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-white text-left transition-all duration-200",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-border hover:border-primary/30 hover:shadow-sm"
                )}
              >
                <div className="relative aspect-video bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                  {video.isLive && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-foreground line-clamp-2">{video.title}</p>
                  <p className="mt-2 type-body-sm text-muted-foreground">
                    {formatPublishedDate(video.publishedAt)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
