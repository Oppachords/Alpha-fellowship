import Image from "next/image";
import type { PaymentMethodDisplay } from "@/lib/payments/fallback-methods";

const paymentIcons: Record<string, { src: string; alt: string }> = {
  mtn: {
    src: "/images/payments/mtn-mobile-money.svg",
    alt: "MTN Mobile Money",
  },
  airtel: {
    src: "/images/payments/airtel-money.svg",
    alt: "Airtel Money",
  },
  bank: {
    src: "/images/payments/equity-bank.svg",
    alt: "Equity Bank",
  },
};

function resolveIcon(method: PaymentMethodDisplay) {
  if (paymentIcons[method.type]) {
    return paymentIcons[method.type];
  }

  const name = method.displayName.toLowerCase();
  if (name.includes("mtn")) return paymentIcons.mtn;
  if (name.includes("airtel")) return paymentIcons.airtel;
  if (name.includes("equity") || name.includes("bank")) return paymentIcons.bank;

  return null;
}

function MethodIcon({ method }: { method: PaymentMethodDisplay }) {
  const icon = resolveIcon(method);

  if (!icon) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
        {method.displayName.charAt(0)}
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/60">
      <Image src={icon.src} alt={icon.alt} fill className="object-cover" sizes="48px" />
    </div>
  );
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
            <MethodIcon method={method} />
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
