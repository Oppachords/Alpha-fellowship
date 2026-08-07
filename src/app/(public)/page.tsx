import type { Metadata } from "next";
import { HeroSection } from "@/components/public/sections/hero-section";
import { HeartbeatSection } from "@/components/public/sections/heartbeat-section";
import { PillarsSection } from "@/components/public/sections/pillars-section";
import { GatheringsSection } from "@/components/public/sections/gatherings-section";
import { WatchLiveSection } from "@/components/public/sections/watch-live-section";
import { CommunitySection } from "@/components/public/sections/community-section";
import { ComeAndSeeSection } from "@/components/public/sections/come-and-see-section";
import { churchContent } from "@/lib/content/church-content";

export const metadata: Metadata = {
  title: "Alpha Fellowship Uganda | Worship, Pray & Grow Together",
  description:
    "Alpha Fellowship is a non-denominational fellowship working among young people in Kampala, Uganda. Setting Ablaze all Nations for Christ.",
  openGraph: {
    title: "Alpha Fellowship Uganda",
    description: churchContent.tagline,
    type: "website",
    locale: "en_UG",
    siteName: "Alpha Fellowship Uganda",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HeartbeatSection />
      <PillarsSection />
      <GatheringsSection />
      <WatchLiveSection />
      <CommunitySection />
      <ComeAndSeeSection />
    </>
  );
}
