# GitHub Copilot Instructions — NestJS 11

Module structure: `*.module.ts`, `*.controller.ts`, `*.service.ts`. Controllers are thin — logic in services. DTOs with `class-validator` for all input. Proper HTTP status codes (201 create, 204 delete). Swagger decorators on all endpoints. Constructor-based DI. `Logger` from `@nestjs/common` — never `console.log`.

TypeScript 5.8+ strict (decorators enabled) — no `any`, prefer `const`, early returns. Files: kebab-case with suffix. No `I` prefix on interfaces. `@nestjs/config` for env vars.

Tests: colocated `*.spec.ts`, `@nestjs/testing` with `Test.createTestingModule`, Arrange–Act–Assert, mock repos.
