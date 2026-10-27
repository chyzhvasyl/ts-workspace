import { describe, expect, it } from 'vitest';

import { money } from '../../shared/domain/money';
import { Invoice } from '../../shared/domain/types';
import { computeTotals } from './invoice-totals';

const invoice: Invoice = {
  number: 'INV-001',
  merchant: 'Glovo',
  currency: 'USD',
  taxRatePct: 20,
  lineItems: [
    { id: '1', description: 'Subscription', quantity: 2, unitPrice: money(10, 'USD') },
    { id: '2', description: 'Setup', quantity: 1, unitPrice: money(5, 'USD') },
  ],
};

describe('computeTotals', () => {
  it('sums line items into subtotal', () => {
    expect(computeTotals(invoice).subtotal.amountMinor).toBe(2500); // $25.00
  });

  it('applies tax rate', () => {
    expect(computeTotals(invoice).tax.amountMinor).toBe(500); // 20% of $25 = $5
  });

  it('total = subtotal + tax', () => {
    expect(computeTotals(invoice).total.amountMinor).toBe(3000); // $30.00
  });
});
