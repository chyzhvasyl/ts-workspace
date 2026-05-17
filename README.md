# ts-workspace

Nx monorepo with TypeScript applications for learning and experimentation.

## Apps

| App                    | Path                         | Stack                                        | Dev Server           |
| ---------------------- | ---------------------------- | -------------------------------------------- | -------------------- |
| **react-concepts**     | `client-apps/react-concepts` | React 19, Vite, SCSS modules, React Router 7 | `localhost:4200`     |
| **nest-concepts**      | `server-apps/nest-concepts`  | NestJS 11, Express, Webpack, RxJS            | `localhost:3000/api` |
| **algorithm-training** | `ts-apps/algorithm-training` | Pure TypeScript algorithms & data structures | —                    |

## Prerequisites

- Node.js 22+
- npm 10+

## Getting Started

```bash
npm install
```

## Scripts

```bash
# Serve
npm run react-app:start          # React dev server
npm run nest-app:serve           # NestJS dev server
npm run nest-app:hot-serve       # NestJS with HMR
npm run ts-app:run               # Run algorithm training

# Build
npm run react-app:build
npm run nest-app:build

# Lint & Format
npm run lint:fix                 # ESLint all projects
npm run lint:styles              # Stylelint all SCSS
npm run format:write             # Prettier fix all
npm run format:check             # Prettier check only

# Test
nx test react-concepts           # Vitest
nx test nest-concepts            # Jest
nx test algorithm-training       # Jest
```

## Tech Stack

- **Monorepo:** Nx 22.7
- **Language:** TypeScript 5.8 (strict, ES2022, NodeNext)
- **Linting:** ESLint (Airbnb + Prettier) · Stylelint (standard SCSS) · Prettier
- **Testing:** Vitest (React) · Jest (NestJS, algorithms) · Playwright (E2E)

## Author

Vasyl Chyzh
