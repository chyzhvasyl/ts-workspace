import { useState } from 'react';

import type { Money as MoneyValue } from '../../shared/domain/money';
import { money, zero } from '../../shared/domain/money';
import type { CommissionRule } from '../../shared/domain/types';
import { Callout, Card, Field, Money, NumberInput, Select, Stat } from '../../shared/ui';

import { calculateFee, calculateNet } from './calculate-fee';

type RuleKind = CommissionRule['kind'];

const RULE_OPTIONS = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed fee' },
  { value: 'percentage_plus_fixed', label: 'Percentage + fixed' },
] as const;

export function FeeCalculator() {
  const [amountMajor, setAmountMajor] = useState<number | ''>(100);
  const [kind, setKind] = useState<RuleKind>('percentage');
  const [rateBps, setRateBps] = useState<number | ''>(290);
  const [fixedMajor, setFixedMajor] = useState<number | ''>(0.3);

  // Provided: assemble the rule + amount from inputs.
  const amount: MoneyValue = money(
    typeof amountMajor === 'number' ? amountMajor : 0,
    'USD',
  );

  const rule: CommissionRule = buildRule(kind, rateBps, fixedMajor);
  // 🎯 TODO: derive these from `amount` + `rule` using your pure functions.
  // Do NOT keep fee/net in useState — they are DERIVED values.
  let fee: MoneyValue = zero('USD');
  let net: MoneyValue = zero('USD');
  let error: string | null = null;

  try {
    fee = calculateFee(amount, rule);
    net = calculateNet(amount, rule);
  } catch (e) {
    error = e instanceof Error ? e.message : 'error';
  }

  return (
    <>
      <Card
        subtitle="Зміни інпути — результат має перерахуватись миттєво"
        title="Конфігурація комісії"
      >
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          }}
        >
          <Field label="Сума (USD)">
            <NumberInput min={0} value={amountMajor} onValueChange={setAmountMajor} />
          </Field>
          <Field label="Тип правила">
            <Select
              options={RULE_OPTIONS}
              value={kind}
              onValueChange={(v) => setKind(v)}
            />
          </Field>
          {(kind === 'percentage' || kind === 'percentage_plus_fixed') && (
            <Field hint="290 bps = 2.90%" label="Ставка (bps)">
              <NumberInput min={0} value={rateBps} onValueChange={setRateBps} />
            </Field>
          )}
          {(kind === 'fixed' || kind === 'percentage_plus_fixed') && (
            <Field label="Фіксована (USD)">
              <NumberInput
                min={0}
                step={0.01}
                value={fixedMajor}
                onValueChange={setFixedMajor}
              />
            </Field>
          )}
        </div>
      </Card>

      {error ? (
        <Callout title="Логіка ще не реалізована" tone="warning">
          {error}. Відкрий <code>calculate-fee.ts</code> і реалізуй функції.
        </Callout>
      ) : (
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3,1fr)' }}>
          <Stat label="Gross" value={<Money value={amount} />} />
          <Stat
            hint="скільки бере платформа"
            label="Комісія"
            value={<Money value={fee} />}
          />
          <Stat label="Net мерчанту" value={<Money colored value={net} />} />
        </div>
      )}
    </>
  );
}

function buildRule(
  kind: RuleKind,
  rateBps: number | '',
  fixedMajor: number | '',
): CommissionRule {
  const bps = typeof rateBps === 'number' ? rateBps : 0;
  const fixed = money(typeof fixedMajor === 'number' ? fixedMajor : 0, 'USD');

  switch (kind) {
    case 'percentage':
      return { kind, rateBps: bps };
    case 'fixed':
      return { kind, fee: fixed };
    case 'percentage_plus_fixed':
      return { kind, rateBps: bps, fixed };
    case 'tiered':
      return { kind, tiers: [] };
  }
}
