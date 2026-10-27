# Завдання 2 — Конструктор інвойсу

**Рівень:** junior · **Концепти:** списки та keys, immutable updates, derived totals, unit testing

## Що зробити

1. `invoice-builder.tsx`: реалізуй `addLineItem`, `removeLineItem`, `updateLineItem` — **без мутацій**.
2. `invoice-totals.ts`: реалізуй `computeTotals` (subtotal, tax, total) у minor units.
3. Прожени `nx test fintech-playground` — `invoice-totals.spec.ts` має стати зеленим.

## Філософія

> React тримається на незмінності. Він вирішує, чи перерендерити, порівнюючи **посилання** (`Object.is`). Мутуєш масив на місці — посилання те саме — ре-рендер не відбувається.
