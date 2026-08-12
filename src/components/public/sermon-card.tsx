import Link from "next/link";
import { Play, Radio } from "lucide-react";
import type { YouTubeVideo } from "@/lib/integrations/youtube";
import { cn } from "@/lib/utils";

function formatTitle(title: string) {
  return title.replace(/\s+/g, " ").trim();
}

type CompactSermonCardProps = {
  video: YouTubeVideo;
  className?: string;
};

export function CompactSermonCard({ video, className }: CompactSermonCardProps) {
  const displayTitle = formatTitle(video.title);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-border bg-white transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl opacity-50 transition duration-500 group-hover:opacity-70"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailUrl}
          alt={displayTitle}
          className="relative h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition duration-500 group-hover:opacity-95" />

        <div className="absolute inset-x-0 bottom-0 p-4 transition duration-500 translate-y-2 group-hover:translate-y-0">
          <p className="font-heading line-clamp-2 text-base font-semibold leading-snug text-white drop-shadow">
            {displayTitle}
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-foreground shadow-lg">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </div>
        </div>

        {video.isLive && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            <Radio className="h-3 w-3" />
            Live
          </span>
        )}
      </div>
    </article>
  );
}

export function SermonCard({ video }: { video: YouTubeVideo }) {
  return <CompactSermonCard video={video} />;
}
