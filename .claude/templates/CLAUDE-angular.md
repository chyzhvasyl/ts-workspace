# CLAUDE.md — Angular 19

## Stack

Angular 19, TypeScript 5.8+ strict, SCSS, Angular CLI / esbuild, Karma + Jasmine.

## Rules

- **Standalone components only** — no NgModules.
- **Signals** for component state (`signal`, `computed`, `effect`) — not `BehaviorSubject`.
- **New control flow** (`@if`, `@for`, `@switch`) — not `*ngIf`, `*ngFor`.
- **`inject()` function** — not constructor injection.
- **`ChangeDetectionStrategy.OnPush`** on all components.
- **Functional guards/interceptors** — class-based are deprecated.
- **`provideRouter()`, `provideHttpClient()`** in `app.config.ts` — not `*.forRoot()`.
- `DestroyRef` + `takeUntilDestroyed()` for subscription cleanup.
- Strict TS — no `any`, prefer `const`, early returns, handle all errors.
- Files: kebab-case with suffix (`user-list.component.ts`). Classes: PascalCase with suffix.
- No `I` prefix on interfaces.
- Typed reactive forms with `nonNullable: true`.
- Tests: colocated `*.spec.ts`, `TestBed` with standalone imports, Arrange–Act–Assert.

## Commands

```bash
ng serve                             # dev server (port 4200)
ng test --watch=false                # unit tests
ng lint --fix                        # lint
ng generate component features/<feature>/components/<name>
```
