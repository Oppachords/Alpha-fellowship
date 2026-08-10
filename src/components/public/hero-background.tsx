"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type HeroBackgroundProps = {
  images: string[];
  alt?: string;
  variant?: "fullscreen" | "compact";
  intervalMs?: number;
};

export function HeroBackground({
  images,
  alt = "",
  variant = "compact",
  intervalMs = 9000,
}: HeroBackgroundProps) {
  const slides = images.length > 0 ? images : ["/images/heroes/worship-gathering.png"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs]);

  const isCompact = variant === "compact";

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={slides[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className={`absolute -inset-[10%] ${
              isCompact ? "hero-ken-burns-compact" : "hero-ken-burns-full"
            }`}
          >
            <Image
              src={slides[index]}
              alt={alt}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={`hero-media-blur ${isCompact ? "hero-media-blur-compact" : ""}`} />
      <div className={`hero-media-filter ${isCompact ? "hero-media-filter-compact" : ""}`} />
      <div className={isCompact ? "hero-overlay-compact" : "hero-overlay"} />
    </div>
  );
}
