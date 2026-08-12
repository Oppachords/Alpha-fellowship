"use client";

import { useEffect, useState } from "react";
import { Calendar, Radio } from "lucide-react";
import { VideoThumbnailArt, formatVideoTitle } from "@/components/public/video-thumbnail-art";
import { YouTubePlayer } from "@/components/public/youtube-player";
import type { YouTubeVideo } from "@/lib/integrations/youtube";
import { cn } from "@/lib/utils";

type VideoTheaterProps = {
  video: YouTubeVideo;
  autoplay?: boolean;
  showDetails?: boolean;
  className?: string;
};

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function VideoTheater({
  video,
  autoplay = false,
  showDetails = true,
  className,
}: VideoTheaterProps) {
  const [playing, setPlaying] = useState(autoplay && Boolean(video.isLive));

  useEffect(() => {
    setPlaying(autoplay && Boolean(video.isLive));
  }, [video.id, autoplay, video.isLive]);

  const displayTitle = formatVideoTitle(video.title);

  return (
    <div className={cn("space-y-5", className)}>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-black/5 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full">
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 text-left"
            aria-label={`Play ${displayTitle}`}
          >
            <VideoThumbnailArt video={video} variant="hero" showPlayOnHover={false} />
          </button>
        ) : (
          <YouTubePlayer
            key={video.id}
            videoId={video.id}
            title={displayTitle}
            autoplay
            className="absolute inset-0"
          />
        )}
      </div>

      {showDetails && (
        <div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 font-medium text-foreground/80">
              <Calendar className="h-4 w-4 text-primary" />
              {formatPublishedDate(video.publishedAt)}
            </span>
            {video.isLive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 font-medium text-red-700">
                <Radio className="h-3.5 w-3.5" />
                Live stream
              </span>
            )}
          </div>
          <h3 className="type-subheading mt-4 text-balance text-foreground">{displayTitle}</h3>
          {video.description ? (
            <p className="type-body mt-3 max-w-3xl text-muted-foreground leading-relaxed">
              {video.description}
            </p>
          ) : (
            <p className="type-body-sm mt-3 text-muted-foreground">
              A message from Alpha Fellowship Uganda — worship, teaching, and prayer.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

type VideoSelectCardProps = {
  video: YouTubeVideo;
  selected?: boolean;
  onSelect: () => void;
};

export function VideoSelectCard({ video, selected, onSelect }: VideoSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group w-full overflow-hidden rounded-2xl border border-border bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg",
        selected && "border-primary ring-2 ring-primary/20 shadow-md"
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <VideoThumbnailArt video={video} variant="card" />
      </div>
    </button>
  );
}
