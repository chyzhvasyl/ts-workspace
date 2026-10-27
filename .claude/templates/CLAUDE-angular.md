# CLAUDE.md — Angular 22

## Stack

Angular 22, TypeScript ~6.0 strict, SCSS, Angular CLI / esbuild, Vitest.

## Rules

- **Standalone components only** — no NgModules.
- **Signals** for component state (`signal`, `computed`, `effect`) — not `BehaviorSubject`.
- **New control flow** (`@if`, `@for`, `@switch`) — not `*ngIf`, `*ngFor`.
- **`inject()` function** — not constructor injection.
- **OnPush is the default (v22+)** — don't set `changeDetection` explicitly; `ChangeDetectionStrategy.Eager` opts out.
- **Functional guards/interceptors** — class-based are deprecated.
- **`provideRouter()`, `provideHttpClient()`** in `app.config.ts` — not `*.forRoot()`.
- `DestroyRef` + `takeUntilDestroyed()` for subscription cleanup.
- Strict TS — no `any`, prefer `const`, early returns, handle all errors.
- Files: kebab-case, named after the class, no `.component` suffix (`user-list.ts` → `UserList`); guards/interceptors/pipes keep a hyphenated type (`auth-guard.ts`). Classes: PascalCase, no `Component` suffix.
- No `I` prefix on interfaces.
- Signal Forms for new forms; otherwise typed reactive forms with `nonNullable: true`.
- Tests: colocated `*.spec.ts`, `TestBed` with standalone imports, Arrange–Act–Assert.

## Commands

```bash
ng serve                             # dev server (port 4200)
ng test --watch=false                # unit tests
ng lint --fix                        # lint
ng generate component features/<feature>/components/<name>
```
