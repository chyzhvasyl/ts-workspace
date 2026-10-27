import { CSSProperties, useMemo, useState } from 'react';

import { money } from '../../shared/domain/money';
import { sampleTransactions } from '../../shared/domain/mock-api';
import { Transaction, TransactionStatus } from '../../shared/domain/types';
import {
  Card,
  Column,
  Field,
  Money,
  RenderCount,
  Select,
  Stat,
  StatusPill,
  Table,
  TextInput,
  Tone,
} from '../../shared/ui';
import { applyFilters, ExplorerFilters, summarize } from './filter-transactions';

const STATUS_TONE: Record<TransactionStatus, Tone> = {
  approved: 'success',
  declined: 'danger',
  refunded: 'warning',
  chargeback: 'danger',
  pending: 'info',
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'Усі статуси' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'chargeback', label: 'Chargeback' },
  { value: 'pending', label: 'Pending' },
] as const;

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Дата ↓' },
  { value: 'date-asc', label: 'Дата ↑' },
  { value: 'amount-desc', label: 'Сума ↓' },
  { value: 'amount-asc', label: 'Сума ↑' },
] as const;

export function TransactionsExplorer() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ExplorerFilters['status']>('all');
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['value']>('date-desc');
  const [, forceRender] = useState(0);

  const [sortBy, sortDir] = sort.split('-') as [
    ExplorerFilters['sortBy'],
    ExplorerFilters['sortDir'],
  ];

  // 🎯 TODO: memoize so this recomputes ONLY when inputs change,
  // not on every unrelated re-render (try the "Re-render" button below).
  const filtered = useMemo(
    () => applyFilters(sampleTransactions, { query, status, sortBy, sortDir }),
    [query, status, sortBy, sortDir],
  );
  const summary = useMemo(() => summarize(filtered), [filtered]);

  const columns: Column<Transaction>[] = [
    { key: 'id', header: 'ID', render: (t) => <code>{t.id}</code> },
    { key: 'email', header: 'Клієнт', render: (t) => t.customerEmail },
    { key: 'country', header: 'Країна', render: (t) => t.country },
    {
      key: 'amount',
      header: 'Сума',
      align: 'right',
      render: (t) => <Money value={t.amount} />,
    },
    {
      key: 'fee',
      header: 'Комісія',
      align: 'right',
      render: (t) => <Money value={t.fee} />,
    },
    {
      key: 'status',
      header: 'Статус',
      render: (t) => <StatusPill tone={STATUS_TONE[t.status]}>{t.status}</StatusPill>,
    },
  ];

  return (
    <>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3,1fr)' }}>
        <Stat label="Транзакцій" value={summary.count} />
        <Stat
          label="Оборот"
          value={<Money value={money(summary.volumeMinor / 100, 'USD')} />}
        />
        <Stat
          label="Комісії"
          value={<Money value={money(summary.feesMinor / 100, 'USD')} />}
        />
      </div>

      <Card
        title="Транзакції"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RenderCount label="Render" />
            <button onClick={() => forceRender((n) => n + 1)} style={btn}>
              ⟳ Re-render
            </button>
          </div>
        }
      >
        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: '2fr 1fr 1fr',
            marginBottom: 16,
          }}
        >
          <Field label="Пошук">
            <TextInput
              value={query}
              placeholder="id, email або країна"
              onChange={(e) => setQuery(e.target.value)}
            />
          </Field>
          <Field label="Статус">
            <Select
              value={status}
              options={STATUS_OPTIONS}
              onValueChange={(v) => setStatus(v as ExplorerFilters['status'])}
            />
          </Field>
          <Field label="Сортування">
            <Select
              value={sort}
              options={SORT_OPTIONS}
              onValueChange={(v) => setSort(v as typeof sort)}
            />
          </Field>
        </div>
        <Table
          columns={columns}
          rows={filtered}
          rowKey={(t) => t.id}
          empty="Нічого не знайдено"
        />
      </Card>
    </>
  );
}

const btn: CSSProperties = {
  fontSize: 12,
  padding: '5px 11px',
  border: '1px solid var(--border-strong)',
  borderRadius: 6,
  background: 'var(--surface)',
};
