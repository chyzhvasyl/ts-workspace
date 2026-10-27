# Завдання 7 — Контекст налаштувань (split contexts)

**Рівень:** senior · **Концепти:** Context, split contexts, stable identity, avoid re-renders

## Що зробити

Реалізуй `SettingsProvider`: state у `useState`, мемоїзований обʼєкт actions, два окремі провайдери (state і actions). Підключи контроли до actions, превʼю — до state.

## Філософія

> Усі споживачі контексту ре-рендеряться, коли змінюється його `value`. Тому: (1) розділяй контексти за частотою змін, (2) тримай стабільну ідентичність value (`useMemo`). Context — це dependency injection, а не стейт-менеджер для частих апдейтів.
