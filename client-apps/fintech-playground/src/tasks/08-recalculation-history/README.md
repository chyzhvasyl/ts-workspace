# Завдання 8 — Undo/Redo + optimistic update

**Рівень:** senior · **Концепти:** generic `useReducer`, time-travel state, undo/redo, optimistic UI, rollback

## Що зробити

Реалізуй generic `historyReducer` (past/present/future) для undo/redo. Розбери оптимістичне `apply` з відкатом при відмові сервера (накидано — поясни собі логіку, увімкни “Симулювати відмову”).

## Філософія

> Узагальнений reducer = чиста логіка, що живе поза React і тривіально тестується. Оптимістичний UI показує результат до підтвердження сервера заради швидкості, але мусить уміти відкотитись — тому завжди зберігай `previous`.
