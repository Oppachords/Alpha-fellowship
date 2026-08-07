import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { churchContent } from "@/lib/content/church-content";

export function ContactPreviewSection() {
  return (
    <section className="section-padding bg-brand-warm/50">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="eyebrow mb-4">Connect With Us</p>
            <h2 className="heading-section text-brand-dark mb-6">
              We&apos;d Love to Hear From You
            </h2>
            <div className="divider-gold mb-8" />
            <p className="text-lead mb-10">
              Whether you have a question, need prayer, or want to visit — reach
              out and we&apos;ll get back to you.
            </p>

            <div className="space-y-6">
              <ContactItem
                icon={MapPin}
                label="Location"
                value={churchContent.contact.venue}
                subtext="Kampala, Uganda"
              />
              <ContactItem
                icon={Phone}
                label="Phone"
                value={churchContent.contact.phone}
                href={`tel:${churchContent.contact.phone}`}
              />
              <ContactItem
                icon={Mail}
                label="Email"
                value={churchContent.contact.email}
                href={`mailto:${churchContent.contact.email}`}
              />
              <ContactItem
                icon={MessageCircle}
                label="WhatsApp"
                value={churchContent.contact.whatsapp}
                href={`https://wa.me/${churchContent.contact.whatsapp.replace("+", "")}`}
              />
            </div>

            <ButtonLink
              href="/contact"
              className="mt-10 rounded-full bg-brand hover:bg-brand/90 px-8"
            >
              Send Us a Message
            </ButtonLink>
          </div>

          <div className="card-elevated aspect-square lg:aspect-auto lg:min-h-[480px] flex items-center justify-center p-10">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 mx-auto mb-6">
                <MapPin className="h-7 w-7 text-brand" />
              </div>
              <h3 className="font-heading text-2xl text-brand-dark mb-2">
                Grace Gardens Namungoona
              </h3>
              <p className="text-muted-foreground mb-1">Kampala, Uganda</p>
              <p className="text-sm text-muted-foreground/70 mt-6">
                Map integration available through CMS configuration
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  subtext,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtext?: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white border border-border">
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
          {label}
        </p>
        <p className="font-medium text-brand-dark">{value}</p>
        {subtext && (
          <p className="text-sm text-muted-foreground">{subtext}</p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }
  return content;
}
