export type PublicNavLink = {
  label: string;
  href: string;
};

/** Always visible in desktop header */
export const headerNavLinks: PublicNavLink[] = [
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Gatherings", href: "/services" },
  { label: "Watch Live", href: "/watch-live" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
];

/** Shown in More menu on lg, inline from xl up */
export const headerOverflowNavLinks: PublicNavLink[] = [
  { label: "Gallery", href: "/gallery" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
  { label: "Members", href: "/members" },
];

/** All links for mobile menu */
export const primaryNavLinks: PublicNavLink[] = [
  ...headerNavLinks,
  ...headerOverflowNavLinks,
];

export function isPublicNavLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Secondary links for the footer */
export const footerNavLinks: PublicNavLink[] = [
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Gatherings", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Watch Live", href: "/watch-live" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "FAQ", href: "/faq" },
  { label: "Give", href: "/give" },
  { label: "Contact", href: "/contact" },
  { label: "Members", href: "/members" },
];
