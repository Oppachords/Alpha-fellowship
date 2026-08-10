export type PublicNavLink = {
  label: string;
  href: string;
};

/** Always visible in desktop header */
export const headerNavLinks: PublicNavLink[] = [
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Gatherings", href: "/services" },
  { label: "Sermons", href: "/sermons" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
];

/** Shown in More menu on lg, inline from xl up */
export const headerOverflowNavLinks: PublicNavLink[] = [
  { label: "Gallery", href: "/gallery" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Watch Live", href: "/watch-live" },
  { label: "Contact", href: "/contact" },
  { label: "Members", href: "/members" },
];

/** All links for mobile menu and footer */
export const primaryNavLinks: PublicNavLink[] = [
  ...headerNavLinks,
  ...headerOverflowNavLinks,
];

/** Secondary links for the footer */
export const footerNavLinks: PublicNavLink[] = [
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Gatherings", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Sermons", href: "/sermons" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "FAQ", href: "/faq" },
  { label: "Watch Live", href: "/watch-live" },
  { label: "Give", href: "/give" },
  { label: "Contact", href: "/contact" },
  { label: "Members", href: "/members" },
];
