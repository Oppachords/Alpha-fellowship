export const heroImages = {
  sanctuary: "/images/hero-sanctuary.png",
  worshipCommunity: "/images/heroes/worship-community.png",
  worshipGathering: "/images/heroes/worship-gathering.png",
  sunsetSilhouettes: "/images/heroes/sunset-silhouettes.png",
  sunsetWorship: "/images/heroes/sunset-worship.png",
  fellowshipOutdoors: "/images/heroes/fellowship-outdoors.png",
  worshipBand: "/images/heroes/worship-band.png",
  smallGroupPrayer: "/images/heroes/small-group-prayer.png",
} as const;

export const homeHeroImages = [
  heroImages.sanctuary,
  heroImages.worshipCommunity,
  heroImages.worshipGathering,
  heroImages.sunsetWorship,
  heroImages.fellowshipOutdoors,
  heroImages.worshipBand,
  heroImages.smallGroupPrayer,
  heroImages.sunsetSilhouettes,
];

export type HeroPageKey =
  | "default"
  | "about"
  | "services"
  | "sermons"
  | "events"
  | "ministries"
  | "contact"
  | "give"
  | "blog"
  | "gallery"
  | "faq"
  | "prayer"
  | "involved"
  | "watch-live"
  | "campaigns"
  | "members";

const pageHeroImages: Record<HeroPageKey, string[]> = {
  default: [heroImages.worshipGathering],
  about: [heroImages.fellowshipOutdoors, heroImages.worshipCommunity],
  services: [heroImages.worshipGathering, heroImages.worshipCommunity],
  sermons: [heroImages.worshipBand, heroImages.worshipGathering],
  events: [heroImages.fellowshipOutdoors, heroImages.worshipCommunity],
  ministries: [heroImages.smallGroupPrayer, heroImages.fellowshipOutdoors],
  contact: [heroImages.fellowshipOutdoors],
  give: [heroImages.sunsetWorship, heroImages.sunsetSilhouettes],
  blog: [heroImages.worshipGathering],
  gallery: [heroImages.worshipCommunity, heroImages.worshipBand],
  faq: [heroImages.smallGroupPrayer],
  prayer: [heroImages.sunsetWorship, heroImages.smallGroupPrayer],
  involved: [heroImages.fellowshipOutdoors, heroImages.smallGroupPrayer],
  "watch-live": [heroImages.worshipBand, heroImages.worshipCommunity],
  campaigns: [heroImages.fellowshipOutdoors, heroImages.sunsetWorship],
  members: [heroImages.fellowshipOutdoors, heroImages.smallGroupPrayer],
};

export function getPageHeroImages(imageKey: HeroPageKey = "default") {
  return pageHeroImages[imageKey] ?? pageHeroImages.default;
}
