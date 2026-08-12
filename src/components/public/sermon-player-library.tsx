"use client";

import { useMemo, useRef, useState } from "react";
import { Radio } from "lucide-react";
import { VideoSelectCard, VideoTheater } from "@/components/public/video-theater";
import type { YouTubeVideo } from "@/lib/integrations/youtube";

type SermonPlayerLibraryProps = {
  videos: YouTubeVideo[];
  initialVideoId?: string;
  playbackMode?: "live" | "recent";
};

export function SermonPlayerLibrary({
  videos,
  initialVideoId,
  playbackMode,
}: SermonPlayerLibraryProps) {
  const defaultId = initialVideoId ?? videos[0]?.id;
  const [selectedId, setSelectedId] = useState(defaultId);
  const playerRef = useRef<HTMLDivElement>(null);

  const selectedVideo = useMemo(
    () => videos.find((video) => video.id === selectedId) ?? videos[0],
    [videos, selectedId]
  );

  const otherVideos = useMemo(
    () => videos.filter((video) => video.id !== selectedVideo?.id),
    [videos, selectedVideo?.id]
  );

  if (!selectedVideo) return null;

  const handleSelect = (videoId: string) => {
    setSelectedId(videoId);
    window.requestAnimationFrame(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const isLiveFeatured = playbackMode === "live" && selectedVideo.isLive;

  return (
    <div className="space-y-14">
      <div
        id="watch-player"
        ref={playerRef}
        className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-border bg-white p-4 shadow-sm sm:p-6 md:p-8"
      >
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {isLiveFeatured ? (
            <div className="inline-flex items-center gap-2 text-red-600">
              <Radio className="h-4 w-4 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.25em]">Live now</span>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                {playbackMode === "live" ? "Featured stream" : "Now playing"}
              </p>
              <p className="type-body-sm text-muted-foreground">
                {selectedVideo.isLive
                  ? "Join the live service below"
                  : "No live stream right now — catch up on our latest message"}
              </p>
            </div>
          )}
          <p className="type-body-sm text-muted-foreground">
            {videos.length} message{videos.length === 1 ? "" : "s"} available
          </p>
        </div>

        <VideoTheater
          key={selectedVideo.id}
          video={selectedVideo}
          autoplay={isLiveFeatured}
        />
      </div>

      {otherVideos.length > 0 && (
        <div>
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-eyebrow mb-2">More messages</p>
              <h3 className="type-heading text-2xl sm:text-3xl">Previous sermons</h3>
            </div>
            <p className="type-body-sm text-muted-foreground">
              Select a message to watch — the player will scroll into view
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherVideos.map((video) => (
              <VideoSelectCard
                key={video.id}
                video={video}
                onSelect={() => handleSelect(video.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
