import Link from "next/link";
import { churchContent } from "@/lib/content/church-content";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container-wide max-w-4xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-serif text-base font-semibold text-foreground">
              Alpha Fellowship
            </p>
            <p className="type-body-sm text-muted-foreground mt-1">{churchContent.mission}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 type-body-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/services" className="hover:text-foreground transition-colors">
              Gatherings
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/give" className="hover:text-foreground transition-colors">
              Give
            </Link>
            <Link href="/member/register" className="hover:text-foreground transition-colors">
              Join
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Member Login
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 type-body-sm text-muted-foreground">
          <p>&copy; {currentYear} Alpha Fellowship Uganda</p>
          <div className="flex gap-4">
            {[
              { label: "YouTube", href: churchContent.social.youtube },
              { label: "Facebook", href: churchContent.social.facebook },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
