import { formatDistanceToNow } from "date-fns";
import { AdminHeader } from "@/components/admin/admin-header";
import { EditPaymentMethodForm } from "@/components/admin/edit-payment-method-form";
import { VerifyPaymentButton } from "@/components/admin/verify-payment-button";
import { db } from "@/lib/db";
import { fallbackPaymentMethods } from "@/lib/payments/fallback-methods";

async function getPaymentMethods() {
  try {
    return await db.paymentMethod.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return null;
  }
}

async function getConfirmations() {
  try {
    return await db.paymentConfirmation.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    return null;
  }
}

function formatCurrency(amount: number | null) {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminPaymentsPage() {
  const [methods, confirmations] = await Promise.all([
    getPaymentMethods(),
    getConfirmations(),
  ]);

  const displayMethods =
    methods && methods.length > 0 ? methods : fallbackPaymentMethods;

  return (
    <>
      <AdminHeader title="Payments" />
      <div className="flex-1 p-6 space-y-10">
        <section>
          <h2 className="type-subheading mb-4">Payment methods</h2>
          {methods === null ? (
            <p className="type-body-sm text-muted-foreground mb-4">
              Connect the database to edit payment methods. Showing fallback details below.
            </p>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayMethods.map((method) => (
              <EditPaymentMethodForm key={method.id} method={method} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="type-subheading mb-4">Payment confirmations</h2>
          {confirmations === null ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <p className="type-body-sm text-muted-foreground">
                Connect the database to review submitted payment confirmations.
              </p>
            </div>
          ) : confirmations.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-center">
              <p className="type-body-sm text-muted-foreground">
                No payment confirmations submitted yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {confirmations.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize mb-1">
                        {item.status}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 type-body-sm text-muted-foreground mb-3">
                    <div>
                      <span className="font-medium text-foreground">Method: </span>
                      {item.paymentMethod}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Amount: </span>
                      {formatCurrency(item.amount ? Number(item.amount) : null)}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-foreground">Reference: </span>
                      {item.referenceNumber}
                    </div>
                    {item.purpose && (
                      <div>
                        <span className="font-medium text-foreground">Purpose: </span>
                        {item.purpose}
                      </div>
                    )}
                  </dl>
                  {item.status === "pending" && <VerifyPaymentButton id={item.id} />}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
