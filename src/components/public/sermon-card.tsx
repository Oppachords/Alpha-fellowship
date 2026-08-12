"use client";

import { useMemo, useState } from "react";
import { Play, Radio } from "lucide-react";
import { YouTubeEmbed } from "@/components/public/youtube-embed";
import type { YouTubeVideo } from "@/lib/integrations/youtube";
import { cn } from "@/lib/utils";

type CompactSermonCardProps = {
  video: YouTubeVideo;
  selected?: boolean;
  onSelect?: () => void;
};

export function CompactSermonCard({ video, selected, onSelect }: CompactSermonCardProps) {
  const content = (
    <>
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
            <Play className="ml-0.5 h-5 w-5 fill-foreground text-foreground" />
          </div>
        </div>
        {video.isLive && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            LIVE
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-medium text-foreground">{video.title}</h3>
      </div>
    </>
  );

  const className = cn(
    "group overflow-hidden rounded-2xl border bg-white text-left transition-all duration-200",
    selected ? "border-primary ring-2 ring-primary/20 shadow-md" : "border-border hover:shadow-sm"
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={className}>
        {content}
      </button>
    );
  }

  return <article className={className}>{content}</article>;
}

type SermonCardGridProps = {
  videos: YouTubeVideo[];
  selectedId?: string;
  onSelect: (videoId: string) => void;
};

export function SermonCardGrid({ videos, selectedId, onSelect }: SermonCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <CompactSermonCard
          key={video.id}
          video={video}
          selected={video.id === selectedId}
          onSelect={() => onSelect(video.id)}
        />
      ))}
    </div>
  );
}

export function SermonCard({ video }: { video: YouTubeVideo }) {
  return <CompactSermonCard video={video} />;
}

export function InlineSermonPlayer({
  videos,
  initialVideoId,
  liveMode = false,
}: {
  videos: YouTubeVideo[];
  initialVideoId?: string;
  liveMode?: boolean;
}) {
  const defaultId = initialVideoId ?? videos[0]?.id;
  const [selectedId, setSelectedId] = useState(defaultId);

  const selectedVideo = useMemo(
    () => videos.find((video) => video.id === selectedId) ?? videos[0],
    [videos, selectedId]
  );

  if (!selectedVideo) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {liveMode && selectedVideo.isLive ? (
          <div className="flex items-center gap-2 text-red-600">
            <Radio className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium uppercase tracking-wide">Live now</span>
          </div>
        ) : liveMode ? (
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              No live stream now
            </p>
            <p className="type-body-sm text-muted-foreground">Showing our latest sermon</p>
          </div>
        ) : null}
        <YouTubeEmbed
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          autoplay={selectedVideo.isLive}
        />
        <p className="type-subheading text-base sm:text-lg">{selectedVideo.title}</p>
      </div>
      {videos.length > 1 && (
        <SermonCardGrid
          videos={videos}
          selectedId={selectedVideo.id}
          onSelect={setSelectedId}
        />
      )}
    </div>
  );
}
