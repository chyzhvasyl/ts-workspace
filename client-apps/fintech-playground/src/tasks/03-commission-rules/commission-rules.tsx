import { useReducer } from 'react';

import { formatMoney, money } from '../../shared/domain/money';
import type { CommissionTier } from '../../shared/domain/types';
import type { Column } from '../../shared/ui';
import { Button, Card, NumberInput, Table } from '../../shared/ui';

import { initialRulesState, rulesReducer } from './rules-reducer';

export function CommissionRules() {
  const [state, dispatch] = useReducer(rulesReducer, initialRulesState);

  const columns: Column<CommissionTier & { index: number }>[] = [
    {
      key: 'from',
      header: 'Від суми (USD)',
      render: (t) => (
        <NumberInput
          min={0}
          value={t.fromMinor / 100}
          onValueChange={(v) =>
            dispatch({
              type: 'set_from',
              index: t.index,
              fromMinor: Math.round((typeof v === 'number' ? v : 0) * 100),
            })
          }
        />
      ),
    },
    {
      key: 'rate',
      header: 'Ставка (bps)',
      render: (t) => (
        <NumberInput
          min={0}
          value={t.rateBps}
          onValueChange={(v) =>
            dispatch({
              type: 'set_rate',
              index: t.index,
              rateBps: typeof v === 'number' ? v : 0,
            })
          }
        />
      ),
    },
    {
      key: 'pct',
      header: '%',
      align: 'right',
      render: (t) => <span>{(t.rateBps / 100).toFixed(2)}%</span>,
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      align: 'right',
      render: (t) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => dispatch({ type: 'remove_tier', index: t.index })}
        >
          ✕
        </Button>
      ),
    },
  ];

  const rows = state.tiers.map((t, index) => ({ ...t, index }));

  return (
    <Card
      actions={
        <>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => dispatch({ type: 'reset' })}
          >
            Reset
          </Button>
          <Button size="sm" onClick={() => dispatch({ type: 'add_tier' })}>
            + Рівень
          </Button>
        </>
      }
      footer={
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Приклад: на {formatMoney(money(500, 'USD'))} застосується ставка рівня з
          найбільшим
          <code> fromMinor ≤ 50000</code>.
        </span>
      }
      subtitle="Кожен рівень — нижня межа суми + ставка. Усім керує useReducer."
      title="Тарифні рівні (tiered pricing)"
    >
      <Table
        columns={columns}
        empty="Немає рівнів — додай перший"
        rowKey={(t) => String(t.index)}
        rows={rows}
      />
    </Card>
  );
}
