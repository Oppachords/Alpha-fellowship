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
const MAX_VIDEOS = 50;

function getApiKey() {
  return process.env.YOUTUBE_API_KEY ?? null;
}

function getChannelIdFromEnv() {
  return process.env.YOUTUBE_CHANNEL_ID ?? null;
}

function extractHandleFromUrl(url: string) {
  const match = url.match(/youtube\.com\/@([a-zA-Z0-9._-]+)/i);
  return match?.[1] ?? null;
}

async function youtubeFetch<T>(path: string, revalidate: number): Promise<T | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const separator = path.includes("?") ? "&" : "?";
  const url = `https://www.googleapis.com/youtube/v3${path}${separator}key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate } });
    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        const body = await response.text();
        console.error("[YouTube API]", response.status, body.slice(0, 200));
      }
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[YouTube API] fetch failed", error);
    }
    return null;
  }
}

async function resolveChannelId(): Promise<string | null> {
  const fromEnv = getChannelIdFromEnv();
  if (fromEnv) return fromEnv;

  const handles = [
    extractHandleFromUrl(churchContent.social.youtube),
    DEFAULT_HANDLE,
  ].filter((value, index, array): value is string => Boolean(value) && array.indexOf(value) === index);

  for (const handle of handles) {
    const data = await youtubeFetch<{ items?: { id: string }[] }>(
      `/channels?part=id&forHandle=${handle}`,
      86400
    );
    const channelId = data?.items?.[0]?.id;
    if (channelId) return channelId;
  }

  return null;
}

async function getUploadsPlaylistId(channelId: string) {
  const data = await youtubeFetch<{
    items?: {
      contentDetails?: { relatedPlaylists?: { uploads?: string } };
    }[];
  }>(`/channels?part=contentDetails&id=${channelId}`, 86400);

  return data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

type PlaylistItemsResponse = {
  items?: {
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: { high?: { url: string }; medium?: { url: string } };
      resourceId: { videoId: string };
      liveBroadcastContent?: string;
    };
  }[];
};

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

function mapPlaylistItem(item: NonNullable<PlaylistItemsResponse["items"]>[number]): YouTubeVideo {
  const videoId = item.snippet.resourceId.videoId;
  return {
    id: videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    publishedAt: item.snippet.publishedAt,
    isLive: item.snippet.liveBroadcastContent === "live",
  };
}

function mapSearchItem(item: NonNullable<SearchResponse["items"]>[number]): YouTubeVideo {
  return {
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
    publishedAt: item.snippet.publishedAt,
    isLive: item.snippet.liveBroadcastContent === "live",
  };
}

export function isYouTubeConfigured() {
  return Boolean(getApiKey());
}

export function mergeSermonVideos(...sources: YouTubeVideo[][]) {
  const map = new Map<string, YouTubeVideo>();

  for (const source of sources) {
    for (const video of source) {
      if (!video.id) continue;
      map.set(video.id, { ...map.get(video.id), ...video });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function fetchRecentVideos(limit = MAX_VIDEOS): Promise<YouTubeVideo[]> {
  const channelId = await resolveChannelId();
  if (!channelId) return [];

  const uploadsPlaylistId = await getUploadsPlaylistId(channelId);
  if (uploadsPlaylistId) {
    const capped = Math.min(limit, 50);
    const data = await youtubeFetch<PlaylistItemsResponse>(
      `/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${capped}`,
      1800
    );

    const fromPlaylist = (data?.items ?? []).map(mapPlaylistItem);
    if (fromPlaylist.length > 0) return fromPlaylist;
  }

  const data = await youtubeFetch<SearchResponse>(
    `/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${Math.min(limit, 50)}`,
    1800
  );

  return (data?.items ?? []).map(mapSearchItem);
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

  return { ...mapSearchItem(item), isLive: true };
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
