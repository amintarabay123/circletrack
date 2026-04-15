# Workspace

## Overview

CircleTrack — ROSCA/Tanda Manager. pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Features
- Clerk authentication (Google, Apple, email) — Face ID works automatically via Apple Sign-In on iOS
- Full ROSCA/Tanda management: members, payments, ratings, PDF reports
- Export circles as JSON / Import JSON archives or as fresh templates
- English/Spanish toggle (Spanish default)
- PWA-ready, mobile-first design

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Mobile App (CircleTrack iOS)

- **Artifact**: `artifacts/circletrack` (Expo, port 25112)
- **Bundle ID**: `com.circletrack.app`
- **Auth**: `@clerk/clerk-expo` v2.19.31 — Google/Apple SSO via `useSSO`
- **Token cache**: `expo-secure-store` + `lib/tokenCache.ts`
- **Language**: Spanish default, English toggle via `context/LanguageContext.tsx`
- **Key screens**: Circles list → Circle detail (dashboard+members) → Create circle, Add member, Record payment modals, Settings
- **Env var**: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` injected from `$VITE_CLERK_PUBLISHABLE_KEY` in dev script
- **Dependencies**: `expo-auth-session` (required by `@clerk/clerk-expo` for SSO), `expo-haptics`, `@expo-google-fonts/inter`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
