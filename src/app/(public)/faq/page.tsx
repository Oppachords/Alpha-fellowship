import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { getPublicFaqs } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Alpha Fellowship Uganda.",
};

export default async function FaqPage() {
  const { faqs } = await getPublicFaqs();

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const key = faq.category ?? "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(faq);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        imageKey="faq"
        eyebrow="Questions"
        title="Frequently asked questions"
        description="Answers to common questions about visiting, membership, and our gatherings."
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-3xl">
          {faqs.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center">
              <p className="type-body-sm text-muted-foreground mb-6">
                FAQs will be posted soon. In the meantime, feel free to reach out.
              </p>
              <Link href="/contact" className="pill-btn-outline inline-flex">
                Contact us
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h2 className="type-subheading mb-4">{category}</h2>
                  <div className="space-y-4">
                    {items.map((faq) => (
                      <details
                        key={faq.id}
                        className="rounded-2xl border border-border bg-white p-5 group"
                      >
                        <summary className="font-medium cursor-pointer list-none flex justify-between gap-4">
                          {faq.question}
                          <span className="text-muted-foreground group-open:rotate-45 transition-transform">
                            +
                          </span>
                        </summary>
                        <p className="mt-4 type-body-sm text-muted-foreground whitespace-pre-wrap">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
