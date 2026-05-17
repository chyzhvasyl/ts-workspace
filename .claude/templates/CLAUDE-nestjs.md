# CLAUDE.md — NestJS 11

## Stack

NestJS 11, TypeScript 5.8+ strict (decorators enabled), Express, class-validator, Swagger, Jest.

## Rules

- **Module structure**: `*.module.ts`, `*.controller.ts`, `*.service.ts`.
- **Controllers are thin** — all business logic in services.
- **DTOs** with `class-validator` decorators for all input. `ValidationPipe` with `whitelist: true, transform: true`.
- **Proper HTTP status codes** (201 create, 204 delete). Use NestJS exception classes.
- **Swagger decorators** (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) on all endpoints.
- **Constructor-based DI** — never instantiate services manually.
- `Logger` from `@nestjs/common` — never `console.log`.
- `@nestjs/config` for env vars — never hardcode secrets.
- RxJS observables for async streams where appropriate.
- Strict TS — no `any`, prefer `const`, early returns, handle all errors.
- Files: kebab-case with suffix (`user.controller.ts`, `create-user.dto.ts`). Classes: PascalCase with suffix.
- No `I` prefix on interfaces.
- Tests: colocated `*.spec.ts`, `@nestjs/testing` with `Test.createTestingModule`, Arrange–Act–Assert, mock repos.

## Commands

```bash
npm run start:dev                    # dev server (port 3000, prefix /api)
npm run test -- --watch=false        # unit tests
npm run test:e2e                     # E2E tests
nest generate resource modules/<name>  # CRUD scaffold
```
