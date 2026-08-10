import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { PaymentMethodsList } from "@/components/public/payment-methods-list";
import { PaymentConfirmationForm } from "@/components/public/payment-confirmation-form";
import { getActivePaymentMethods } from "@/lib/payments/get-payment-methods";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Support Alpha Fellowship Uganda through MTN Mobile Money, Airtel Money, or bank transfer.",
};

export default async function GivePage() {
  const { methods } = await getActivePaymentMethods();

  return (
    <>
      <PageHero
        imageKey="give"
        eyebrow="Support the mission"
        title="Give generously"
        description="Your giving helps us reach young people, support outreach, and spread the Gospel across Uganda."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-3xl">
          <p className="type-eyebrow mb-4 text-center">Ways to give</p>
          <h2 className="type-heading text-center mb-12">Payment methods</h2>

          <PaymentMethodsList methods={methods} />
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-wide max-w-xl">
          <PaymentConfirmationForm methods={methods} />
        </div>
      </section>

      <section className="section-padding bg-background text-center">
        <div className="container-narrow">
          <h2 className="type-heading mb-4">Questions about giving?</h2>
          <p className="type-body-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Reach out and we&apos;ll gladly help you with any questions about
            donations or supporting our outreach work.
          </p>
          <Link href="/contact" className="pill-btn-outline inline-flex">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
