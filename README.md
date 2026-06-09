# blueprint

MVP starter — React + Hono + oRPC, full-stack type safety, ready to ship.

## Stack

| Concern | Tool |
|---|---|
| Runtime | Bun |
| Monorepo | Turborepo |
| Server | Hono + oRPC |
| Auth | better-auth |
| ORM | Prisma (multi-file schema) |
| Database | PostgreSQL |
| Frontend | React 19 + Vite + TanStack Router |
| Data fetching | TanStack Query |
| UI | shadcn/ui + Tailwind CSS v4 |
| Logging | evlog |
| Env validation | t3-oss/env-core |
| Lint / Format | oxlint + oxfmt |

## Structure

```
apps/
  web/        React + Vite + TanStack Router
              └── src/lib/env.ts        env validation
              └── src/lib/auth-client.ts
              └── src/components/ui/    shadcn components (local)
              └── src/utils/orpc.ts     typed RPC client + QueryClient

  server/     Hono + oRPC
              └── src/lib/auth.ts       better-auth config
              └── src/lib/context.ts    oRPC context (session)
              └── src/lib/orpc.ts       publicProcedure / protectedProcedure / adminProcedure
              └── src/lib/env.ts        env validation
              └── src/lib/errors.ts     notFound() / forbidden() / badRequest()
              └── src/lib/pagination.ts paginateQuerySchema + helpers
              └── src/lib/error-envelope.ts  structured error responses
              └── src/router.ts         root router → exports AppRouterClient type
              └── src/features/user/    example feature (3 files)

packages/
  db/         Prisma client + multi-file schema
  config/     tsconfig base
```

## Getting started

```bash
bun install
```

Copy the example env files:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

Set up the database:

```bash
bun run db:push
```

Start everything:

```bash
bun run dev
```

- Web: http://localhost:5173
- Server: http://localhost:3000
- API docs (OpenAPI): http://localhost:3000/api-reference

## Adding a feature

Each feature lives in `apps/server/src/features/<name>/` with exactly 3 files:

```
features/post/
  post.schema.ts   Zod schemas + inferred types
  post.service.ts  Prisma queries, data transforms
  post.router.ts   oRPC handlers, auth policy inline
```

Wire it into `apps/server/src/router.ts`:

```typescript
import { postRouter } from "./features/post/post.router";

export const appRouter = {
  healthCheck: ...,
  user: userRouter,
  post: postRouter,   // ← add here
};
```

The web picks up the new endpoints automatically via the shared `AppRouterClient` type.

## Adding UI components

Run shadcn from the web app:

```bash
cd apps/web && npx shadcn@latest add dialog
```

Components land in `apps/web/src/components/ui/`.

## Auth

better-auth handles sign-up, sign-in, and session management. The `admin` plugin provides role-based access:

- Default role: `"user"`
- Admin role: `"admin"`

Use procedures from `apps/server/src/lib/orpc.ts`:

```typescript
import { protectedProcedure, adminProcedure } from "../../lib/orpc";

export const myRouter = {
  myHandler: protectedProcedure.handler(...),  // requires session
  adminOnly: adminProcedure.handler(...),       // requires role === "admin"
};
```

## Shared types (web ↔ server)

The web imports the router type directly from the server package — no separate contracts package:

```typescript
import type { AppRouterClient } from "server/types";
```

oRPC infers all input/output types automatically. You rarely need to import types explicitly — they flow through `orpc.useQuery()` and `orpc.useMutation()`.

## Scripts

| Command | Action |
|---|---|
| `bun run dev` | Start web + server |
| `bun run dev:web` | Start web only |
| `bun run dev:server` | Start server only |
| `bun run build` | Build all apps |
| `bun run check-types` | TypeScript check across all packages |
| `bun run check` | oxlint + oxfmt |
| `bun run db:push` | Push schema to database |
| `bun run db:generate` | Regenerate Prisma client |
| `bun run db:migrate` | Run migrations |
| `bun run db:studio` | Open Prisma Studio |
