import type { MetadataRoute } from "next";

const publicRoutes = [
  "",
  "/about",
  "/services",
  "/contact",
  "/give",
  "/members",
  "/events",
  "/ministries",
  "/campaigns",
  "/watch-live",
  "/sermons",
  "/blog",
  "/gallery",
  "/get-involved",
  "/get-involved/volunteer",
  "/faq",
  "/prayer-request",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.AUTH_URL ??
    "https://alpha-fellowship.vercel.app";

  const origin = baseUrl.replace(/\/$/, "");
  const lastModified = new Date();

  return publicRoutes.map((path) => ({
    url: `${origin}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
