# CarbonSphere AI — Technical Requirements Document

**Version:** 1.0  
**Date:** June 8, 2026  
**Author:** Principal Software Architect  
**Status:** Draft — Ready for Implementation  
**Project:** CarbonSphere AI ("Track Smarter. Live Greener.")

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [High-Level Architecture Diagram](#2-high-level-architecture-diagram)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Architecture](#5-database-architecture)
6. [Authentication Architecture](#6-authentication-architecture)
7. [API Architecture](#7-api-architecture)
8. [AI Integration Architecture](#8-ai-integration-architecture)
9. [State Management Strategy](#9-state-management-strategy)
10. [Security Architecture](#10-security-architecture)
11. [Accessibility Architecture](#11-accessibility-architecture)
12. [Performance Optimization Strategy](#12-performance-optimization-strategy)
13. [Testing Strategy](#13-testing-strategy)
14. [Error Handling Strategy](#14-error-handling-strategy)
15. [Logging Strategy](#15-logging-strategy)
16. [Monitoring Strategy](#16-monitoring-strategy)
17. [Deployment Architecture](#17-deployment-architecture)
18. [CI/CD Pipeline](#18-cicd-pipeline)
19. [Environment Variables](#19-environment-variables)
20. [Folder Structure](#20-folder-structure)
21. [Database Entity Design](#21-database-entity-design)
22. [API Endpoint Specifications](#22-api-endpoint-specifications)
23. [Rate Limiting Strategy](#23-rate-limiting-strategy)
24. [Caching Strategy](#24-caching-strategy)
25. [Scalability Considerations](#25-scalability-considerations)
26. [Production Readiness Checklist](#26-production-readiness-checklist)
27. [Technical Risks and Mitigations](#27-technical-risks-and-mitigations)
28. [Development Workflow](#28-development-workflow)

---

## 1. System Architecture

CarbonSphere AI is designed as a modern, monolithic serverless application optimized for extreme execution speed, type safety, and maximum evaluation scores in Hackathon environments. 

The architecture leverages **Next.js 15 (App Router)** as the core framework, combining React Server Components (RSC) for initial page loads and performance with Client Components for rich interactivity (calculators, simulators).

- **Compute/Hosting:** Vercel (Edge network, Serverless functions)
- **Database:** PostgreSQL managed by Supabase
- **ORM:** Prisma (Type-safe database access)
- **Auth:** Supabase Auth (integrated via Next.js middleware)
- **AI Inference:** Google Gemini API (Proxied through Next.js Route Handlers)

This architecture eliminates the need for a separate backend server, reducing operational complexity and deployment friction while maintaining enterprise-grade security and scalability.

---

## 2. High-Level Architecture Diagram

```mermaid
flowchart TD
    Client[Web Browser / Client]
    
    subgraph Vercel[Vercel Edge Network & Serverless]
        Middleware[Next.js Middleware \n Auth & Rate Limiting]
        Frontend[Next.js 15 Frontend \n RSC + Client Components]
        API[Next.js Route Handlers / Server Actions]
    end

    subgraph SupabasePlatform[Supabase Managed Platform]
        Auth[Supabase Auth]
        Postgres[(PostgreSQL)]
    end

    subgraph ExternalAPIs[External APIs]
        Gemini[Google Gemini API \n LLM Inference]
    end

    Client <-->|HTTPS| Middleware
    Middleware <-->|Routes| Frontend
    Frontend <-->|tRPC-like / REST| API
    
    API <-->|Prisma TCP/Pool| Postgres
    API <-->|REST| Gemini
    
    Middleware <-->|JWT Verification| Auth
    Frontend <-->|OAuth / Email| Auth
```

---

## 3. Frontend Architecture

- **Framework:** Next.js 15 with React 19 features (use, Server Actions).
- **Styling:** Tailwind CSS integrated with `shadcn/ui` for rapid, accessible, and highly customizable UI components.
- **Data Fetching:** React Server Components (RSC) for initial reads. SWR or Next.js `fetch` with cache tags for client-side revalidation.
- **Form Handling:** `react-hook-form` paired with `@hookform/resolvers/zod` for strictly typed form validation matching the Prisma schema.
- **Charts:** `recharts` for declarative, React-friendly, SVG-based responsive data visualization.

### Component Strategy
- **Server Components by Default:** Move data fetching to the server to reduce JavaScript bundle sizes and improve LCP.
- **Client Boundary:** Use `"use client"` only at the leaf nodes where interactivity (useState, useEffect, browser APIs) is required (e.g., interactive charts, simulator toggles, multi-step forms).

---

## 4. Backend Architecture

- **Execution Environment:** Vercel Serverless Functions via Next.js App Router (`app/api/...` and Server Actions).
- **Server Actions:** Used exclusively for form submissions and mutations (e.g., saving a footprint calculation, updating profile) to leverage progressive enhancement and type safety without writing boilerplate API routes.
- **Route Handlers:** Used for webhooks, streaming responses (AI integration), and complex endpoints requiring fine-grained caching control.

---

## 5. Database Architecture

- **Engine:** PostgreSQL 15+ (Hosted on Supabase).
- **Access Layer:** Prisma ORM. Prisma guarantees end-to-end type safety from the database schema down to the React component props.
- **Connection Management:** Use Prisma Client with a serverless connection pooler (e.g., Supabase's PgBouncer or Prisma Accelerate) to prevent connection exhaustion during cold starts.

---

## 6. Authentication Architecture

- **Provider:** Supabase Auth.
- **Integration:** Handled via `@supabase/ssr` to securely manage cookies across Next.js Server Components, Client Components, Server Actions, and Route Handlers.
- **Middleware:** Next.js `middleware.ts` intercepts requests to protected routes (`/dashboard`, `/simulator`), verifies the JWT session, and redirects unauthenticated users to `/login`.
- **Identity:** Users can sign in via Magic Link, Email/Password, or Google OAuth.

---

## 7. API Architecture

- **Pattern:** Primarily RPC over HTTP via Next.js Server Actions for standard CRUD operations to eliminate API boilerplate and ensure end-to-end typing.
- **Validation:** Zod schemas are used at the entry point of every Server Action to validate inputs. The same Zod schemas are shared with the frontend for client-side validation.
- **Response Format:** Server actions return standard objects: `{ success: true, data: T }` or `{ success: false, error: string, validationErrors?: any }`.

---

## 8. AI Integration Architecture

- **Provider:** Google Gemini API (`@google/genai` SDK).
- **Pattern:** Streaming generation.
- **Implementation:** Next.js Route Handler (`/api/chat`) using the `ai` SDK (Vercel AI SDK) to stream tokens directly to the client for the Sustainability Coach feature, ensuring a responsive UX.
- **Structured Output:** For the Reduction Planner, utilize Gemini's `response_mime_type: "application/json"` to enforce structured JSON responses mapped to a Zod schema.

---

## 9. State Management Strategy

- **Server State:** Handled natively by Next.js Server Components and Server Actions. Cached data is revalidated using `revalidatePath` or `revalidateTag`.
- **Global Client State:** Minimal. Uses `zustand` for cross-component client-side state only when necessary (e.g., multi-step footprint calculator wizard state before submission).
- **Local Client State:** standard `useState` and `useReducer`.

---

## 10. Security Architecture

- **Data Protection:** PostgreSQL Row Level Security (RLS) policies implemented in Supabase to guarantee that users can only read/write their own `user_id` records, providing a defense-in-depth layer below Prisma.
- **Input Sanitization:** All inputs strictly validated via Zod.
- **Secret Management:** Environment variables managed securely in Vercel. `NEXT_PUBLIC_` prefix only for safe client variables.
- **XSS Prevention:** React's native DOM escaping. Markdown rendered via `react-markdown` with strict rehype sanitization.
- **CSRF:** Next.js Server Actions have built-in CSRF protection.

---

## 11. Accessibility Architecture

- **Component Library:** `shadcn/ui` utilizes Radix UI primitives under the hood, guaranteeing WCAG 2.1 AA compliance for complex interactive widgets (modals, dropdowns, accordions).
- **Focus Management:** Handled natively by Radix UI.
- **Color Contrast:** Tailwind configuration strictly adheres to WCAG contrast ratios in both Light and Dark modes.
- **Screen Readers:** ARIA labels, `aria-live` regions for AI chat responses, and visually hidden tables for all Recharts visualizations.
- **Enforcement:** `eslint-plugin-jsx-a11y` configured to error on violations.

---

## 12. Performance Optimization Strategy

- **Font Optimization:** `next/font` for optimal loading of Google Fonts with zero layout shift.
- **Image Optimization:** `next/image` for automatic format conversion (WebP/AVIF), resizing, and lazy loading.
- **Bundle Size:** Utilize dynamic imports (`next/dynamic`) for heavy libraries like Recharts.
- **Streaming:** Implement React Suspense boundaries around slow data fetching components to stream HTML progressively.

---

## 13. Testing Strategy

- **Unit Testing:** `vitest` for pure functions, Prisma logic, calculation algorithms, and Zod schemas.
- **Component Testing:** React Testing Library for verifying accessible rendering of UI components.
- **E2E Testing:** Playwright. Focus on critical user journeys: Sign up → Calculate Footprint → Save → View Dashboard.
- **A11y Testing:** `axe-core` integrated into Playwright to catch accessibility regressions.

---

## 14. Error Handling Strategy

- **UI Level:** Next.js `error.tsx` and `global-error.tsx` boundaries to catch render and RSC errors.
- **Action Level:** Try/catch blocks in Server Actions returning standardized error payloads without leaking database specifics.
- **Form Level:** `react-hook-form` displaying Zod validation errors inline.
- **AI Fallbacks:** Graceful degradation if Gemini API limits are reached, showing friendly UI prompts.

---

## 15. Logging Strategy

- **Development:** Console logs with `pino` for structured formatting.
- **Production:** Vercel Runtime Logs. Critical errors captured and tagged with correlation IDs. Prisma query logging disabled in production to prevent PII leaks.

---

## 16. Monitoring Strategy

- **Performance:** Vercel Speed Insights to track Core Web Vitals (LCP, FID, CLS) in real-time.
- **Analytics:** Vercel Web Analytics to track user engagement (e.g., calculator completions).
- **Error Tracking:** Integration ready for Sentry (if required later).

---

## 17. Deployment Architecture

- **Platform:** Vercel.
- **Database:** Supabase Postgres instances deployed in the exact same geographic region as the Vercel edge functions to minimize connection latency (e.g., `us-east-1`).
- **Edge Deployment:** Middleware runs on the Vercel Edge Network for global, sub-10ms auth checks before requests hit the serverless compute.

---

## 18. CI/CD Pipeline

- **Platform:** Vercel GitHub Integration.
- **Workflow:**
  1. Push to PR.
  2. GitHub Actions runs: `lint` (ESLint), `typecheck` (tsc), and `test` (Vitest).
  3. Vercel generates an immutable Preview Deployment.
  4. Playwright runs E2E tests against the Preview URL.
  5. Merge to `main`.
  6. Vercel deploys to Production. Database schema migrations (`prisma migrate deploy`) run automatically during Vercel's Build phase.

---

## 19. Environment Variables

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Auth (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# AI (Google Gemini)
GEMINI_API_KEY="..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 20. Folder Structure

```text
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth routes (login, register)
│   ├── (dashboard)/          # Dashboard layout & routes
│   ├── api/                  # Route handlers (AI, webhooks)
│   ├── layout.tsx
│   └── page.tsx
├── components/               # React Components
│   ├── ui/                   # shadcn/ui generic components
│   ├── calculator/           # Domain specific components
│   ├── charts/               # Recharts wrappers
│   └── chat/                 # AI chat components
├── lib/                      # Core Logic & Utilities
│   ├── ai/                   # Gemini configurations
│   ├── calculations/         # Pure carbon calculation logic
│   ├── prisma.ts             # Prisma singleton
│   ├── supabase/             # Supabase SSR clients
│   └── utils.ts              # Tailwind merge, formatting
├── schemas/                  # Zod validation schemas
├── server/                   # Backend Logic
│   └── actions/              # Next.js Server Actions
├── store/                    # Zustand stores
├── styles/                   # globals.css
└── types/                    # TypeScript interfaces
prisma/
└── schema.prisma             # DB Schema Definition
```

---

## 21. Database Entity Design

### Prisma Schema (`schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id            String    @id @default(uuid()) // Maps to Supabase auth.uid()
  email         String    @unique
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  footprints    Footprint[]
  achievements  UserAchievement[]
  plans         ReductionPlan[]
}

model Footprint {
  id              String   @id @default(uuid())
  userId          String
  totalCo2e       Float    // in kg
  
  // JSONB columns for flexible but structured category data
  transportation  Json
  energy          Json
  diet            Json
  shopping        Json
  waste           Json
  
  createdAt       DateTime @default(now())
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt(sort: Desc)])
}

model UserAchievement {
  id            String   @id @default(uuid())
  userId        String
  badgeId       String   // References an internal enum/config (e.g. "B-01")
  unlockedAt    DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeId])
}

model ReductionPlan {
  id              String   @id @default(uuid())
  userId          String
  targetReduction Float    // in kg
  status          String   // "ACTIVE", "COMPLETED", "ABANDONED"
  actions         Json     // List of generated actions and status
  createdAt       DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

> [!NOTE]
> Utilizing `Json` columns in Prisma/Postgres for the raw footprint inputs allows extreme flexibility during rapid hackathon iteration while still keeping the top-level metric (`totalCo2e`) strongly typed and easily queryable.

---

## 22. API Endpoint Specifications

Most mutations use Server Actions. Standard REST-like endpoints are minimal.

### Server Actions (RPCs)
- `saveFootprint(data: FootprintInputSchema) => Promise<Result<Footprint>>`
- `generateReductionPlan(footprintId: string, targetPct: number) => Promise<Result<ReductionPlan>>`
- `completePlanAction(planId: string, actionId: string) => Promise<Result<void>>`

### Route Handlers
**`POST /api/chat`**
- **Purpose:** Streams Gemini API responses for the Sustainability Coach.
- **Request Body:** `{ messages: [{ role: 'user', content: '...' }], footprintData: object }`
- **Response:** `text/event-stream` (Vercel AI SDK `StreamingTextResponse`)

---

## 23. Rate Limiting Strategy

- **Tooling:** Upstash Redis + `@upstash/ratelimit`.
- **Implementation:** Implemented within the Next.js `middleware.ts`.
- **Rules:**
  - AI Chat (`/api/chat`): 20 requests per hour per user ID.
  - Form Submissions: 10 requests per minute per IP.
- **Fallback:** Return standard `429 Too Many Requests` with `Retry-After` headers if no Redis is available during local dev to not block execution.

---

## 24. Caching Strategy

- **Static Assets:** Handled automatically by Next.js and Vercel CDN.
- **Calculations:** Client-side only; execution is fast enough to bypass caching.
- **Dashboard Data:** User history and achievements fetched via RSC with `next: { tags: ['footprints', userId] }`. Revalidated seamlessly inside the `saveFootprint` Server Action via `revalidateTag()`.

---

## 25. Scalability Considerations

- **Serverless PostgreSQL:** Utilizing PgBouncer connection pooling ensures the database isn't overwhelmed by Vercel serverless function cold starts.
- **Edge Delivery:** Next.js middleware running on the edge prevents unauthorized traffic from ever reaching the serverless compute logic or the database.
- **Stateless Architecture:** Completely stateless backend allows Vercel to infinitely scale horizontally during traffic spikes.

---

## 26. Production Readiness Checklist

- [ ] All `.env` variables correctly configured in Vercel.
- [ ] Supabase RLS policies successfully applied.
- [ ] Prisma database schema deployed and synced.
- [ ] No `console.log` leaking user PII.
- [ ] Lighthouse Accessibility score ≥ 95%.
- [ ] Lighthouse Performance score ≥ 90% (Mobile & Desktop).
- [ ] Playwright E2E tests passing in Vercel Preview.
- [ ] Google Gemini API key has hard billing limits applied (to prevent hackathon budget blowout).

---

## 27. Technical Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Vercel AI timeout (10s limit on free tier)** | Critical | Upgrade to Vercel Pro or use Edge Runtime for the `/api/chat` route to bypass 10s limits and support long streaming. |
| **Prisma Cold Start Latency** | Medium | Use `pgbouncer=true` in DB URL. Keep schemas optimized. |
| **Zod Schema Duplication** | Low | Export Zod schemas from `src/schemas/` to use in both `react-hook-form` and Server Actions to maintain a Single Source of Truth. |
| **Supabase Session Drift** | High | Use the official `@supabase/ssr` package which correctly syncs server cookies and client session state. |

---

## 28. Development Workflow

1. **Setup:**
   ```bash
   pnpm install
   cp .env.example .env.local
   npx prisma generate
   ```
2. **Database Iteration:**
   Modify `prisma/schema.prisma` -> run `npx prisma db push` (rapid schema prototyping without migration files during hackathon).
3. **Local Dev:**
   Run `pnpm dev`.
4. **UI Construction:**
   Use `npx shadcn@latest add [component]` to instantly scaffold accessible UI primitives.

---

> [!IMPORTANT]  
> This TRD is strictly aligned with the PRD and is optimized for the **Next.js 15 App Router + Server Actions + Supabase + Prisma** stack. An AI agent should treat this architecture as the definitive blueprint for code generation, ensuring an ultra-fast, secure, and easily maintainable hackathon execution.
