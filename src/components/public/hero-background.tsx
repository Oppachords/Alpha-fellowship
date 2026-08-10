"use client";

import { motion } from "framer-motion";
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
  const slides =
    images.length > 0 ? images : ["/images/hero-sanctuary.png"];
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
      {slides.map((src, slideIndex) => (
        <motion.div
          key={src}
          animate={{ opacity: slideIndex === index ? 1 : 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className={`absolute -inset-[12%] ${
              isCompact ? "hero-ken-burns-compact" : "hero-ken-burns-full"
            }`}
            style={{ animationDelay: `${slideIndex * 1.75}s` }}
          >
            <Image
              src={src}
              alt={slideIndex === index ? alt : ""}
              fill
              priority={slideIndex === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        </motion.div>
      ))}

      <div className={`hero-media-blur ${isCompact ? "hero-media-blur-compact" : ""}`} />
      <div className={`hero-media-filter ${isCompact ? "hero-media-filter-compact" : ""}`} />
      <div
        className={`hero-overlay-rise ${isCompact ? "hero-overlay-compact" : "hero-overlay"}`}
      />
    </div>
  );
}
