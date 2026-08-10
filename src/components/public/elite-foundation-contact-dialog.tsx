"use client";

import Link from "next/link";
import { AtSign, Mail, MessageCircle, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { churchContent } from "@/lib/content/church-content";

const { contacts } = churchContent.eliteFoundation;

function whatsAppHref(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

function telHref(number: string) {
  return `tel:${number.replace(/\s/g, "")}`;
}

type EliteFoundationContactDialogProps = {
  variant?: "primary" | "outline";
  label?: string;
};

export function EliteFoundationContactDialog({
  variant = "primary",
  label = "Contact",
}: EliteFoundationContactDialogProps) {
  const triggerClass =
    variant === "outline" ? "pill-btn-outline inline-flex" : "pill-btn-primary inline-flex";

  return (
    <Dialog>
      <DialogTrigger render={<button type="button" className={triggerClass} />}>
        {label}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Elite Foundation Contacts</DialogTitle>
          <DialogDescription>
            Reach out to partner, volunteer, or learn more about our outreach
            programs.
          </DialogDescription>
        </DialogHeader>
        <dl className="space-y-4 type-body-sm">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="font-medium text-foreground">Email</dt>
              <dd>
                <Link
                  href={`mailto:${contacts.email}`}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {contacts.email}
                </Link>
              </dd>
            </div>
          </div>
          {contacts.phones.map((phone) => (
            <div key={phone} className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <dt className="font-medium text-foreground">Phone</dt>
                <dd>
                  <Link
                    href={telHref(phone)}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {phone}
                  </Link>
                </dd>
              </div>
            </div>
          ))}
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="font-medium text-foreground">WhatsApp</dt>
              <dd>
                <Link
                  href={whatsAppHref(contacts.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {contacts.whatsapp}
                </Link>
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AtSign className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="font-medium text-foreground">Instagram</dt>
              <dd>
                <Link
                  href={contacts.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {contacts.instagram}
                </Link>
              </dd>
            </div>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
