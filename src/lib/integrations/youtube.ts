import { churchContent } from "@/lib/content/church-content";

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  isLive?: boolean;
};

export type YouTubeHealth = {
  configured: boolean;
  channelId: string | null;
  videoCount: number;
  error: string | null;
};

const DEFAULT_HANDLE = "alphabfellowship";
const KNOWN_CHANNEL_ID = "UCFQ3S1UouA2OPlPZLISnbXA";
const MAX_VIDEOS = 50;

function getApiKey() {
  return process.env.YOUTUBE_API_KEY?.trim() || null;
}

function getChannelIdFromEnv() {
  return process.env.YOUTUBE_CHANNEL_ID?.trim() || null;
}

function extractHandleFromUrl(url: string) {
  const match = url.match(/youtube\.com\/@([a-zA-Z0-9._-]+)/i);
  return match?.[1] ?? null;
}

function parseChannelEnvValue(raw: string) {
  const handleFromUrl = extractHandleFromUrl(raw);
  if (handleFromUrl) return { handle: handleFromUrl };

  if (raw.startsWith("@")) {
    return { handle: raw.slice(1) };
  }

  if (/^UC[\w-]{22}$/.test(raw)) {
    return { channelId: raw };
  }

  if (!raw.includes("/") && !raw.startsWith("UC")) {
    return { handle: raw };
  }

  return { channelId: raw };
}

type YouTubeFetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

async function youtubeFetch<T>(path: string, revalidate: number): Promise<YouTubeFetchResult<T>> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, status: 0, message: "YOUTUBE_API_KEY is not set" };
  }

  const separator = path.includes("?") ? "&" : "?";
  const url = `https://www.googleapis.com/youtube/v3${path}${separator}key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate } });
    if (!response.ok) {
      let message = `YouTube API returned ${response.status}`;
      try {
        const body = (await response.json()) as {
          error?: { message?: string; errors?: { reason?: string }[] };
        };
        const apiMessage = body.error?.message;
        const reason = body.error?.errors?.[0]?.reason;
        if (apiMessage) message = apiMessage;
        if (response.status === 403 && reason === "accessNotConfigured") {
          message =
            "YouTube Data API v3 is not enabled for this Google Cloud project.";
        }
        if (response.status === 403 && /referer|ip|API key/i.test(message)) {
          message +=
            " Server-side requests need an unrestricted API key (or IP restriction), not HTTP referrer restriction.";
        }
      } catch {
        // Keep generic message when response body is not JSON.
      }

      console.error("[YouTube API]", path, message);
      return { ok: false, status: response.status, message };
    }

    return { ok: true, data: (await response.json()) as T };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed";
    console.error("[YouTube API] fetch failed", path, message);
    return { ok: false, status: 0, message };
  }
}

async function resolveChannelIdByHandle(handle: string): Promise<string | null> {
  const data = await youtubeFetch<{ items?: { id: string }[] }>(
    `/channels?part=id&forHandle=${encodeURIComponent(handle)}`,
    86400
  );

  if (!data.ok) return null;
  return data.data.items?.[0]?.id ?? null;
}

async function resolveChannelId(): Promise<string | null> {
  const fromEnv = getChannelIdFromEnv();
  if (fromEnv) {
    const parsed = parseChannelEnvValue(fromEnv);
    if (parsed.channelId) return parsed.channelId;
    if (parsed.handle) {
      const channelId = await resolveChannelIdByHandle(parsed.handle);
      if (channelId) return channelId;
    }
  }

  const handles = [
    extractHandleFromUrl(churchContent.social.youtube),
    DEFAULT_HANDLE,
  ].filter((value, index, array): value is string => Boolean(value) && array.indexOf(value) === index);

  for (const handle of handles) {
    const channelId = await resolveChannelIdByHandle(handle);
    if (channelId) return channelId;
  }

  return KNOWN_CHANNEL_ID;
}

async function getUploadsPlaylistId(channelId: string) {
  const data = await youtubeFetch<{
    items?: {
      contentDetails?: { relatedPlaylists?: { uploads?: string } };
    }[];
  }>(`/channels?part=contentDetails&id=${channelId}`, 86400);

  if (!data.ok) return null;
  return data.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
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

    if (data.ok) {
      const fromPlaylist = (data.data.items ?? []).map(mapPlaylistItem);
      if (fromPlaylist.length > 0) return fromPlaylist;
    }
  }

  const data = await youtubeFetch<SearchResponse>(
    `/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${Math.min(limit, 50)}`,
    1800
  );

  if (!data.ok) return [];
  return (data.data.items ?? []).map(mapSearchItem);
}

export async function fetchLiveStream(): Promise<YouTubeVideo | null> {
  const channelId = await resolveChannelId();
  if (!channelId) return null;

  const data = await youtubeFetch<SearchResponse>(
    `/search?part=snippet&channelId=${channelId}&eventType=live&type=video&maxResults=1`,
    120
  );

  if (!data.ok) return null;

  const item = data.data.items?.[0];
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

export async function getYouTubeHealth(): Promise<YouTubeHealth> {
  const configured = isYouTubeConfigured();
  if (!configured) {
    return {
      configured: false,
      channelId: null,
      videoCount: 0,
      error: "YOUTUBE_API_KEY is not set",
    };
  }

  const channelId = await resolveChannelId();
  if (!channelId) {
    return {
      configured: true,
      channelId: null,
      videoCount: 0,
      error: "Could not resolve a YouTube channel ID",
    };
  }

  const uploadsPlaylistId = await getUploadsPlaylistId(channelId);
  if (uploadsPlaylistId) {
    const playlist = await youtubeFetch<PlaylistItemsResponse>(
      `/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1`,
      0
    );

    if (playlist.ok) {
      return {
        configured: true,
        channelId,
        videoCount: playlist.data.items?.length ?? 0,
        error: null,
      };
    }

    return {
      configured: true,
      channelId,
      videoCount: 0,
      error: playlist.message,
    };
  }

  const search = await youtubeFetch<SearchResponse>(
    `/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1`,
    0
  );

  if (!search.ok) {
    return {
      configured: true,
      channelId,
      videoCount: 0,
      error: search.message,
    };
  }

  return {
    configured: true,
    channelId,
    videoCount: search.data.items?.length ?? 0,
    error: null,
  };
}

export function getYouTubeChannelUrl() {
  return churchContent.social.youtube;
}
