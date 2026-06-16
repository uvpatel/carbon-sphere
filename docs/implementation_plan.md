# CarbonSphere AI — Final Implementation Plan v3

**Date:** June 8, 2026
**Author:** Principal Engineering Director (Vercel, Stripe, Linear, Supabase, Anthropic)
**Objective:** The definitive, single-source-of-truth master development roadmap for CarbonSphere AI. Optimized for autonomous AI coding agent execution, production readiness, and top leaderboard placement.

---

> [!IMPORTANT]
> **Execution Approved Master Document**
> This is the fully merged Implementation Plan v3 encompassing all structural phases, enterprise enhancements, and hackathon judge optimizations. This document guides all execution tasks.

## Final Quality Targets

To ensure elite evaluation scores, the following metrics must be maintained throughout development:
- Lighthouse Performance: ≥ 95 (Bundle size budgets strictly enforced)
- Lighthouse Accessibility: ≥ 95 (WCAG 2.1 AA Compliance)
- Lighthouse Best Practices: ≥ 95
- Lighthouse SEO: ≥ 95 (PWA and Metadata optimized)
- Mozilla Observatory Security Grade: A (Strict CSP with nonces)
- TypeScript: Strict Mode enabled, zero `any` types allowed, Typed Routes enabled
- Test Coverage: ≥ 80% (Vitest + Playwright + Supabase RLS Testing)
- Security: Zero High-Severity Vulnerabilities (Arcjet, Supabase RLS, CSP Headers)

---

## Hackathon Judge Optimization Layer

To guarantee a first-place finish and a flawless evaluation score, this layer ensures zero friction for hackathon judges and massive multipliers for automated scanners.

### Judge Experience Enhancements
- **1-Click "Login as Demo User":** A prominent button on the landing page that authenticates judges instantly using a pre-seeded account filled with historical footprint data, unlocked achievements, and active reduction plans.
- **"Fill with Demo Data" Wizard Action:** A dev/demo toggle in the Carbon Calculator that instantly populates all 5 categories with realistic data to bypass manual entry fatigue.

### Demo Strategy
- **Video Walkthrough:** A 3-minute Loom demo focusing strictly on the "Wow" factor: The AI Planner generation, Simulator interactivity, and the real-time Calculator core loop.
- **Vercel Web Vitals Dashboard:** Exporting a 100/100 real-world user dashboard screenshot as a primary submission asset.

### Evaluation Score Enhancements
- **Absolute Type Safety:** Utilizing `typedRoutes: true` in `next.config.ts` ensures no broken links can exist in production, securing maximum Code Quality points.
- **Offline Resilience:** The PWA implementation specifically caches the calculator logic and emission factors via service workers, allowing offline footprint calculation.

### Submission Scoring Optimizations
- **Auto-generated API Docs:** Swagger/OpenAPI generated for Next.js API routes.
- **Security Artifacts:** A dedicated `tests/security/rls.test.ts` suite proving tenant data isolation.

---

## The 20-Phase Master Development Roadmap

