# GitHub Copilot Instructions — Angular 19

Standalone components only, no NgModules. Signals for state (`signal`, `computed`, `effect`). New control flow (`@if`, `@for`, `@switch`). `inject()` function, not constructor injection. `ChangeDetectionStrategy.OnPush` on all components. Functional guards/interceptors. `provideRouter()`/`provideHttpClient()` in `app.config.ts`.

TypeScript 5.8+ strict — no `any`, prefer `const`, early returns. Files: kebab-case with suffix. No `I` prefix on interfaces. Typed reactive forms. `DestroyRef` + `takeUntilDestroyed()` for cleanup.

Tests: colocated `*.spec.ts`, `TestBed` with standalone imports, Arrange–Act–Assert.
