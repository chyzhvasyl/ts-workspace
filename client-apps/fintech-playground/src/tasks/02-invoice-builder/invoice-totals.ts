import { Money, zero } from '../../shared/domain/money';
import { Invoice } from '../../shared/domain/types';

export interface InvoiceTotals {
  subtotal: Money; // sum of qty * unitPrice
  tax: Money; // subtotal * taxRatePct / 100
  total: Money; // subtotal + tax
}

/**
 * 🎯 TODO (pure). Compute invoice totals in MINOR units.
 * subtotal = Σ qty_i * unitPrice_i.amountMinor
 * tax      = round(subtotal * taxRatePct / 100)
 * total    = subtotal + tax
 * Use invoice.currency for every Money you return.
 */
export function computeTotals(invoice: Invoice): InvoiceTotals {
  // TODO: implement.
  return {
    subtotal: zero(invoice.currency),
    tax: zero(invoice.currency),
    total: zero(invoice.currency),
  };
}
