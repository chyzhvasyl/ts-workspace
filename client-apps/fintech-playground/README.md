# Fintech Playground — підготовка до співбесіди (Solidgate, Frontend Engineer)

Тренувальний застосунок: **8 завдань на чисту логіку React** у фінтех-домені
(комісії, інвойси, баланси, тарифні правила, ledger). UI вже готовий — твоє
завдання лише **написати логіку** в місцях, позначених `// TODO`.

## Запуск

```bash
nx serve fintech-playground     # dev-сервер, http://localhost:4250
nx test fintech-playground      # юніт-тести (Vitest)
nx lint fintech-playground      # лінт
nx build fintech-playground     # прод-збірка
```

Відкрий `/` — огляд завдань, `/guide` — гайд до співбесіди з питаннями й тезами.

## Як працювати

1. Відкрий завдання у бічному меню.
2. Прочитай **ТЗ** ліворуч (що зробити, критерії готовності, підказки).
3. Знайди файли з `// TODO` (логіка винесена окремо від UI).
4. Реалізуй логіку, перевір результат у браузері.
5. Де є `*.spec.ts` — прожени `nx test fintech-playground`.

## Карта: концепт React → завдання

| #   | Завдання               | Рівень | Що відпрацьовуєш                                                                   |
| --- | ---------------------- | ------ | ---------------------------------------------------------------------------------- |
| 01  | Калькулятор комісії    | junior | `useState`, derived state, controlled inputs, pure functions, discriminated unions |
| 02  | Конструктор інвойсу    | junior | списки та keys, immutable updates, derived totals, unit testing                    |
| 03  | Тарифні правила        | middle | `useReducer`, discriminated unions, exhaustive switch / `never`                    |
| 04  | Explorer транзакцій    | middle | `useMemo`, derived data, `React.memo`, performance                                 |
| 05  | Завантаження балансів  | senior | `useEffect`, async, cleanup, `AbortController`, race conditions, custom hook       |
| 06  | Форма виплати          | middle | controlled forms, validation, custom `useForm`, `useRef`                           |
| 07  | Контекст налаштувань   | senior | Context, split contexts, stable identity, avoid re-renders                         |
| 08  | Undo/Redo + optimistic | senior | generic `useReducer`, time-travel state, optimistic UI, rollback                   |

## Структура

```
src/
  shared/
    ui/        ← готові стилізовані компоненти (Button, Card, Table, Money, …) — НЕ чіпай
    domain/    ← типи, money-утиліти, мок-API (фінтех-домен)
  tasks/       ← 8 завдань: ТЗ + готовий UI + файли з // TODO
  pages/       ← головна, гайд, layout сторінки завдання
```

## Принципи (філософія React, яку перевіряють на співбесіді)

- **UI = f(state).** Рендер — чиста функція стану. Мінімум стану, решта — похідні.
- **Immutability.** React порівнює посилання — ніколи не мутуй стан на місці.
- **Side-effects → `useEffect`** з обовʼязковим cleanup.
- **Доменна логіка поза React** — у звичайному TS, легко тестується (так збудовані `domain/` і файли логіки завдань).
- **Гроші в minor units** (cents) цілими числами — ніколи float.
