import { churchContent } from "@/lib/content/church-content";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "https://alpha-fellowship.vercel.app";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: churchContent.fullName,
    alternateName: churchContent.name,
    url: baseUrl,
    description: churchContent.tagline,
    email: churchContent.contact.email,
    telephone: churchContent.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kampala",
      addressCountry: "UG",
    },
    sameAs: [
      churchContent.social.youtube,
      churchContent.social.facebook,
      churchContent.social.instagram,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
