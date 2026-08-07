import { db } from "@/lib/db";
import {
  fallbackPaymentMethods,
  type PaymentMethodDisplay,
} from "@/lib/payments/fallback-methods";

export async function getActivePaymentMethods(): Promise<{
  methods: PaymentMethodDisplay[];
  fromDatabase: boolean;
}> {
  try {
    const methods = await db.paymentMethod.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    if (methods.length > 0) {
      return { methods, fromDatabase: true };
    }
  } catch {
    // fall through
  }

  return { methods: fallbackPaymentMethods, fromDatabase: false };
}
