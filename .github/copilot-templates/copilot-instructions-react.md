# GitHub Copilot Instructions — React 19

Functional components only. Type props with named interfaces. SCSS modules for styles. React 19: `use()` for promises/context, `useActionState` for forms, `useOptimistic` for optimistic UI. `ref` is a regular prop — no `forwardRef`. `<Context value={}>` directly — no `.Provider`.

TypeScript 5.8+ strict — no `any`, prefer `const`, early returns. Files: kebab-case. One component per file. Extract logic into custom hooks. Imports: external → internal → relative.

Tests: colocated `*.spec.tsx`, Testing Library (query by role/label/text), Arrange–Act–Assert.
