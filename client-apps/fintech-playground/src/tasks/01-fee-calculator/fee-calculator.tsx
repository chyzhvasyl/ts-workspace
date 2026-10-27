import { useState } from 'react';

import { money, Money as MoneyValue, zero } from '../../shared/domain/money';
import { CommissionRule } from '../../shared/domain/types';
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
        title="Конфігурація комісії"
        subtitle="Зміни інпути — результат має перерахуватись миттєво"
      >
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          }}
        >
          <Field label="Сума (USD)">
            <NumberInput value={amountMajor} onValueChange={setAmountMajor} min={0} />
          </Field>
          <Field label="Тип правила">
            <Select
              value={kind}
              options={RULE_OPTIONS}
              onValueChange={(v) => setKind(v as RuleKind)}
            />
          </Field>
          {(kind === 'percentage' || kind === 'percentage_plus_fixed') && (
            <Field label="Ставка (bps)" hint="290 bps = 2.90%">
              <NumberInput value={rateBps} onValueChange={setRateBps} min={0} />
            </Field>
          )}
          {(kind === 'fixed' || kind === 'percentage_plus_fixed') && (
            <Field label="Фіксована (USD)">
              <NumberInput
                value={fixedMajor}
                onValueChange={setFixedMajor}
                min={0}
                step={0.01}
              />
            </Field>
          )}
        </div>
      </Card>

      {error ? (
        <Callout tone="warning" title="Логіка ще не реалізована">
          {error}. Відкрий <code>calculate-fee.ts</code> і реалізуй функції.
        </Callout>
      ) : (
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3,1fr)' }}>
          <Stat label="Gross" value={<Money value={amount} />} />
          <Stat
            label="Комісія"
            value={<Money value={fee} />}
            hint="скільки бере платформа"
          />
          <Stat label="Net мерчанту" value={<Money value={net} colored />} />
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
