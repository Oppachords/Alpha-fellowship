"use client";

import { useEffect, useState } from "react";
import { Calendar, Play, Radio } from "lucide-react";
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

function formatTitle(title: string) {
  return title.replace(/\s+/g, " ").trim();
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

  const displayTitle = formatTitle(video.title);

  return (
    <div className={cn("space-y-5", className)}>
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)] ring-1 ring-black/5">
        {!playing ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 text-left"
            aria-label={`Play ${displayTitle}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnailUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-70 transition duration-700 group-hover:scale-[1.15] group-hover:opacity-80"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnailUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-700 group-hover:opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25 transition duration-500 group-hover:from-black/95 group-hover:via-black/60" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-10 text-center sm:px-10">
              {video.isLive ? (
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-100 backdrop-blur-sm">
                  <Radio className="h-3.5 w-3.5 animate-pulse" />
                  Live now
                </span>
              ) : (
                <span className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm transition duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  Watch message
                </span>
              )}

              <h2 className="font-heading max-w-3xl text-balance text-2xl font-bold leading-tight text-white drop-shadow-lg transition duration-500 sm:text-3xl md:text-4xl translate-y-3 group-hover:translate-y-0">
                {displayTitle}
              </h2>

              <div className="mt-7 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_40px_-12px_rgba(59,130,246,0.85)] transition duration-500 scale-90 group-hover:scale-100 group-hover:bg-primary/95">
                <Play className="ml-1 h-7 w-7 fill-current" />
              </div>

              {video.description && (
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 line-clamp-2 transition duration-500 delay-75 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 sm:text-base">
                  {video.description}
                </p>
              )}
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={displayTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>

      {showDetails && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
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
  index?: number;
  onSelect: () => void;
};

export function VideoSelectCard({ video, selected, index = 0, onSelect }: VideoSelectCardProps) {
  const displayTitle = formatTitle(video.title);

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "group overflow-hidden rounded-2xl border bg-white text-left transition duration-300 hover:-translate-y-1",
        selected
          ? "border-primary shadow-[0_16px_40px_-24px_rgba(59,130,246,0.8)] ring-2 ring-primary/20"
          : "border-border hover:border-primary/25 hover:shadow-lg"
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

      <div className="border-t border-border/70 px-4 py-3">
        <p className="type-body-sm text-muted-foreground">
          {formatPublishedDate(video.publishedAt)}
        </p>
        {video.description && (
          <p className="mt-1 line-clamp-2 text-sm text-foreground/70">{video.description}</p>
        )}
      </div>
    </button>
  );
}
