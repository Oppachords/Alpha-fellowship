"use client";

type YouTubePlayerProps = {
  videoId: string;
  autoplay?: boolean;
  title: string;
  className?: string;
};

export function YouTubePlayer({
  videoId,
  autoplay = false,
  title,
  className,
}: YouTubePlayerProps) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    iv_load_policy: "3",
  });

  if (autoplay) {
    params.set("autoplay", "1");
  }

  return (
    <div className={className} aria-label={title}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
