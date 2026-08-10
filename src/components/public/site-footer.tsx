import Link from "next/link";
import { churchContent } from "@/lib/content/church-content";
import { footerNavLinks } from "@/lib/navigation/public-nav";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="site-shell max-w-5xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="font-serif text-base font-semibold text-foreground">
              Alpha Fellowship
            </p>
            <p className="type-body-sm text-muted-foreground mt-1">{churchContent.mission}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 type-body-sm text-muted-foreground">
            {footerNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
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
