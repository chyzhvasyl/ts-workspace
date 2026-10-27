# Завдання 3 — Редактор тарифних правил (useReducer)

**Рівень:** middle · **Концепти:** `useReducer`, discriminated unions, exhaustive switch, `never`

## Що зробити

Реалізуй `rulesReducer` (5 екшенів) у `rules-reducer.ts`, чисто й immutably. Зроби `switch` вичерпним з перевіркою `never`.

## Філософія

> `useReducer` — це Redux-патерн усередині компонента. Стан змінюється лише чистою функцією у відповідь на описані екшени → передбачуваність, тестованість, легке undo/redo (див. завдання 8).
