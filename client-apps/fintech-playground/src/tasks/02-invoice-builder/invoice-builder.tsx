import { useState } from 'react';

import { money } from '../../shared/domain/money';
import { Invoice, InvoiceLineItem } from '../../shared/domain/types';
import {
  Button,
  Card,
  Column,
  Money,
  NumberInput,
  Stat,
  Table,
  TextInput,
} from '../../shared/ui';
import { computeTotals } from './invoice-totals';

let nextId = 100;
const newLine = (): InvoiceLineItem => ({
  id: `li_${nextId++}`,
  description: '',
  quantity: 1,
  unitPrice: money(0, 'USD'),
});

const SEED: InvoiceLineItem[] = [
  {
    id: 'li_1',
    description: 'Pro subscription',
    quantity: 2,
    unitPrice: money(29.99, 'USD'),
  },
  { id: 'li_2', description: 'Onboarding', quantity: 1, unitPrice: money(150, 'USD') },
];

export function InvoiceBuilder() {
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(SEED);
  const [taxRatePct, setTaxRatePct] = useState<number | ''>(20);

  // 🎯 TODO: implement these three handlers IMMUTABLY (no mutation of state).
  const addLineItem = () => {
    // TODO: append newLine() to lineItems
  };
  const removeLineItem = (id: string) => {
    // TODO: drop the item with this id
  };
  const updateLineItem = (id: string, patch: Partial<InvoiceLineItem>) => {
    // TODO: replace the matching item with { ...item, ...patch }
  };

  const invoice: Invoice = {
    number: 'INV-2026-001',
    merchant: 'Glovo',
    currency: 'USD',
    taxRatePct: typeof taxRatePct === 'number' ? taxRatePct : 0,
    lineItems,
  };
  const totals = computeTotals(invoice);

  const columns: Column<InvoiceLineItem>[] = [
    {
      key: 'description',
      header: 'Опис',
      render: (li) => (
        <TextInput
          value={li.description}
          placeholder="Назва позиції"
          onChange={(e) => updateLineItem(li.id, { description: e.target.value })}
        />
      ),
    },
    {
      key: 'qty',
      header: 'К-сть',
      width: '90px',
      render: (li) => (
        <NumberInput
          value={li.quantity}
          min={0}
          onValueChange={(v) =>
            updateLineItem(li.id, { quantity: typeof v === 'number' ? v : 0 })
          }
        />
      ),
    },
    {
      key: 'price',
      header: 'Ціна',
      width: '120px',
      render: (li) => (
        <NumberInput
          value={li.unitPrice.amountMinor / 100}
          min={0}
          step={0.01}
          onValueChange={(v) =>
            updateLineItem(li.id, {
              unitPrice: money(typeof v === 'number' ? v : 0, 'USD'),
            })
          }
        />
      ),
    },
    {
      key: 'sum',
      header: 'Сума',
      align: 'right',
      render: (li) => (
        <Money value={money((li.unitPrice.amountMinor / 100) * li.quantity, 'USD')} />
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      align: 'right',
      render: (li) => (
        <Button variant="ghost" size="sm" onClick={() => removeLineItem(li.id)}>
          ✕
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Позиції інвойсу"
        subtitle="Додавай / видаляй / редагуй рядки — оновлення мають бути immutable"
        actions={
          <Button size="sm" onClick={addLineItem}>
            + Додати позицію
          </Button>
        }
      >
        <Table
          columns={columns}
          rows={lineItems}
          rowKey={(li) => li.id}
          empty="Немає позицій"
        />
      </Card>

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3,1fr)' }}>
        <Stat label="Subtotal" value={<Money value={totals.subtotal} />} />
        <Stat
          label={`Tax (${invoice.taxRatePct}%)`}
          value={<Money value={totals.tax} />}
        />
        <Stat label="Total" value={<Money value={totals.total} />} />
      </div>
    </>
  );
}
