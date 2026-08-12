"use client";

import { YouTubePlayer } from "@/components/public/youtube-player";

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  autoplay?: boolean;
  className?: string;
};

export function YouTubeEmbed({
  videoId,
  title,
  autoplay = false,
  className,
}: YouTubeEmbedProps) {
  return (
    <div className={className}>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full">
        <YouTubePlayer
          videoId={videoId}
          title={title}
          autoplay={autoplay}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
