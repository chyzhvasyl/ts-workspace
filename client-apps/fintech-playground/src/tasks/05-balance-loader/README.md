# Завдання 5 — Завантаження балансів (useEffect / async)

**Рівень:** senior · **Концепти:** `useEffect`, data fetching, cleanup, `AbortController`, race conditions, custom hook

## Що зробити

Реалізуй `useAsync` у `use-async.ts`: стани loading/error/success, скасування через `AbortController`, ігнорування застарілих відповідей, без setState після unmount.

## Філософія

> Рендер має бути чистим — усі side-effects у `useEffect`. Кожен ефект із підпискою/запитом потребує cleanup. Асинхронність + швидка зміна залежностей = race condition; ловиться `AbortController` або прапорцем `ignore`.
