"use client";

import { useEffect, useId, useRef } from "react";

type YouTubePlayerInstance = {
  destroy: () => void;
  playVideo: () => void;
  setPlaybackQuality: (quality: string) => void;
  getAvailableQualityLevels: () => string[];
};

type YouTubePlayerOptions = {
  videoId: string;
  height: string;
  width: string;
  playerVars: Record<string, number | string>;
  events: {
    onReady?: (event: { target: YouTubePlayerInstance }) => void;
    onStateChange?: (event: { data: number; target: YouTubePlayerInstance }) => void;
  };
};

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, options: YouTubePlayerOptions) => YouTubePlayerInstance;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const QUALITY_PREFERENCE = ["hd1080", "hd720", "large", "medium"] as const;

let apiPromise: Promise<void> | null = null;

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const finish = () => resolve();

      if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const poll = window.setInterval(() => {
          if (window.YT?.Player) {
            window.clearInterval(poll);
            finish();
          }
        }, 50);
        return;
      }

      window.onYouTubeIframeAPIReady = finish;
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    });
  }

  return apiPromise;
}

function applyBestQuality(player: YouTubePlayerInstance) {
  const available = player.getAvailableQualityLevels?.() ?? [];
  for (const quality of QUALITY_PREFERENCE) {
    if (available.includes(quality)) {
      player.setPlaybackQuality(quality);
      return;
    }
  }
}

type YouTubePlayerProps = {
  videoId: string;
  autoplay?: boolean;
  title: string;
  className?: string;
};

export function YouTubePlayer({
  videoId,
  autoplay = false,
  title,
  className,
}: YouTubePlayerProps) {
  const elementId = useId().replace(/:/g, "");
  const playerRef = useRef<YouTubePlayerInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeIframeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;

      playerRef.current?.destroy();

      playerRef.current = new window.YT.Player(elementId, {
        videoId,
        width: "1280",
        height: "720",
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          fs: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: ({ target }) => {
            applyBestQuality(target);
            if (autoplay) target.playVideo();
          },
          onStateChange: ({ data, target }) => {
            if (data === window.YT?.PlayerState.PLAYING) {
              applyBestQuality(target);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, autoplay, elementId]);

  return (
    <div className={className} aria-label={title}>
      <div id={elementId} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
