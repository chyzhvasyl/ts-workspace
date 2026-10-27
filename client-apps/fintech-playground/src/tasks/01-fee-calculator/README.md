# Завдання 1 — Калькулятор комісії

**Рівень:** junior · **Концепти:** `useState`, derived state, controlled inputs, pure functions, discriminated unions

## Контекст

Finance-команда Solidgate рахує комісії на кожну транзакцію. Почнемо з фундаменту React: **мінімум стану + похідні значення**.

## Що зробити

1. У `calculate-fee.ts` реалізуй `calculateFee(amount, rule)` для правил: `percentage`, `fixed`, `percentage_plus_fixed`, `tiered`.
2. Реалізуй `calculateNet` = amount − fee.
3. У `fee-calculator.tsx` переконайся, що fee/net **не** зберігаються в `useState` — лише обчислюються під час рендеру.

## Критерії

- Зміна інпутів миттєво оновлює результат.
- 290 bps на $100 → $2.90; +fixed $0.30 → $3.20; net $96.80.
- Вичерпний `switch` по `rule.kind` (перевірка `never`).

## Філософія

> Якщо значення можна обчислити з наявного стану — не клади його в state. Дублювання стану = розсинхрон.
