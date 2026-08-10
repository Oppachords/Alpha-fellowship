import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/public/animated-section";
import { SermonCard } from "@/components/public/sermon-card";
import {
  fetchPreviousStreams,
  isYouTubeConfigured,
} from "@/lib/integrations/youtube";

export async function PreviousStreamsSection() {
  const videos = isYouTubeConfigured() ? await fetchPreviousStreams(6) : [];

  if (videos.length === 0) return null;

  return (
    <section
      data-nav-theme="light"
      className="section-padding bg-background section-fade-in"
    >
      <div className="container-wide">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="type-eyebrow mb-3">On demand</p>
              <h2 className="type-heading">Previously streamed</h2>
            </div>
            <Link
              href="/sermons"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View all recordings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <AnimatedSection key={video.id} delay={index * 0.06}>
              <SermonCard video={video} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
