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
import {
  headerNavLinks,
  headerOverflowNavLinks,
  primaryNavLinks,
} from "@/lib/navigation/public-nav";
import { cn } from "@/lib/utils";

const desktopNavLinks = [...headerNavLinks, ...headerOverflowNavLinks];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-sky-deep/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-[100rem] items-center gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:gap-4 lg:px-8 xl:px-10">
        <Link href="/" className="type-logo shrink-0">
          Alpha Fellowship
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-2.5 lg:flex xl:gap-x-3.5 2xl:gap-x-4">
          {desktopNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="type-nav whitespace-nowrap text-[13px] transition-colors hover:text-white xl:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link href="/give" className="pill-btn-ghost px-3 py-1.5 text-xs xl:px-4 xl:py-2 xl:text-sm">
            Donate
          </Link>
          <Link href="/services" className="pill-btn-white px-3 py-1.5 text-xs xl:px-4 xl:py-2 xl:text-sm">
            Plan a visit
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "ml-auto shrink-0 text-white hover:bg-white/10 lg:hidden"
            )}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full bg-background sm:w-[360px]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex h-full flex-col pt-4">
              <div className="mb-8 flex items-center justify-between">
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
                    className="border-b border-border/60 py-3 font-serif text-lg font-semibold text-foreground"
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
    </header>
  );
}
