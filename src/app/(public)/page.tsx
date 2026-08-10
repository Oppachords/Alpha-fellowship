import type { Metadata } from "next";
import { HeroSection } from "@/components/public/sections/hero-section";
import { HeartbeatSection } from "@/components/public/sections/heartbeat-section";
import { PillarsSection } from "@/components/public/sections/pillars-section";
import { GatheringsSection } from "@/components/public/sections/gatherings-section";
import { WatchLiveSection } from "@/components/public/sections/watch-live-section";
import { CommunitySection } from "@/components/public/sections/community-section";
import { ComeAndSeeSection } from "@/components/public/sections/come-and-see-section";
import { churchContent } from "@/lib/content/church-content";
import { getPublicServices } from "@/lib/content/queries";

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

export default async function HomePage() {
  const { services } = await getPublicServices();

  return (
    <>
      <HeroSection />
      <HeartbeatSection />
      <PillarsSection />
      <GatheringsSection
        services={services}
        serviceDescription={churchContent.serviceDescription}
      />
      <WatchLiveSection />
      <CommunitySection />
      <ComeAndSeeSection />
    </>
  );
}
