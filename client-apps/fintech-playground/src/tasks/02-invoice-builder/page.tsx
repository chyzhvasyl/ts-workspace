import { TaskPage } from '../../pages/task-page';

import { InvoiceBuilder } from './invoice-builder';

export const meta = {
  id: 'invoice-builder',
  order: 2,
  title: 'Конструктор інвойсу',
  difficulty: 'junior' as const,
  concepts: [
    'lists & keys',
    'immutable updates',
    'derived totals',
    'controlled inputs',
    'unit testing',
  ],
  summary:
    'Редагований список позицій. Ключова навичка React: оновлювати масиви/обʼєкти в стані БЕЗ мутації, через нові посилання, і виводити підсумки як похідні значення.',
};

export function InvoiceBuilderPage() {
  return (
    <TaskPage
      acceptance={[
        'Додавання/видалення/редагування рядка працює і не мутує попередній стан.',
        'Підсумки перераховуються миттєво.',
        'Усі 3 юніт-тести computeTotals — зелені.',
      ]}
      hints={[
        'map повертає НОВИЙ масив; для update — map з тернаром по id.',
        'filter для видалення, [...prev, newLine()] для додавання.',
        'Чому immutability? React порівнює посилання (Object.is). Мутація = пропущений ре-рендер.',
      ]}
      meta={meta}
      requirements={[
        <>
          Реалізуй <code>addLineItem</code>, <code>removeLineItem</code>,{' '}
          <code>updateLineItem</code> immutably.
        </>,
        <>
          Реалізуй <code>computeTotals</code> у <code>invoice-totals.ts</code> (subtotal,
          tax, total).
        </>,
        <>
          Запусти тест: <code>nx test fintech-playground</code> —{' '}
          <code>invoice-totals.spec.ts</code> має пройти.
        </>,
      ]}
    >
      <InvoiceBuilder />
    </TaskPage>
  );
}
