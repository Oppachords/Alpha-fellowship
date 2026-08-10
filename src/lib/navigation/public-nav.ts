export type PublicNavLink = {
  label: string;
  href: string;
};

/** Primary links shown in the site header and mobile menu */
export const primaryNavLinks: PublicNavLink[] = [
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Gatherings", href: "/services" },
  { label: "Sermons", href: "/sermons" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Watch Live", href: "/watch-live" },
  { label: "Contact", href: "/contact" },
  { label: "Members", href: "/members" },
];

/** Secondary links for the footer */
export const footerNavLinks: PublicNavLink[] = [
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Gatherings", href: "/services" },
  { label: "Sermons", href: "/sermons" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Watch Live", href: "/watch-live" },
  { label: "Give", href: "/give" },
  { label: "Contact", href: "/contact" },
  { label: "Members", href: "/members" },
];
