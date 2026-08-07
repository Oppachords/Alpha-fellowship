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
    <div className="space-y-6">
      {methods.map((method) => (
        <div
          key={method.id}
          className="rounded-2xl border border-border bg-white p-7"
        >
          <div className="flex items-center gap-3 mb-4">
            <MethodIcon type={method.type} />
            <h3 className="type-subheading">{method.displayName}</h3>
          </div>

          <dl className="space-y-2 type-body-sm">
            {method.phoneNumber && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Number</dt>
                <dd className="font-medium text-foreground">{method.phoneNumber}</dd>
              </div>
            )}
            {method.merchantCode && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Merchant code</dt>
                <dd className="font-medium text-foreground">{method.merchantCode}</dd>
              </div>
            )}
            {method.accountName && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Account name</dt>
                <dd className="font-medium text-foreground">{method.accountName}</dd>
              </div>
            )}
            {method.accountNumber && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Account number</dt>
                <dd className="font-medium text-foreground">{method.accountNumber}</dd>
              </div>
            )}
            {method.bankName && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Bank</dt>
                <dd className="font-medium text-foreground">{method.bankName}</dd>
              </div>
            )}
          </dl>

          {method.instructions && (
            <p className="type-body-sm text-muted-foreground mt-4">
              {method.instructions}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
