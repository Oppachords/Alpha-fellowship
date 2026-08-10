"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Gatherings", href: "/services" },
  { label: "Community", href: "/#community" },
  { label: "Members", href: "/members" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [overLightSection, setOverLightSection] = useState(false);

  useEffect(() => {
    const lightSections = document.querySelectorAll('[data-nav-theme="light"]');
    if (lightSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const atTop = entries.some(
          (entry) => entry.isIntersecting && entry.intersectionRatio > 0
        );
        setOverLightSection(atTop);
      },
      {
        root: null,
        rootMargin: "-72px 0px -70% 0px",
        threshold: [0, 0.1, 0.25],
      }
    );

    lightSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        overLightSection
          ? "bg-sky-deep/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-wide max-w-6xl px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="type-logo">
            Alpha Fellowship
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="type-nav hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <Link href="/give" className="pill-btn-ghost py-2.5 px-5">
                Donate
              </Link>
              <Link href="/services" className="pill-btn-white py-2.5 px-5">
                Plan a visit
              </Link>
            </div>
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "md:hidden text-white hover:bg-white/10"
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[360px] bg-background">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col h-full pt-4">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-lg font-semibold text-foreground">
                    Alpha Fellowship
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="py-3 font-serif text-lg font-semibold text-foreground border-b border-border/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 space-y-3">
                  <Link
                    href="/give"
                    onClick={() => setOpen(false)}
                    className="pill-btn-outline block text-center"
                  >
                    Donate
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setOpen(false)}
                    className="pill-btn-outline block text-center"
                  >
                    Plan a visit
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
