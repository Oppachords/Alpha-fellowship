"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-sky-deep/95 backdrop-blur-md shadow-sm">
      <div className="site-shell flex h-16 lg:h-[4.5rem] items-center gap-6 lg:gap-8">
        <Link href="/" className="type-logo shrink-0">
          Alpha Fellowship
        </Link>

        <nav className="hidden lg:flex min-w-0 flex-1 items-center gap-5 xl:gap-6">
          {headerNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="type-nav whitespace-nowrap hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden lg:inline-flex xl:hidden h-9 px-2 text-white/85 hover:text-white hover:bg-white/10"
              )}
            >
              More
              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-44">
              {headerOverflowNavLinks.map((item) => (
                <DropdownMenuItem key={item.href}>
                  <Link href={item.href} className="w-full">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden xl:flex items-center gap-5 xl:gap-6">
            {headerOverflowNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="type-nav whitespace-nowrap hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Link href="/give" className="pill-btn-ghost py-2 px-4 text-sm">
            Donate
          </Link>
          <Link href="/services" className="pill-btn-white py-2 px-4 text-sm">
            Plan a visit
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "lg:hidden text-white hover:bg-white/10 shrink-0 ml-auto"
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
    </header>
  );
}
