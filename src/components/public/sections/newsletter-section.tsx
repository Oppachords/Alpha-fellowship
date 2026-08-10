"use client";

import { useActionState } from "react";
import { subscribeNewsletterAction } from "@/lib/actions/newsletter";
import { HoneypotField } from "@/components/public/honeypot-field";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletterAction,
    undefined
  );

  return (
    <section className="section-padding-sm">
      <div className="container-narrow">
        <div className="relative rounded-2xl overflow-hidden bg-brand-dark px-8 py-14 md:px-16 md:py-20 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-brand blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-brand-gold blur-3xl" />
          </div>
          <div className="relative">
            <p className="eyebrow text-brand-gold mb-4">Stay Connected</p>
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-white/60 mb-10 max-w-md mx-auto leading-relaxed">
              Subscribe for updates on events, sermons, and community news from
              Alpha Fellowship.
            </p>

            {state?.success ? (
              <div className="flex items-center justify-center gap-2 text-brand-gold">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">Thank you for subscribing!</p>
              </div>
            ) : (
              <form
                action={formAction}
                className="flex flex-col gap-4 max-w-md mx-auto"
              >
                <HoneypotField />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  required
                  className="bg-white/10 border-white/15 text-white placeholder:text-white/40 h-12 rounded-full px-5 focus-visible:ring-brand"
                />
                <label className="flex items-start gap-2 text-left text-sm text-white/70">
                  <input
                    type="checkbox"
                    name="hasConsent"
                    required
                    className="mt-1 rounded border-white/30"
                  />
                  <span>I agree to receive newsletter emails from Alpha Fellowship.</span>
                </label>
                {state?.error && (
                  <p className="text-sm text-red-300">{state.error}</p>
                )}
                <Button
                  type="submit"
                  disabled={pending}
                  className="bg-brand hover:bg-brand/90 h-12 px-7 rounded-full shrink-0 mx-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {pending ? "Subscribing…" : "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
