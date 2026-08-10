"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { primaryNavLinks } from "@/lib/navigation/public-nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-sky-deep/95 backdrop-blur-md shadow-sm">
      <div className="container-wide max-w-7xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="type-logo shrink-0">
            Alpha Fellowship
          </Link>

          <nav className="hidden xl:flex items-center gap-4 2xl:gap-5 flex-1 justify-center min-w-0">
            {primaryNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="type-nav text-xs 2xl:text-sm whitespace-nowrap hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link href="/give" className="pill-btn-ghost py-2.5 px-4 text-xs sm:text-sm">
              Donate
            </Link>
            <Link href="/services" className="pill-btn-white py-2.5 px-4 text-xs sm:text-sm">
              Plan a visit
            </Link>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "xl:hidden text-white hover:bg-white/10 shrink-0"
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
                <nav className="flex flex-col gap-1 overflow-y-auto">
                  {primaryNavLinks.map((item) => (
                    <Link
                      key={item.href}
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
