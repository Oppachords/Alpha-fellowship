import { churchContent } from "@/lib/content/church-content";

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  isLive?: boolean;
};

const DEFAULT_HANDLE = "alphabfellowship";

function getApiKey() {
  return process.env.YOUTUBE_API_KEY ?? null;
}

function getChannelIdFromEnv() {
  return process.env.YOUTUBE_CHANNEL_ID ?? null;
}

async function youtubeFetch<T>(path: string, revalidate: number): Promise<T | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const separator = path.includes("?") ? "&" : "?";
  const url = `https://www.googleapis.com/youtube/v3${path}${separator}key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function resolveChannelId(): Promise<string | null> {
  const fromEnv = getChannelIdFromEnv();
  if (fromEnv) return fromEnv;

  const handle = DEFAULT_HANDLE;
  const data = await youtubeFetch<{ items?: { id: string }[] }>(
    `/channels?part=id&forHandle=${handle}`,
    86400
  );

  return data?.items?.[0]?.id ?? null;
}

type SearchResponse = {
  items?: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: { high?: { url: string }; medium?: { url: string } };
      liveBroadcastContent?: string;
    };
  }[];
};

function mapVideo(item: NonNullable<SearchResponse["items"]>[number]): YouTubeVideo {
  return {
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      "",
    publishedAt: item.snippet.publishedAt,
    isLive: item.snippet.liveBroadcastContent === "live",
  };
}

export function isYouTubeConfigured() {
  return Boolean(getApiKey());
}

export async function fetchLiveStream(): Promise<YouTubeVideo | null> {
  const channelId = await resolveChannelId();
  if (!channelId) return null;

  const data = await youtubeFetch<SearchResponse>(
    `/search?part=snippet&channelId=${channelId}&eventType=live&type=video&maxResults=1`,
    120
  );

  const item = data?.items?.[0];
  if (!item) return null;

  return { ...mapVideo(item), isLive: true };
}

export async function fetchRecentVideos(limit = 12): Promise<YouTubeVideo[]> {
  const channelId = await resolveChannelId();
  if (!channelId) return [];

  const data = await youtubeFetch<SearchResponse>(
    `/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${limit}`,
    3600
  );

  return (data?.items ?? []).map(mapVideo);
}

export async function fetchFeaturedPlayback(): Promise<{
  video: YouTubeVideo;
  mode: "live" | "recent";
} | null> {
  const live = await fetchLiveStream();
  if (live) {
    return { video: live, mode: "live" };
  }

  const [recent] = await fetchRecentVideos(1);
  if (recent) {
    return { video: recent, mode: "recent" };
  }

  return null;
}

export async function fetchPreviousStreams(limit = 8): Promise<YouTubeVideo[]> {
  const featured = await fetchFeaturedPlayback();
  const videos = await fetchRecentVideos(limit + 1);

  if (!featured) return videos.slice(0, limit);

  return videos.filter((video) => video.id !== featured.video.id).slice(0, limit);
}

export function getYouTubeChannelUrl() {
  return churchContent.social.youtube;
}
