import { Play, Radio } from "lucide-react";
import type { YouTubeVideo } from "@/lib/integrations/youtube";
import { cn } from "@/lib/utils";

export function formatVideoTitle(title: string) {
  return title.replace(/\s+/g, " ").trim();
}

export function getVideoThumbnailUrl(video: YouTubeVideo) {
  return video.thumbnailUrl.replace(/\/(hqdefault|mqdefault|default)\.jpg$/, "/maxresdefault.jpg");
}

type VideoThumbnailArtProps = {
  video: YouTubeVideo;
  variant?: "hero" | "card";
  showPlayOnHover?: boolean;
};

export function VideoThumbnailArt({
  video,
  variant = "card",
  showPlayOnHover = true,
}: VideoThumbnailArtProps) {
  const displayTitle = formatVideoTitle(video.title);
  const thumbnail = getVideoThumbnailUrl(video);
  const isHero = variant === "hero";

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-35 transition duration-500 group-hover:opacity-45"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt={displayTitle}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-black/20 transition duration-500 group-hover:bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/10" />

      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center text-center",
          isHero ? "px-6 py-10 sm:px-10" : "px-4 py-5"
        )}
      >
        {video.isLive && (
          <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            <Radio className="h-3 w-3" />
            Live
          </span>
        )}

        <h3
          className={cn(
            "font-heading max-w-[92%] text-balance font-semibold leading-snug text-white drop-shadow-md",
            isHero ? "text-xl sm:text-2xl md:text-3xl" : "line-clamp-2 text-sm sm:text-base"
          )}
        >
          {displayTitle}
        </h3>

        {video.description ? (
          <p
            className={cn(
              "mt-2 max-w-[90%] text-white/85 line-clamp-2 drop-shadow",
              isHero ? "text-sm sm:text-base" : "text-xs sm:text-sm"
            )}
          >
            {video.description}
          </p>
        ) : null}

        {isHero && (
          <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition duration-300 scale-95 group-hover:scale-100 sm:h-16 sm:w-16">
            <Play className="ml-1 h-6 w-6 fill-current sm:h-7 sm:w-7" />
          </div>
        )}
      </div>

      {showPlayOnHover && !isHero && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-foreground shadow-lg">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </div>
        </div>
      )}
    </>
  );
}
