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
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });

  if (autoplay) {
    params.set("autoplay", "1");
  }

  return (
    <div className={className}>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
