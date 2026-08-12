import { VideoThumbnailArt } from "@/components/public/video-thumbnail-art";
import type { YouTubeVideo } from "@/lib/integrations/youtube";
import { cn } from "@/lib/utils";

type CompactSermonCardProps = {
  video: YouTubeVideo;
  className?: string;
};

export function CompactSermonCard({ video, className }: CompactSermonCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-border bg-white transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <VideoThumbnailArt video={video} variant="card" />
      </div>
    </article>
  );
}

export function SermonCard({ video }: { video: YouTubeVideo }) {
  return <CompactSermonCard video={video} />;
}
