import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { churchContent } from "@/lib/content/church-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Alpha Fellowship Uganda — phone, email, WhatsApp, and Grace Gardens Namungoona.",
};

export default function ContactPage() {
  const { contact } = churchContent;

  return (
    <>
      <PageHero
        eyebrow="Reach out"
        title="We'd love to hear from you"
        description="Questions about visiting, counselling, or getting involved? Send us a message."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <p className="type-eyebrow mb-4">Contact details</p>
              <h2 className="type-heading mb-8">Find us</h2>

              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                  <div>
                    <p className="type-subheading text-base">Venue</p>
                    <p className="type-body-sm text-muted-foreground">
                      {contact.venue}, Kampala, Uganda
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                  <div>
                    <p className="type-subheading text-base">Phone</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="type-body-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {contact.phone}
                    </a>
                    {contact.mobile.map((num) => (
                      <a
                        key={num}
                        href={`tel:${num.replace(/\s/g, "")}`}
                        className="block type-body-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {num}
                      </a>
                    ))}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                  <div>
                    <p className="type-subheading text-base">Email</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="type-body-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                  <div>
                    <p className="type-subheading text-base">WhatsApp</p>
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace("+", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-body-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {contact.whatsapp}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-white p-7 md:p-8">
              <p className="type-eyebrow mb-4">Send a message</p>
              <h2 className="type-subheading mb-6">Contact form</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
