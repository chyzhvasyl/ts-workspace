import { Currency, Money } from './money';

export type TransactionStatus =
  | 'approved'
  | 'declined'
  | 'refunded'
  | 'chargeback'
  | 'pending';

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'paypal';

export interface Transaction {
  id: string;
  createdAt: string; // ISO date
  merchantId: string;
  customerEmail: string;
  amount: Money;
  fee: Money;
  status: TransactionStatus;
  method: PaymentMethod;
  country: string; // ISO-2
}

export interface Merchant {
  id: string;
  name: string;
  country: string;
  mcc: string;
}

export interface Balance {
  currency: Currency;
  available: Money;
  pending: Money;
  reserved: Money;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: Money;
}

export interface Invoice {
  number: string;
  merchant: string;
  currency: Currency;
  taxRatePct: number;
  lineItems: InvoiceLineItem[];
}

/**
 * Commission rules — a discriminated union. Great material for exhaustive
 * switch + `never` checks in TypeScript.
 */
export type CommissionRule =
  | { kind: 'percentage'; rateBps: number } // basis points: 250 = 2.5%
  | { kind: 'fixed'; fee: Money }
  | { kind: 'percentage_plus_fixed'; rateBps: number; fixed: Money }
  | { kind: 'tiered'; tiers: CommissionTier[] };

export interface CommissionTier {
  /** Inclusive lower bound in MINOR units. */
  fromMinor: number;
  rateBps: number;
}

export type PayoutStatus = 'scheduled' | 'in_transit' | 'paid' | 'failed';

export interface Payout {
  id: string;
  amount: Money;
  status: PayoutStatus;
  scheduledFor: string;
}
