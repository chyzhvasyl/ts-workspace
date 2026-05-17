# CLAUDE.md

Nx 22.7 monorepo. TypeScript 5.8+ strict, ES2022, `NodeNext` module resolution.

## Apps

- `client-apps/react-concepts` — React 19, Vite, SCSS modules, React Router 7
- `server-apps/nest-concepts` — NestJS 11, Express, Webpack, RxJS
- `ts-apps/algorithm-training` — Pure TS algorithms & data structures

## Commands

```bash
nx serve react-concepts          # React dev (port 4200)
nx serve nest-concepts           # NestJS dev (port 3000, prefix /api)
nx run algorithm-training:start  # Run algorithms
nx test <project>                # Test
nx lint <project>                # Lint
```

## Rules

- Strict TS — no `any`, prefer `const`, never `var`, early returns, handle all errors.
- Files: kebab-case. Classes: PascalCase. No `I` prefix on interfaces.
- Imports: external → internal → relative (simple-import-sort).
- React: functional components only, hooks, SCSS modules, typed prop interfaces.
- NestJS: thin controllers, logic in services, DTOs with class-validator, proper HTTP status codes.
- Algorithms: own folder with `index.ts`, JSDoc with complexity, colocated `.spec.ts`.
- Tests: colocated `*.spec.ts`, Arrange–Act–Assert, mock externals. Vitest for React, Jest for NestJS/algorithms.
- Follow existing patterns. Don't add unnecessary dependencies.
