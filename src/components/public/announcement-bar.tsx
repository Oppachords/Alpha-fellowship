import Link from "next/link";
import { Megaphone, X } from "lucide-react";

interface AnnouncementBarProps {
  message?: string;
  link?: string;
  linkText?: string;
}

export function AnnouncementBar({
  message = "Join us every Sunday at 9:00 AM and Tuesday at 5:00 PM — Grace Gardens Namungoona. All are welcome!",
  link = "/services",
  linkText = "Service Times",
}: AnnouncementBarProps) {
  return (
    <div className="bg-brand text-brand-foreground">
      <div className="container-wide">
        <div className="flex items-center justify-center gap-3 py-2.5 text-sm">
          <Megaphone className="h-4 w-4 shrink-0 hidden sm:block" />
          <p className="text-center font-medium">
            {message}{" "}
            {link && (
              <Link
                href={link}
                className="underline underline-offset-2 hover:no-underline ml-1 font-semibold"
              >
                {linkText} →
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
