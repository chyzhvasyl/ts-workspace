# GitHub Copilot Instructions — Angular 22

Standalone components only, no NgModules. Signals for state (`signal`, `computed`, `effect`). New control flow (`@if`, `@for`, `@switch`). `inject()` function, not constructor injection. OnPush is the default (v22+) — don't set `changeDetection` explicitly. Functional guards/interceptors. `provideRouter()`/`provideHttpClient()` in `app.config.ts`.

TypeScript ~6.0 strict — no `any`, prefer `const`, early returns. Files: kebab-case, named after the class, no `.component` suffix (`user-list.ts` → `UserList`); guards/interceptors/pipes keep a hyphenated type (`auth-guard.ts`). No `I` prefix on interfaces. Signal Forms for new forms, otherwise typed reactive forms. `DestroyRef` + `takeUntilDestroyed()` for cleanup.

Tests: colocated `*.spec.ts`, `TestBed` with standalone imports, Arrange–Act–Assert.
