import { churchContent } from "@/lib/content/church-content";

export type PaymentMethodDisplay = {
  id: string;
  type: string;
  displayName: string;
  phoneNumber?: string | null;
  merchantCode?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  instructions?: string | null;
};

export const fallbackPaymentMethods: PaymentMethodDisplay[] = [
  {
    id: "mtn",
    type: "mtn",
    displayName: "MTN Mobile Money",
    phoneNumber: churchContent.payments.mtn.number,
    merchantCode: churchContent.payments.mtn.merchantCode,
    instructions: "Send your donation via MTN Mobile Money to the number above.",
  },
  {
    id: "airtel",
    type: "airtel",
    displayName: "Airtel Money",
    phoneNumber: churchContent.payments.airtel.number,
    merchantCode: churchContent.payments.airtel.merchantCode,
    instructions: "Send your donation via Airtel Money to the number above.",
  },
  {
    id: "bank",
    type: "bank",
    displayName: "Equity Bank",
    bankName: churchContent.payments.bank.bank,
    accountName: churchContent.payments.bank.accountName,
    accountNumber: churchContent.payments.bank.accountNumber,
    instructions: "Use these details to make a manual bank transfer.",
  },
];
