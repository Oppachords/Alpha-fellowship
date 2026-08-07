import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { churchContent } from "@/lib/content/church-content";

export function ComeAndSeeSection() {
  return (
    <section className="section-padding bg-primary text-white">
      <div className="container-narrow max-w-2xl">
        <p className="type-eyebrow-hero mb-6 text-white/60">Come and see</p>
        <h2 className="type-heading-lg mb-6 text-balance">
          We&apos;d love to welcome you
        </h2>
        <p className="type-body-lg text-white/80 mb-12 max-w-lg mx-auto">
          We shall be really glad to see you on your visit. Experience the love,
          peace, hope, and a vibrant prayerful community as we journey this walk
          of faith together.
        </p>

        <div className="space-y-4 text-left max-w-sm mx-auto mb-12">
          <a
            href={`tel:${churchContent.contact.phone}`}
            className="flex items-center gap-3 type-body-sm text-white/80 hover:text-white transition-colors"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {churchContent.contact.phone}
          </a>
          <a
            href={`mailto:${churchContent.contact.email}`}
            className="flex items-center gap-3 type-body-sm text-white/80 hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {churchContent.contact.email}
          </a>
          <a
            href={`https://wa.me/${churchContent.contact.whatsapp.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 type-body-sm text-white/80 hover:text-white transition-colors"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            WhatsApp: {churchContent.contact.whatsapp}
          </a>
          <div className="flex items-start gap-3 type-body-sm text-white/80">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            {churchContent.contact.venue}, Kampala, Uganda
          </div>
        </div>

        <Link href="/contact" className="pill-btn-primary inline-flex">
          Get in touch
        </Link>
      </div>
    </section>
  );
}
