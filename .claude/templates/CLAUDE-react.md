# CLAUDE.md — React 19

## Stack

React 19, TypeScript 5.8+ strict, Vite 6, SCSS modules, React Router 7, Vitest + Testing Library.

## Rules

- **Functional components only** — no class components.
- Type props with **named interfaces** — no inline types.
- **SCSS modules** for styles — no inline styles or global CSS.
- React 19: `use()` for promises/context, `useActionState` for forms, `useOptimistic` for optimistic UI.
- `ref` is a regular prop — no `forwardRef` needed.
- `<Context value={}>` directly — no `.Provider`.
- Use `useMemo`/`useCallback` for expensive computations and stable refs.
- Always clean up effects with return functions.
- One component per file. Extract reusable logic into custom hooks.
- Strict TS — no `any`, prefer `const`, early returns, handle all errors.
- Files: kebab-case (`user-list.tsx`). Components: PascalCase. Hooks: `use` prefix.
- No `I` prefix on interfaces.
- Imports: external → internal → relative (simple-import-sort).
- Tests: colocated `*.spec.tsx`, Testing Library (query by role/label/text), Arrange–Act–Assert.

## Commands

```bash
npm run dev                          # dev server (port 5173)
npm run test -- --run                # unit tests
npm run lint -- --fix                # lint
```
