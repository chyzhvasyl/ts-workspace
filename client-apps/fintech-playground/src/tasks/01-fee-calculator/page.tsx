import { TaskPage } from '../../pages/task-page';
import { FeeCalculator } from './fee-calculator';

export const meta = {
  id: 'fee-calculator',
  order: 1,
  title: 'Калькулятор комісії',
  difficulty: 'junior' as const,
  concepts: [
    'useState',
    'derived state',
    'controlled inputs',
    'pure functions',
    'discriminated union',
  ],
  summary:
    'Найважливіша філософія React: тримай мінімум стану і обчислюй усе решта під час рендеру. Комісію та net НЕ зберігай у state — це похідні значення.',
};

export function FeeCalculatorPage() {
  return (
    <TaskPage
      meta={meta}
      requirements={[
        <>
          Реалізуй <code>calculateFee(amount, rule)</code> у <code>calculate-fee.ts</code>{' '}
          для всіх типів правил.
        </>,
        <>
          Реалізуй <code>calculateNet</code> = amount − fee.
        </>,
        <>
          Переконайся, що компонент НЕ зберігає fee/net у <code>useState</code> — лише
          обчислює їх під час рендеру.
        </>,
        <>Усі обчислення — в minor units (цілі числа), щоб уникнути помилок float.</>,
      ]}
      acceptance={[
        'Зміна суми/ставки одразу оновлює результат.',
        '290 bps на $100 → комісія $2.90; + fixed $0.30 → $3.20; net $96.80.',
        'switch по rule.kind вичерпний (TypeScript не свариться на never).',
      ]}
      hints={[
        'Єдине джерело правди — інпути. fee і net виводяться з них.',
        'rateBps / 10_000 дає частку; множ на amount.amountMinor і округлюй.',
        'Чому minor units? 0.1 + 0.2 !== 0.3 у float — у фінтеху це баг.',
      ]}
    >
      <FeeCalculator />
    </TaskPage>
  );
}
