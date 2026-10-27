# ts-workspace

Nx monorepo with TypeScript applications for learning and experimentation.

## Apps

| App                    | Path                             | Stack                                        | Dev Server           |
| ---------------------- | -------------------------------- | -------------------------------------------- | -------------------- |
| **react-concepts**     | `client-apps/react-concepts`     | React 19, Vite, SCSS modules, React Router 7 | `localhost:4200`     |
| **fintech-playground** | `client-apps/fintech-playground` | React 19, Vite, SCSS modules, React Router 7 | `localhost:4250`     |
| **nest-concepts**      | `server-apps/nest-concepts`      | NestJS 11, Express, Webpack, RxJS            | `localhost:3000/api` |
| **algorithm-training** | `ts-apps/algorithm-training`     | Pure TypeScript algorithms & data structures | —                    |

## Prerequisites

- Node.js 22.13+ (see `.nvmrc`)
- npm 10+

## Getting Started

```bash
npm install
```

## Scripts

```bash
# Serve
npm run react-app:start          # React dev server
npm run fintech-app:serve        # Fintech playground dev server
npm run nest-app:serve           # NestJS dev server
npm run nest-app:hot-serve       # NestJS with HMR
npm run ts-app:run               # Run algorithm training

# Build
npm run react-app:build
npm run nest-app:build

# Lint & Format
npm run lint:fix                 # ESLint --fix all projects
npm run lint:styles              # Stylelint --fix all SCSS
npm run format:write             # Prettier fix all
npm run format:check             # Prettier check only

# Before opening a PR
npm run prepare-pr               # format, ESLint --fix, Stylelint --fix, format again, build (affected projects vs main)
npm run prepare-pr:all           # same, every project

# Test
nx test react-concepts           # Vitest
nx test nest-concepts            # Jest
nx test algorithm-training       # Jest

# Specs (OpenSpec)
npm run openspec:validate        # validate specs and in-flight changes
```

`prepare-pr` stops at the first failing step. `nx test fintech-playground` and its typecheck fail by design (the exercises are stubs), but neither is part of `prepare-pr`.

## Tech Stack

- **Monorepo:** Nx 24
- **Language:** TypeScript 6.0 (strict, ES2022, NodeNext)
- **Strictness:** `noUncheckedIndexedAccess` is on everywhere except `ts-apps/algorithm-training` (its accepted solutions index arrays freely)
- **Linting:** ESLint 9 (flat config) · Stylelint (standard SCSS) · Prettier
- **Testing:** Vitest (React) · Jest (NestJS, algorithms) · Playwright and Cypress (E2E)

## AI Tooling

| What                     | Where                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| Claude Code instructions | `.claude/CLAUDE.md`, `.claude/settings.json`, stack templates in `.claude/templates`              |
| Copilot instructions     | `.github/copilot-instructions.md`, stack templates in `.github/copilot-templates`                 |
| Nx skill                 | `.claude/skills/nx-workspace` (locked in `skills-lock.json`)                                      |
| MCP servers              | `.mcp.json` (Claude Code) and `.vscode/mcp.json` (VS Code Copilot)                                |
| Spec-driven changes      | [OpenSpec](https://github.com/Fission-AI/OpenSpec): `openspec/`, config in `openspec/config.yaml` |

The MCP servers are `context7` (library docs), `nx-mcp`, `angular-cli` and `playwright`. Claude Code asks for approval the first time it sees `.mcp.json`.

OpenSpec's generated skills and prompts call a bare `openspec` command, so install the CLI once per machine at the version pinned in `package.json`:

```bash
npm install -g @fission-ai/openspec@<version in package.json>
```

## Dependency Notes

Some packages are deliberately held back. Revisit them when the exit condition is met.

| Held                  | At     | Why                                                                                     | Exit condition                                                                     |
| --------------------- | ------ | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| NestJS                | 11.x   | `@nx/nest` peers `<12`; Nest 12 is ESM-only and needs Node 24.9+ to load under CJS Jest | `@nx/nest` allows 12 and Node 24.9+ or ESM test runner                             |
| TypeScript            | ~6.0   | TS 7 has no JS API yet (Nx, typescript-eslint, ts-jest need it)                         | TS 7.1+ and tool support; then drop `ignoreDeprecations` from `tsconfig.base.json` |
| ESLint                | 9.x    | `eslint-plugin-react`, `-jsx-a11y` and `-import` do not support ESLint 10 yet           | Those plugins ship ESLint 10 support                                               |
| jsdom                 | 29     | jsdom 30 needs Node 22.22.2+                                                            | Raise `engines.node` to `^22.22.2 \|\| ^24.15.0 \|\| >=26`                         |
| `@types/node`         | 22     | Types should match the Node 22 runtime                                                  | Move to a newer Node LTS                                                           |
| `overrides.multer`    | 2.5.0  | Security fix; `@nestjs/platform-express` 11.2.8 pins multer 2.4.0                       | An 11.x release with multer 2.5.0+, or Nest 12                                     |
| `overrides.nx.undici` | 7.30.1 | Security fix; `nx` 24.0.2 pins undici 7.29.0                                            | `nx` ships undici 7.30.1+ (or 8.12.2+)                                             |

## Author

Vasyl Chyzh
