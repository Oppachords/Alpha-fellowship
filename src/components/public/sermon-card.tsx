import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import type { YouTubeVideo } from "@/lib/integrations/youtube";

export function SermonCard({ video }: { video: YouTubeVideo }) {
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <article className="group rounded-2xl border border-border bg-white overflow-hidden">
      <Link
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-video overflow-hidden bg-muted"
      >
        {video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Play className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
            <Play className="h-6 w-6 text-foreground fill-foreground ml-0.5" />
          </div>
        </div>
        {video.isLive && (
          <span className="absolute top-3 left-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            LIVE
          </span>
        )}
      </Link>
      <div className="p-5">
        <h3 className="font-medium text-foreground line-clamp-2 mb-2">{video.title}</h3>
        <Link
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Watch on YouTube
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
