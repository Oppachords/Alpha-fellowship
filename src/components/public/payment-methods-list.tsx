import { Smartphone, Building2 } from "lucide-react";
import type { PaymentMethodDisplay } from "@/lib/payments/fallback-methods";

function MethodIcon({ type }: { type: string }) {
  if (type === "bank") {
    return <Building2 className="h-5 w-5 text-primary" />;
  }
  return <Smartphone className="h-5 w-5 text-primary" />;
}

export function PaymentMethodsList({ methods }: { methods: PaymentMethodDisplay[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {methods.map((method) => (
        <div
          key={method.id}
          className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md h-full"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MethodIcon type={method.type} />
            </div>
            <h3 className="type-subheading text-lg">{method.displayName}</h3>
          </div>

          <dl className="space-y-2.5 type-body-sm flex-1">
            {method.phoneNumber && (
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">
                  Number
                </dt>
                <dd className="font-medium text-foreground">{method.phoneNumber}</dd>
              </div>
            )}
            {method.merchantCode && (
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">
                  Merchant code
                </dt>
                <dd className="font-medium text-foreground">{method.merchantCode}</dd>
              </div>
            )}
            {method.accountName && (
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">
                  Account name
                </dt>
                <dd className="font-medium text-foreground">{method.accountName}</dd>
              </div>
            )}
            {method.accountNumber && (
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">
                  Account number
                </dt>
                <dd className="font-medium text-foreground break-all">
                  {method.accountNumber}
                </dd>
              </div>
            )}
            {method.bankName && (
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-0.5">
                  Bank
                </dt>
                <dd className="font-medium text-foreground">{method.bankName}</dd>
              </div>
            )}
          </dl>

          {method.instructions && (
            <p className="type-body-sm text-muted-foreground mt-4 pt-4 border-t border-border">
              {method.instructions}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
