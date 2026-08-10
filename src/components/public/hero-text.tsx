"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type HeroTextProps = {
  children: ReactNode;
  className?: string;
};

export function HeroText({ children, className }: HeroTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut", delay: 0.12 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