### Phase 1: Project Setup Phase
- **Objectives:** Scaffold the Next.js 15 App Router project with build tools, linting, deterministic environment validation, and typed routing.
- **Deliverables:** A runnable Next.js template with TypeScript, Tailwind CSS, shadcn/ui, and T3 Env.
- **Dependencies:** None.
- **Files:** `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `eslint.config.mjs`, `components.json`, `env.mjs`.
- **Database requirements:** None.
- **API requirements:** None.
- **Frontend requirements:** Next.js 15, React 19, Tailwind CSS.
- **Backend requirements:** Node.js environment.
- **Acceptance criteria:** `npm run dev` starts successfully. Build fails locally if `.env` is missing keys. `typedRoutes: true` is configured and enforced in `next.config.ts`.
- **Risks:** Dependency version conflicts between Next.js 15 and shadcn/ui.
- **Mitigations:** Use `npx create-next-app@latest` and explicitly install compatible shadcn CLI versions.

### Phase 2: Design System Phase
- **Objectives:** Establish the visual foundation (Option C — Ultra Premium Startup).
- **Deliverables:** Core UI components, typography, color tokens, and layout shells.
- **Dependencies:** Phase 1.
- **Files:** `src/app/globals.css`, `src/lib/utils.ts`, `src/components/ui/*`.
- **Database requirements:** None.
- **API requirements:** None.
- **Frontend requirements:** shadcn/ui installation, custom CSS variables for dark/light mode.
- **Backend requirements:** None.
- **Acceptance criteria:** All base components render correctly in dark and light modes.
- **Risks:** Inconsistent styling or low contrast ratios.
- **Mitigations:** Strictly adhere to the UI/UX Brief color palette.

### Phase 3: Authentication Phase
- **Objectives:** Implement Supabase Auth (email/password & Google OAuth) with enterprise security and Judge Demo flow.
- **Deliverables:** Protected routes, login/register pages, auth state, Arcjet bot protection, and "Login as Demo User" button.
- **Dependencies:** Phase 2.
- **Files:** `src/app/(auth)/*`, `src/lib/supabase/*` (SSR clients), `src/middleware.ts`.
- **Database requirements:** Supabase project setup, `auth.users` enabled.
- **API requirements:** Supabase Auth API.
- **Frontend requirements:** Login forms with Zod validation. 1-click Demo Login button.
- **Backend requirements:** Next.js Middleware with Arcjet integration.
- **Acceptance criteria:** Users can register/login. Middleware blocks unauthenticated access to protected routes. Arcjet limits login attempts to 5/minute per IP. Clicking "Login as Demo User" instantly logs into a pre-seeded account.
- **Risks:** Session leakage or brute force attacks.
- **Mitigations:** Use `@supabase/ssr` package and Arcjet IP-based rate limiting on `/login` and `/register`.

### Phase 4: Database Phase
- **Objectives:** Implement DB Schema v2 via Prisma with RLS and connection pooling.
- **Deliverables:** `schema.prisma`, generated Prisma client, initial migration, RLS policies, and rich demo seed scripts.
- **Dependencies:** Phase 3.
- **Files:** `prisma/schema.prisma`, `prisma/migrations/*`, `prisma/seed.ts`, `src/lib/prisma.ts`.
- **Database requirements:** Supabase PostgreSQL with PgBouncer connection strings (`?pgbouncer=true`).
- **API requirements:** None.
- **Frontend requirements:** None.
- **Backend requirements:** Prisma ORM.
- **Acceptance criteria:** `npx prisma migrate dev` succeeds. RLS policies successfully restrict access. Seed script provisions a robust Demo User with historical footprint data, achievements, and plans.
- **Risks:** RLS policies blocking legitimate backend operations.
- **Mitigations:** Test RLS thoroughly via Supabase SQL editor using authenticated user roles.

### Phase 5: Core Infrastructure Phase
- **Objectives:** Build layouts, navigation, Zustand state, and advanced observability.
- **Deliverables:** Sidebar, top navigation, global user store, toaster, Sentry error tracking, and Axiom edge logging.
- **Dependencies:** Phase 2, Phase 4.
- **Files:** `src/app/(dashboard)/layout.tsx`, `src/components/layout/*`, `src/store/useUserStore.ts`, `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`.
- **Database requirements:** Fetch `users` and `user_settings`.
- **API requirements:** Server Actions for fetching user profile.
- **Frontend requirements:** Zustand, Lucide Icons, Sentry.
- **Backend requirements:** Server Actions, Axiom configured for Vercel logs.
- **Acceptance criteria:** User can navigate between placeholder pages. Sentry successfully captures a test error.
- **Risks:** Hydration mismatches.
- **Mitigations:** Use Next.js Server Components for layout data fetching and pass initial state to client components.

### Phase 6: Dashboard Phase
- **Objectives:** Build the central hub combining high-level metrics and charts.
- **Deliverables:** Total footprint display, category donut chart, trend line chart, recent achievements.
- **Dependencies:** Phase 5.
- **Files:** `src/app/(dashboard)/dashboard/page.tsx`, `src/components/dashboard/*`.
- **Database requirements:** Fetch `footprints`, `carbon_goals`, `user_achievements`.
- **API requirements:** Server Actions for dashboard aggregations.
- **Frontend requirements:** Recharts.
- **Backend requirements:** Efficient Prisma queries utilizing composite indexes.
- **Acceptance criteria:** Dashboard renders without errors using empty or mocked state.
- **Risks:** High bundle size from charting libraries.
- **Mitigations:** Lazy load Recharts components dynamically.

### Phase 7: Carbon Calculator Phase
- **Objectives:** Build the 5-category data entry wizard, calculation engine, and Demo Autofill.
- **Deliverables:** Multi-step form, real-time calculation logic, data persistence, "Fill with Demo Data" button.
- **Dependencies:** Phase 4.
- **Files:** `src/app/(dashboard)/calculator/page.tsx`, `src/lib/calculations/engine.ts`, `src/lib/calculations/factors.ts`, `src/schemas/calculator.ts`.
- **Database requirements:** Write to `footprints` and `activity_logs`.
- **API requirements:** Server Action to save footprint.
- **Frontend requirements:** Zod validation, React Hook Form wizard.
- **Backend requirements:** Prisma create logic.
- **Acceptance criteria:** User can complete all 5 steps, view calculated CO2e, and save result. Clicking "Fill with Demo Data" populates all wizard steps instantly.
- **Risks:** Complex state management across form steps.
- **Mitigations:** Use Zustand or React Hook Form context. Ensure calculation engine is a pure, testable function.

### Phase 8: AI Sustainability Coach Phase
- **Objectives:** Integrate Gemini API with cost observability and feature flags.
- **Deliverables:** Chat UI, message persistence, AI streaming Route Handler, Vercel Edge Config feature flags.
- **Dependencies:** Phase 7.
- **Files:** `src/app/(dashboard)/coach/page.tsx`, `src/components/chat/*`, `src/app/api/chat/route.ts`.
- **Database requirements:** Read `footprints`. Write to `ai_conversations`, `ai_messages`, `ai_usage_tracking`.
- **API requirements:** Google Gemini API, Next.js Route Handlers.
- **Frontend requirements:** Vercel AI SDK (`useChat`).
- **Backend requirements:** Edge Config to disable AI if budget exceeded. Log every completion token to Axiom/Sentry.
- **Acceptance criteria:** User receives context-aware streamed responses. Chat disables gracefully if Edge Config killswitch is flipped.
- **Risks:** API rate limits or excessive cost.
- **Mitigations:** Upstash Redis rate limiting and DB token tracking (`ai_usage_tracking`).

### Phase 9: Carbon Impact Simulator Phase
- **Objectives:** Build the stateful interactive "what-if" scenario engine.
- **Deliverables:** Simulator UI, before/after charts, state persistence.
- **Dependencies:** Phase 7.
- **Files:** `src/app/(dashboard)/simulator/page.tsx`, `src/components/simulator/*`, `src/lib/simulator/scenarios.ts`.
- **Database requirements:** Write to `simulation_runs`.
- **API requirements:** Server Action to save simulation.
- **Frontend requirements:** Toggles, Recharts comparison bars.
- **Backend requirements:** Re-use of `engine.ts` core functions.
- **Acceptance criteria:** User toggles scenarios to view projected footprint changes and can save the simulation.
- **Risks:** Logic diverging from core calculator.
- **Mitigations:** Strictly share the core `engine.ts` pure functions between calculator and simulator.

### Phase 10: Carbon Goals Phase
- **Objectives:** Allow users to set long-term decoupled reduction targets.
- **Deliverables:** Goal setting UI, progress visualization on dashboard.
- **Dependencies:** Phase 7.
- **Files:** `src/components/goals/*`, Server Actions for Goals.
- **Database requirements:** Read/Write `carbon_goals`.
- **API requirements:** Server Actions.
- **Frontend requirements:** Target percentage slider, deadline picker.
- **Backend requirements:** Baseline CO2e capture.
- **Acceptance criteria:** User can set a goal and see it reflected on the Dashboard.
- **Risks:** Unrealistic goal setting.
- **Mitigations:** UI guardrails and tooltips suggesting 10-30% realistic ranges.

### Phase 11: Reduction Planner Phase
- **Objectives:** Generate and track actionable reduction plans via AI.
- **Deliverables:** AI Plan Generator UI, Checklist UI, action status toggling.
- **Dependencies:** Phase 10.
- **Files:** `src/app/(dashboard)/planner/page.tsx`, `src/app/api/generate-plan/route.ts`.
- **Database requirements:** Write to `reduction_plans` and `plan_actions`.
- **API requirements:** Gemini API (Structured JSON output).
- **Frontend requirements:** Progress bars, checklist state.
- **Backend requirements:** AI SDK `generateObject` with strict Zod schema enforcement.
- **Acceptance criteria:** AI returns JSON array of tasks matching schema, tasks saved to DB, user can check off tasks.
- **Risks:** AI returning invalid JSON/hallucinations.
- **Mitigations:** `zod` schemas guarantee strict typing.

### Phase 12: Analytics Phase
- **Objectives:** Build historical data views, insights, and product analytics.
- **Deliverables:** Time-series charts, equivalency metrics, PostHog product analytics integration.
- **Dependencies:** Phase 7.
- **Files:** `src/app/(dashboard)/analytics/page.tsx`, `src/components/analytics/*`, `src/lib/posthog.ts`.
- **Database requirements:** Read `footprints`.
- **API requirements:** Server Actions for fetching aggregations.
- **Frontend requirements:** Date range pickers, advanced Recharts, PostHog Provider.
- **Backend requirements:** Efficient grouped queries.
- **Acceptance criteria:** Time-series charts render accurately. PostHog tracks funnel conversions (Calculator -> Plan).
- **Risks:** Slow queries at scale.
- **Mitigations:** Use composite indexes on `created_at`.

### Phase 13: Achievement System Phase
- **Objectives:** Implement the data-driven gamification and streak engine.
- **Deliverables:** Badges UI, toast notifications, SQL streak calculations.
- **Dependencies:** All previous phases.
- **Files:** `src/app/(dashboard)/achievements/page.tsx`, `src/lib/gamification/engine.ts`.
- **Database requirements:** Read `activity_logs`, Read/Write `user_achievements`.
- **API requirements:** Server Actions to evaluate achievements.
- **Frontend requirements:** Badge SVGs, Toast triggers.
- **Backend requirements:** SQL window functions for streak logic.
- **Acceptance criteria:** Completing an action evaluates achievements asynchronously, unlocking badges via toast.
- **Risks:** Evaluation slowing down primary mutations.
- **Mitigations:** Run achievement checks asynchronously.

### Phase 14: Settings Phase
- **Objectives:** Manage preferences and profile data.
- **Deliverables:** Settings page, theme toggles, unit system, notification preferences.
- **Dependencies:** Phase 3.
- **Files:** `src/app/(dashboard)/settings/page.tsx`.
- **Database requirements:** Read/Write `user_settings` and `notification_preferences`.
- **API requirements:** Server Actions.
- **Frontend requirements:** Form validation.
- **Backend requirements:** None.
- **Acceptance criteria:** Settings changes automatically trigger UI updates (e.g., metric vs imperial).
- **Risks:** Low risk.
- **Mitigations:** Standard form management practices.

### Phase 15: Accessibility Phase
- **Objectives:** Ensure WCAG 2.1 AA compliance with automated gating.
- **Deliverables:** ARIA labels, semantic HTML fixes, automated `@axe-core/playwright` CI integration.
- **Dependencies:** All UI phases.
- **Files:** Accessibility utility components (e.g., hidden tables for charts).
- **Database requirements:** None.
- **API requirements:** None.
- **Frontend requirements:** axe-core evaluation.
- **Backend requirements:** None.
- **Acceptance criteria:** Lighthouse Accessibility score ≥ 95. Full keyboard navigation. Playwright E2E tests include `await expect(page).toPassAxe()`. Fails PR if new violations introduced.
- **Risks:** Charts remaining inaccessible.
- **Mitigations:** Enforce the "sr-only table alongside every chart" rule.

### Phase 16: Security Hardening Phase
- **Objectives:** Finalize enterprise security layers to achieve Mozilla Observatory Grade A.
- **Deliverables:** Strict CSP headers with nonces, Arcjet bot protection globally, dependency auditing in CI.
- **Dependencies:** All features completed.
- **Files:** `next.config.ts` updates, `middleware.ts` updates.
- **Database requirements:** Write to `audit_events` for critical actions.
- **API requirements:** None.
- **Frontend requirements:** `next.config.ts` configured with strict CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
- **Backend requirements:** None.
- **Acceptance criteria:** Mozilla Observatory returns a Grade A. Arcjet blocks non-browser traffic globally. Zero high-severity vulnerabilities (`npm audit`).
- **Risks:** Strict CSP nonces breaking Next.js hydration or third-party scripts.
- **Mitigations:** Test CSP nonces thoroughly in Vercel preview environments before main merge.

### Phase 17: Testing Phase
- **Objectives:** Achieve ≥ 80% coverage with strict test gating and explicit Security validation.
- **Deliverables:** Unit tests (Vitest), integration tests (RTL), E2E tests (Playwright), and an RLS Security Test Suite.
- **Dependencies:** All code complete.
- **Files:** `vitest.config.ts`, `playwright.config.ts`, `__tests__/*`, `tests/security/rls.test.ts`.
- **Database requirements:** Supabase Local Emulator setup for testing.
- **API requirements:** Mocked APIs.
- **Frontend requirements:** React Testing Library.
- **Backend requirements:** Supabase client configured for RLS test assertions.
- **Acceptance criteria:** `npm run test` and `npm run test:e2e` pass. Vitest configured with `coverage.branches/functions/lines: 80`. Fails CI if unmet. `rls.test.ts` proves User A cannot read User B's footprints.
- **Risks:** Flaky E2E tests.
- **Mitigations:** Use Playwright's robust auto-waiting capabilities.

### Phase 18: Performance Optimization Phase
- **Objectives:** Achieve Lighthouse Performance score ≥ 95 with Vercel Speed Insights and bundle budgets.
- **Deliverables:** Minified bundles, optimized images, Vercel Speed Insights/Web Vitals Monitoring integration.
- **Dependencies:** Testing Phase.
- **Files:** `next.config.ts` (`next-bundle-analyzer`), `@vercel/speed-insights`.
- **Database requirements:** None.
- **API requirements:** None.
- **Frontend requirements:** Bundle analyzer integration, Speed Insights component injected.
- **Backend requirements:** Edge caching where applicable.
- **Acceptance criteria:** LCP < 2.5s. Build fails if `firstLoadJS` exceeds 200KB per chunk. Web Vitals streaming to Vercel dashboard.
- **Risks:** Late-stage architectural issues preventing speed.
- **Mitigations:** Next.js App Router streaming (`loading.tsx` and `Suspense`).

### Phase 19: Deployment Phase
- **Objectives:** Push to Vercel with Lighthouse CI (`@lhci/cli`), SEO readiness, and Offline Calculator Support (PWA).
- **Deliverables:** Live URL, PWA manifest with service worker caching for offline calculation, SEO sitemaps, OpenGraph images.
- **Dependencies:** All phases.
- **Files:** `.github/workflows/main.yml`, `next-sitemap.config.js`, `manifest.json`, `worker.js`.
- **Database requirements:** Production Supabase instance provisioned. Prisma `migrate deploy` executed pre-build.
- **API requirements:** Production Gemini API keys.
- **Frontend requirements:** `next-pwa` configured for offline calculator logic caching, `next-sitemap`, `@vercel/og`.
- **Backend requirements:** Sentry source maps upload on build.
- **Acceptance criteria:** Vercel deployment passes all CI gates. App installs as PWA and calculator functions completely offline.
- **Risks:** Service worker caching strategies causing stale UI states.
- **Mitigations:** Implement strict network-first caching for API routes and cache-first for static calculator engine logic.

### Phase 20: Submission Readiness Phase
- **Objectives:** Prepare project for top-tier hackathon evaluation.
- **Deliverables:** Polished `README.md`, 3-minute video demo, architecture diagrams.
- **Dependencies:** Phase 19.
- **Files:** `README.md`, `ARCHITECTURE.md`.
- **Database requirements:** Ensure Demo User account is correctly seeded in Production.
- **API requirements:** Generate Swagger/OpenAPI docs for Next.js endpoints.
- **Frontend requirements:** None.
- **Backend requirements:** None.
- **Acceptance criteria:** Repo contains all required documentation. OpenGraph images tested via social previewers. Video walkthrough produced.
- **Risks:** Missing evaluation criteria.
- **Mitigations:** Cross-reference final build against PRD Success Metrics.

---

## Strategic Implementation Lists

### 1. Folder Creation Order
1. `src/components/ui` (shadcn)
2. `src/lib/supabase` (Auth)
3. `prisma` (DB schema)
4. `src/app/(auth)`
5. `src/app/(dashboard)`
6. `src/lib/calculations`
7. `src/components/charts`
8. `src/app/api` (Route Handlers)

### 2. Database Migration Order
1. Core Profile (`User`, `UserSettings`, `NotificationPreference`)
2. Carbon Engine (`Footprint`, `SimulationRun`)
3. Gamification (`ActivityLog`, `AchievementDefinition`, `UserAchievement`)
4. Goals & Planning (`CarbonGoal`, `ReductionPlan`, `PlanAction`)
5. AI Observability (`AiConversation`, `AiMessage`, `AiUsageTracking`)
6. Security (`AuditEvent`)

### 3. API Creation Order
1. Auth Callback Route (`src/app/auth/callback/route.ts`)
2. Footprint Server Actions
3. AI Coach Streaming API (`src/app/api/chat/route.ts`)
4. AI Plan Generator API (`src/app/api/generate-plan/route.ts`)
5. Gamification Evaluation Server Actions

### 4. Component Creation Order
1. Base UI (Button, Input, Card, Form)
2. Layout (Sidebar, Header, Shell)
3. Calculator Form Wizard
4. Recharts Wrappers (Donut, Line, Bar - with sr-only tables)
5. Chat Interface (Message Bubble, Input)
6. Goal/Plan Checklists
7. Badge/Achievement Cards

### 5. Page Creation Order
1. Layouts (`layout.tsx`)
2. Auth (`login/page.tsx`, `register/page.tsx`)
3. Dashboard (`dashboard/page.tsx`)
4. Calculator (`calculator/page.tsx`)
5. Coach (`coach/page.tsx`)
6. Simulator, Planner, Analytics, Achievements
7. Settings

### 6. Testing Order
1. Pure functions (`calculateFootprint`, `calculateStreaks`)
2. Prisma Server Actions
3. API Route Handlers (Mocked Gemini)
4. Complex UI Components (Calculator Wizard)
5. RLS Test Suite (`rls.test.ts`)
6. Playwright E2E User Journey (Auth -> Calculate -> Plan -> Axe A11y Check)

### 7. CI/CD Pipeline Configuration
- **Push to Branch:** Triggers Lint (`eslint`), Typecheck (`tsc`), Unit Tests (`vitest`).
- **PR to Main:** Triggers Vercel Preview Build -> Executes Playwright E2E -> Executes Lighthouse CI against Preview URL -> Fails if Axe, Coverage, or LHCI gates unmet.
- **Merge to Main:** Triggers Vercel Production Build (includes Prisma `migrate deploy` and Sentry sourcemaps).

### 8. Security Checklist
- [ ] T3 Env validation active (`env.mjs`).
- [ ] Arcjet configured in middleware (rate limits + bot protection).
- [ ] Supabase RLS policies enforced and passing `rls.test.ts`.
- [ ] Strict CSP nonces, HSTS, X-Frame-Options headers yielding Mozilla Grade A.
- [ ] Audit events logged for critical deletions.
- [ ] Dependency Audit (`npm audit`) passing cleanly.

### 9. Accessibility Checklist
- [ ] Axe-core integrated into Playwright.
- [ ] `sr-only` data tables alongside all Recharts.
- [ ] Full keyboard navigability (no traps).
- [ ] WCAG AA color contrast verified via CI.
- [ ] ARIA Live regions used for Toast notifications.

### 10. Performance Checklist
- [ ] Next.js Bundle Analyzer active in CI (budget <200kb JS).
- [ ] Vercel Speed Insights streaming Web Vitals metrics.
- [ ] Images optimized via `next/image`.
- [ ] Recharts and heavy UI components dynamically imported.
- [ ] Database composite indexes utilized.
- [ ] Server components used for heavy data fetching.

### 11. Deployment Checklist
- [ ] Vercel Project linked to GitHub repo.
- [ ] Supabase Production environment provisioned.
- [ ] Vercel Environment Variables set (Supabase, Gemini, Arcjet, Sentry, Axiom).
- [ ] Vercel Edge Config provisioned and linked.
- [ ] Lighthouse scores verified on production URL.
- [ ] Offline PWA calculation confirmed working.

### 12. Submission Checklist
- [ ] Demo User 1-click login verified on production.
- [ ] Calculator "Fill with Demo Data" verified.
- [ ] `README.md` complete (Tech Stack, Local Setup).
- [ ] `ARCHITECTURE.md` complete (including OpenAPI Swagger).
- [ ] Social sharing OpenGraph images generated.
- [ ] 3-minute Loom Demo video recorded.
- [ ] Hackathon platform submission complete.
