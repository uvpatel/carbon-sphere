# CarbonSphere AI — UI/UX Design Brief

**Version:** 1.0
**Date:** June 8, 2026
**Author:** Principal Product Designer
**Status:** Draft — Ready for Implementation
**Tagline:** *"Track Smarter. Live Greener."*

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Brand Personality](#2-brand-personality)
3. [Visual Identity](#3-visual-identity)
4. [Design Principles](#4-design-principles)
5. [User Experience Goals](#5-user-experience-goals)
6. [Color System](#6-color-system)
7. [Typography System](#7-typography-system)
8. [Spacing System](#8-spacing-system)
9. [Grid System](#9-grid-system)
10. [Border Radius System](#10-border-radius-system)
11. [Elevation System](#11-elevation-system)
12. [Iconography System](#12-iconography-system)
13. [Component Library](#13-component-library)
14. [Navigation Design](#14-navigation-design)
15. [Dashboard Design](#15-dashboard-design)
16. [Calculator Design](#16-calculator-design)
17. [AI Coach Design](#17-ai-coach-design)
18. [Simulator Design](#18-simulator-design)
19. [Planner Design](#19-planner-design)
20. [Analytics Design](#20-analytics-design)
21. [Achievement Design](#21-achievement-design)
22. [Authentication Screens](#22-authentication-screens)
23. [Landing Page Design](#23-landing-page-design)
24. [Mobile Design Strategy](#24-mobile-design-strategy)
25. [Responsive Design Rules](#25-responsive-design-rules)
26. [Dark Mode Strategy](#26-dark-mode-strategy)
27. [Light Mode Strategy](#27-light-mode-strategy)
28. [Accessibility Guidelines](#28-accessibility-guidelines)
29. [Animation Guidelines](#29-animation-guidelines)
30. [Micro-Interactions](#30-micro-interactions)
31. [Empty State Design](#31-empty-state-design)
32. [Error State Design](#32-error-state-design)
33. [Loading State Design](#33-loading-state-design)
34. [Data Visualization Design](#34-data-visualization-design)
35. [Premium SaaS Patterns](#35-premium-saas-patterns)
36. [Judge-Wow Features](#36-judge-wow-features)
37. [Design Tokens](#37-design-tokens)
38. [Tailwind Mapping](#38-tailwind-mapping)
39. [shadcn/ui Component Usage](#39-shadcnui-component-usage)
40. [Final Visual Direction](#40-final-visual-direction)

---

## 1. Design Philosophy

### Core Philosophy: Engineered Elegance

CarbonSphere AI follows the design philosophy of **Engineered Elegance** — the belief that sustainability software deserves the same visual refinement as the best-funded SaaS products on the market. Every pixel earns its place. Every element breathes. The interface communicates trust, intelligence, and effortlessness.

> The best design is the one the user doesn't notice — they just feel smart using it.

### Guiding References

| Reference Product | What We Borrow |
|---|---|
| **Linear** | Information density without clutter. Monochromatic surfaces. Keyboard-first feel. Ultra-clean sidebar navigation. |
| **Stripe** | Data visualization mastery. Typographic hierarchy as UI. Developer-grade precision. Muted but sophisticated color palette. |
| **Arc Browser** | Spatial awareness. Playful but controlled micro-animations. Premium dark surfaces. |
| **Notion** | Generous whitespace. Content-first layouts. Elegant empty states. |
| **Vercel** | Futuristic minimalism. Dark-first aesthetic. Subtle gradients as accent, not decoration. |

### Anti-Patterns (What We Reject)

- ❌ Generic green-heavy eco branding (no "#00FF00 green everywhere")
- ❌ Cartoon leaf/tree illustrations
- ❌ Overly rounded, bubbly cards
- ❌ Material Design 2 floating action buttons
- ❌ Rainbow gradient backgrounds
- ❌ Cluttered dashboards with 20+ widgets
- ❌ Cheap stock photography
- ❌ Generic hackathon templates

---

## 2. Brand Personality

### Brand Attributes

| Attribute | Not This | This |
|---|---|---|
| **Tone** | Preachy environmentalism | Calm, confident intelligence |
| **Visual** | Eco-warrior green | Sophisticated neutral with emerald accents |
| **Voice** | "You MUST reduce your footprint!" | "Here's how your choices add up." |
| **Feeling** | Guilt-driven | Empowerment-driven |
| **Aesthetic** | Nature-inspired | Technology-inspired |
| **Complexity** | Dashboard overload | Progressive disclosure |

### Brand Adjectives

1. **Intelligent** — The product feels smarter than you expect.
2. **Precise** — Every number, chart, and metric is presented with clarity.
3. **Trustworthy** — The UI earns confidence through consistency and quality.
4. **Premium** — Every interaction feels polished and intentional.
5. **Effortless** — Complex calculations feel like simple conversations.

---

## 3. Visual Identity

### Logo

- **Wordmark:** "CarbonSphere" in Inter (600 weight) + "AI" in Inter (300 weight, emerald accent).
- **Icon:** Abstract sphere composed of thin concentric circular arcs — not a literal globe. Geometric, not organic.
- **Mark color:** Emerald (#10B981) on dark, muted emerald on light.
- **Sizing:** Sidebar: 24px height. Landing page: 32px height.

### Visual Language Summary

```
Surface:     Layered, translucent panels on deep backgrounds
Typography:  Large, confident, with extreme hierarchy contrast
Color:       Monochromatic base + single emerald accent
Layout:      Generous whitespace, mathematical precision
Imagery:     Zero photography. Zero illustrations. Data IS the visual.
Motion:      Subtle, physics-based, purposeful
```

---

## 4. Design Principles

| # | Principle | Implementation |
|---|---|---|
| 1 | **Density without clutter** | Present useful information at a glance, but with generous padding between elements. Like Linear. |
| 2 | **Typography IS the UI** | Use font size, weight, and color (not boxes and borders) to create visual hierarchy. Like Stripe. |
| 3 | **Surfaces, not boxes** | Use subtle background color differences and translucency, not heavy borders, to define areas. |
| 4 | **Single accent color** | Emerald is used only for: primary CTAs, active states, progress indicators, and positive deltas. Everything else is neutral. |
| 5 | **Progressive disclosure** | Show summary first. Let users drill into detail. Never dump everything at once. |
| 6 | **Motion with purpose** | Every animation communicates state change. No animation for decoration. |
| 7 | **Mobile is not an afterthought** | Every layout designed mobile-first, then expanded for desktop. |

---

## 5. User Experience Goals

| Goal | Metric | Target |
|---|---|---|
| First Impression | Time to "wow" moment | < 3 seconds |
| Onboarding Completion | % of new users finishing first calculation | > 80% |
| Cognitive Load | Visible actions per screen | ≤ 5 primary actions |
| Navigation Efficiency | Clicks to any feature from Dashboard | ≤ 2 |
| Accessibility | Screen reader task completion | 100% for all critical flows |
| Performance Perception | Skeleton → content transition | < 1 second perceived |

---

## 6. Color System

### Design Philosophy: Monochromatic + Single Accent

The color system is built on **neutral grays** with **emerald** as the sole accent color. This creates a sophisticated, tool-like aesthetic that avoids generic eco-branding while still nodding to sustainability.

### Dark Mode Palette (Primary)

| Token | HSL | Hex | Tailwind | Usage |
|---|---|---|---|---|
| `--background` | `240 10% 3.9%` | `#09090B` | `bg-background` | Page background |
| `--card` | `240 10% 5.5%` | `#0D0D11` | `bg-card` | Card surfaces |
| `--card-hover` | `240 10% 7%` | `#111116` | — | Card hover state |
| `--popover` | `240 10% 5.5%` | `#0D0D11` | `bg-popover` | Dropdown, tooltip |
| `--muted` | `240 5% 12%` | `#1C1C20` | `bg-muted` | Secondary surfaces, badges |
| `--border` | `240 5% 14%` | `#222228` | `border-border` | Borders, dividers |
| `--border-subtle` | `240 5% 10%` | `#18181C` | — | Very subtle separators |
| `--ring` | `160 84% 39%` | `#10B981` | `ring-ring` | Focus rings |
| `--foreground` | `0 0% 98%` | `#FAFAFA` | `text-foreground` | Primary text |
| `--foreground-secondary` | `240 5% 65%` | `#A1A1AA` | `text-muted-foreground` | Secondary text |
| `--foreground-tertiary` | `240 5% 40%` | `#606068` | — | Tertiary text, placeholders |
| `--primary` | `160 84% 39%` | `#10B981` | `bg-primary` | Primary buttons, active states |
| `--primary-hover` | `160 84% 34%` | `#0D9668` | — | Primary button hover |
| `--primary-foreground` | `0 0% 2%` | `#050505` | `text-primary-foreground` | Text on primary |
| `--destructive` | `0 84% 60%` | `#EF4444` | `bg-destructive` | Errors, deletions |
| `--destructive-foreground` | `0 0% 98%` | `#FAFAFA` | `text-destructive-foreground` | Text on destructive |
| `--accent` | `240 5% 12%` | `#1C1C20` | `bg-accent` | Hover backgrounds |
| `--accent-foreground` | `0 0% 98%` | `#FAFAFA` | `text-accent-foreground` | Text on accent |
| `--success` | `160 84% 39%` | `#10B981` | — | Positive changes, savings |
| `--warning` | `43 96% 56%` | `#F59E0B` | — | Warnings, attention |
| `--info` | `217 91% 60%` | `#3B82F6` | — | Informational |

### Light Mode Palette

| Token | HSL | Hex | Usage |
|---|---|---|---|
| `--background` | `0 0% 100%` | `#FFFFFF` | Page background |
| `--card` | `0 0% 99%` | `#FCFCFC` | Card surfaces |
| `--muted` | `240 5% 96%` | `#F4F4F5` | Secondary surfaces |
| `--border` | `240 6% 90%` | `#E4E4E7` | Borders |
| `--foreground` | `240 10% 3.9%` | `#09090B` | Primary text |
| `--foreground-secondary` | `240 4% 46%` | `#71717A` | Secondary text |
| `--primary` | `160 84% 39%` | `#10B981` | Accent, CTAs |
| `--primary-hover` | `160 84% 34%` | `#0D9668` | Hover |

### Semantic Color Usage Rules

| Color | When to Use | When NOT to Use |
|---|---|---|
| **Emerald (Primary)** | Primary CTA buttons, active nav items, positive deltas (↓ emissions), progress bars, focus rings, links | Backgrounds, borders, large surface areas, body text |
| **Red (Destructive)** | Negative deltas (↑ emissions), errors, delete actions | Warnings (use yellow), decorative |
| **Blue (Info)** | Informational badges, AI-related accents, "average" comparison bars | CTA buttons, progress bars |
| **Yellow (Warning)** | Warnings, "moderate" states | Errors (use red) |
| **Gray scale** | Everything else — backgrounds, text, borders, cards, surfaces | — |

### Chart Colors (Ordered)

For multi-series charts (category breakdowns), use these muted, high-contrast colors:

| Series | Color | Hex | Category |
|---|---|---|---|
| 1 | Emerald | `#10B981` | Transportation |
| 2 | Blue | `#3B82F6` | Energy |
| 3 | Amber | `#F59E0B` | Diet |
| 4 | Violet | `#8B5CF6` | Shopping |
| 5 | Rose | `#F43F5E` | Waste |

---

## 7. Typography System

### Font Family

| Usage | Font | Source | Fallback |
|---|---|---|---|
| **Primary (UI)** | Inter | `next/font/google` | `system-ui, -apple-system, sans-serif` |
| **Monospace (Data)** | JetBrains Mono | `next/font/google` | `ui-monospace, monospace` |

> [!IMPORTANT]
> Use `next/font` to load fonts. This ensures zero layout shift and optimal loading. Do NOT use `<link>` tags or `@import`.

### Type Scale

| Token | Size | Line Height | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| `display` | 48px / 3rem | 1.1 | 700 | -0.025em | Landing hero headline |
| `h1` | 30px / 1.875rem | 1.2 | 600 | -0.025em | Page titles ("Your Carbon Dashboard") |
| `h2` | 24px / 1.5rem | 1.3 | 600 | -0.02em | Section headers |
| `h3` | 20px / 1.25rem | 1.4 | 600 | -0.015em | Card titles |
| `h4` | 16px / 1rem | 1.4 | 600 | 0 | Sub-section titles |
| `body` | 14px / 0.875rem | 1.6 | 400 | 0 | Body text, descriptions |
| `body-sm` | 13px / 0.8125rem | 1.5 | 400 | 0 | Secondary text, helper text |
| `caption` | 12px / 0.75rem | 1.5 | 400 | 0.01em | Labels, timestamps, badges |
| `overline` | 11px / 0.6875rem | 1.5 | 500 | 0.05em | Category labels, uppercase labels |
| `metric` | 36px / 2.25rem | 1.1 | 700 | -0.02em | Dashboard metric numbers |
| `metric-sm` | 24px / 1.5rem | 1.2 | 700 | -0.02em | Card metric numbers |
| `mono` | 13px / 0.8125rem | 1.5 | 400 | 0 | Data values, percentages |

### Typography Rules

1. **Page titles (`h1`):** Left-aligned, no colon, no period. "Your Carbon Dashboard", not "Dashboard:".
2. **Subtitles:** `body` size, `foreground-secondary` color. Below `h1` with 4px gap.
3. **Metric numbers:** Use `metric` style with `font-variant-numeric: tabular-nums` for aligned columns.
4. **Labels:** Use `overline` style in `uppercase` with `tracking-widest` for category labels.
5. **No underlines on links** — use color (`primary`) and hover opacity change.
6. **Negative tracking** on headings creates the premium, "tight" feeling (like Linear/Stripe).

---

## 8. Spacing System

### Base Unit: 4px

All spacing derives from a 4px base grid. Use Tailwind spacing utilities.

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `space-0.5` | 2px | `p-0.5` | Micro gap (icon to text inside badge) |
| `space-1` | 4px | `p-1` | Tight internal padding |
| `space-2` | 8px | `p-2` | Icon gaps, inline spacing |
| `space-3` | 12px | `p-3` | Small card padding, chip padding |
| `space-4` | 16px | `p-4` | Default card internal padding (mobile) |
| `space-5` | 20px | `p-5` | — |
| `space-6` | 24px | `p-6` | Default card internal padding (desktop), section gaps |
| `space-8` | 32px | `p-8` | Section spacing, large card padding |
| `space-10` | 40px | `p-10` | Page margin (desktop) |
| `space-12` | 48px | `p-12` | Hero section padding |
| `space-16` | 64px | `p-16` | Large section breaks |
| `space-20` | 80px | `p-20` | Landing page section spacing |
| `space-24` | 96px | `p-24` | Hero top/bottom padding |

### Spacing Rules

1. **Card internal padding:** `p-4` mobile, `p-6` desktop.
2. **Gap between cards:** `gap-4` mobile, `gap-6` desktop.
3. **Page horizontal padding:** `px-4` mobile, `px-6` tablet, `px-8` desktop (inside main content area).
4. **Page top padding:** `pt-6` (after header).
5. **Between page title and first content:** `mb-6`.
6. **Between sections:** `mt-8` to `mt-12`.
7. **Text block line spacing:** Handled by line-height in type scale.

---

## 9. Grid System

### Desktop Layout (≥ 1024px)

```
┌──────┬──────────────────────────────────────────────────┐
│      │                                                  │
│ Side │              Main Content Area                   │
│ bar  │                                                  │
│      │    ┌────────┬────────┬────────┐                  │
│ 256px│    │  1/3   │  1/3   │  1/3   │  ← 3-col grid   │
│  or  │    ├────────┴────────┴────────┤                  │
│ 64px │    │         Full Width       │  ← Charts        │
│      │    ├────────┬─────────────────┤                  │
│      │    │  1/3   │      2/3        │  ← Mixed         │
│      │    └────────┴─────────────────┘                  │
│      │              max-w: 1280px                       │
└──────┴──────────────────────────────────────────────────┘
```

### Grid Specifications

| Breakpoint | Container | Columns | Gap | Sidebar |
|---|---|---|---|---|
| Mobile (< 768px) | Full width | 1 | 16px | Hidden (bottom nav) |
| Tablet (768–1023px) | Full width | 2 | 20px | Hidden (bottom nav) |
| Desktop (≥ 1024px) | Max 1280px | 3 or 12-col | 24px | 256px (expanded) |
| Desktop (≥ 1024px, collapsed) | Max 1280px | 3 or 12-col | 24px | 64px (icons only) |

### Dashboard Grid Layout

| Row | Desktop Layout | Mobile Layout |
|---|---|---|
| Row 1 | 3 stat cards (equal 1/3 each) | Stack vertically |
| Row 2 | Donut chart (1/3) + Quick Actions (1/3) + Streak (1/3) | Stack vertically, chart full width |
| Row 3 | Trend line chart (full width) | Full width |
| Row 4 | Equivalencies (3 equal cards) | Horizontal scroll or stack |
| Row 5 | Recent achievements (1/2) + Plan status (1/2) | Stack vertically |

---

## 10. Border Radius System

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `radius-sm` | 6px | `rounded-md` | Buttons, inputs, badges |
| `radius-md` | 8px | `rounded-lg` | Cards, modals |
| `radius-lg` | 12px | `rounded-xl` | Large cards, containers |
| `radius-xl` | 16px | `rounded-2xl` | Landing page hero cards |
| `radius-full` | 9999px | `rounded-full` | Avatars, circular badges, pills |

### Radius Rules

1. **Cards:** `rounded-lg` (8px). NOT fully rounded. This is NOT a children's app.
2. **Buttons:** `rounded-md` (6px). Consistent across all button sizes.
3. **Inputs:** `rounded-md` (6px). Must match buttons when adjacent.
4. **Avatars:** `rounded-full`.
5. **Progress bars:** `rounded-full` (pill shape).
6. **Modals:** `rounded-xl` (12px).
7. **Charts container:** `rounded-lg` (matching card).
8. **Badges/chips:** `rounded-md` (6px) for status badges, `rounded-full` for pills.

---

## 11. Elevation System

### Philosophy: Subtle Layering, Not Drop Shadows

Elevation is communicated through **background color differences** and **very subtle borders**, not heavy box-shadows. This is the Linear/Vercel approach.

| Level | Background (Dark) | Border | Box Shadow | Usage |
|---|---|---|---|---|
| Level 0 (Page) | `--background` (#09090B) | None | None | Page canvas |
| Level 1 (Card) | `--card` (#0D0D11) | 1px `--border` | None | Cards, sidebar |
| Level 2 (Raised) | `--muted` (#1C1C20) | 1px `--border` | None | Hovered cards, active surfaces |
| Level 3 (Popover) | `--popover` (#0D0D11) | 1px `--border` | `0 4px 12px rgba(0,0,0,0.3)` | Dropdowns, tooltips, command palette |
| Level 4 (Modal) | `--card` (#0D0D11) | 1px `--border` | `0 8px 30px rgba(0,0,0,0.5)` | Modals, dialogs |
| Backdrop | — | — | `bg-black/50 backdrop-blur-sm` | Behind modals |

### Shadow Rule

> Shadows in dark mode should use `rgba(0, 0, 0, 0.3–0.5)`. Never use colored shadows. Only Level 3 and Level 4 use shadows at all.

---

## 12. Iconography System

### Library: Lucide React

- **Source:** `lucide-react`
- **Style:** Outline (1.5px stroke width), consistent with shadcn/ui defaults.
- **Size:** 16px for inline, 20px for navigation, 24px for empty states, 32px for feature cards.
- **Color:** `currentColor` (inherits text color).

### Icon Usage Map

| Context | Icon Name | Size |
|---|---|---|
| Sidebar — Dashboard | `LayoutDashboard` | 20px |
| Sidebar — Calculator | `Calculator` | 20px |
| Sidebar — AI Coach | `Bot` | 20px |
| Sidebar — Simulator | `FlaskConical` | 20px |
| Sidebar — Planner | `ListChecks` | 20px |
| Sidebar — Analytics | `TrendingDown` | 20px |
| Sidebar — Achievements | `Trophy` | 20px |
| Sidebar — Settings | `Settings` | 20px |
| Category — Transportation | `Car` | 16px |
| Category — Energy | `Zap` | 16px |
| Category — Diet | `Utensils` | 16px |
| Category — Shopping | `ShoppingBag` | 16px |
| Category — Waste | `Trash2` | 16px |
| Trend Up (bad) | `TrendingUp` | 16px |
| Trend Down (good) | `TrendingDown` | 16px |
| Streak | `Flame` | 16px |
| Goal | `Target` | 16px |
| Close | `X` | 16px |
| Menu | `Menu` | 20px |
| Chevron | `ChevronRight` | 16px |
| Info | `Info` | 16px |
| Warning | `AlertTriangle` | 16px |
| Error | `AlertCircle` | 16px |
| Check | `Check` | 16px |
| Search | `Search` | 16px |
| Send (chat) | `Send` | 16px |
| Theme toggle | `Sun` / `Moon` | 16px |
| Sign out | `LogOut` | 16px |

### Icon Rules

1. **Never use filled icons.** All icons are outline/stroke style.
2. **Never use emoji as primary UI icons** (emoji used only in achievement badges and equivalency callouts where they serve as content, not chrome).
3. **All icons must have `aria-hidden="true"`** when paired with visible text labels.
4. **Icon-only buttons must have `aria-label`.**

---

## 13. Component Library

### Built on shadcn/ui — Customization Layer

All components extend shadcn/ui defaults with CarbonSphere AI's design tokens. Below are the key customization specifications.

### Button Variants

| Variant | Background | Text | Border | Hover | Usage |
|---|---|---|---|---|---|
| `default` (Primary) | `bg-primary` (emerald) | `text-primary-foreground` (dark) | None | Darken 10% | Primary CTAs ("Calculate", "Save") |
| `secondary` | `bg-muted` | `text-foreground` | None | Lighten bg 5% | Secondary actions ("Reset", "View All") |
| `outline` | Transparent | `text-foreground` | 1px `border` | `bg-accent` | Tertiary actions |
| `ghost` | Transparent | `text-foreground-secondary` | None | `bg-accent` | Nav items, subtle actions |
| `destructive` | `bg-destructive` | `text-destructive-foreground` | None | Darken 10% | Delete, remove |
| `link` | Transparent | `text-primary` | None | Underline | Inline links |

### Button Sizes

| Size | Height | Padding X | Font Size | Icon Size |
|---|---|---|---|---|
| `sm` | 32px | 12px | 13px | 14px |
| `default` | 36px | 16px | 14px | 16px |
| `lg` | 40px | 24px | 14px | 16px |
| `icon` | 36px × 36px | 0 | — | 16px |

### Card Component

```
┌──────────────────────────────────┐ ← rounded-lg, border, bg-card
│  Card Header                     │ ← p-6 pb-2
│  ┌──────────────────────────────┐│
│  │ Title          Badge/Action  ││ ← flex justify-between items-center
│  │ Description (optional)       ││ ← text-muted-foreground, body-sm
│  └──────────────────────────────┘│
│  Card Content                    │ ← p-6 pt-0
│  ┌──────────────────────────────┐│
│  │ ... main content ...         ││
│  └──────────────────────────────┘│
│  Card Footer (optional)         │ ← p-6 pt-0
│  ┌──────────────────────────────┐│
│  │ Actions or links             ││
│  └──────────────────────────────┘│
└──────────────────────────────────┘
```

### Input Component

| Property | Value |
|---|---|
| Height | 36px |
| Background | `bg-background` (dark: #09090B) |
| Border | 1px `border` (#222228) |
| Border radius | `rounded-md` |
| Font size | 14px |
| Padding | `px-3` |
| Focus | `ring-2 ring-ring ring-offset-2 ring-offset-background` (emerald focus ring) |
| Placeholder color | `text-foreground-tertiary` |
| Error state | `border-destructive`, `text-destructive` error message below |

### Badge Component

| Variant | Background | Text | Usage |
|---|---|---|---|
| `default` | `bg-primary/10` | `text-primary` | Category tags, positive states |
| `secondary` | `bg-muted` | `text-muted-foreground` | Neutral labels |
| `destructive` | `bg-destructive/10` | `text-destructive` | Negative deltas, errors |
| `outline` | Transparent | `text-muted-foreground` | Subtle tags |

Badges use `rounded-md`, `text-xs`, `font-medium`, `px-2 py-0.5`.

### Toast Component

| Property | Value |
|---|---|
| Position | Bottom-right (desktop), Top-center (mobile) |
| Background | `bg-card` with `border` |
| Width | Max 360px |
| Border radius | `rounded-lg` |
| Shadow | Level 3 shadow |
| Success icon | `Check` in emerald circle |
| Error icon | `AlertCircle` in red circle |
| Duration | 4 seconds default |

---

## 14. Navigation Design

### Desktop Sidebar

```
┌────────────────────┐
│                    │
│  ◉ CarbonSphere AI │ ← Logo + wordmark, h: 64px
│                    │
├────────────────────┤ ← 1px border-b
│                    │
│  ▸ Dashboard       │ ← Nav items, 36px height each
│    Calculator      │    8px vertical gap between items
│    AI Coach        │    Active: bg-accent + text-foreground
│    Simulator       │           + left-2 border-primary
│    Planner         │    Inactive: text-muted-foreground
│    Analytics       │    Hover: bg-accent
│    Achievements    │
│                    │
├────────────────────┤ ← 1px border-b, pushed to bottom
│                    │
│  ⚙ Settings       │ ← Bottom section
│                    │
├────────────────────┤
│                    │
│  ◯ Het Patel       │ ← Avatar (32px) + Name
│    het@email.com   │    text-muted-foreground, caption size
│                    │
└────────────────────┘
```

**Specifications:**
- Width: `256px` expanded, `64px` collapsed
- Background: `bg-card` with `border-r`
- Nav item padding: `px-3 py-2`
- Active indicator: `border-l-2 border-primary` + `bg-accent`
- Icon-label gap: `gap-3`
- Collapse toggle: Hamburger icon at top, `transition-all duration-200`

### Collapsed State

- Only icons visible (centered, 20px)
- Tooltip on hover showing label
- Logo shows icon only

### Mobile Bottom Navigation

```
┌──────┬──────┬──────┬──────┬──────┐
│  📊  │  🔢  │  🤖  │  🔬  │  ☰  │ ← 64px height
│ Dash │ Calc │Coach │ Sim  │ More │    safe area below
└──────┴──────┴──────┴──────┴──────┘
```

- Background: `bg-card` with `border-t`
- Active: `text-primary` (emerald icon + label)
- Inactive: `text-muted-foreground`
- Icon: 20px, Label: 10px, gap: 2px
- "More" opens bottom sheet (shadcn `Sheet`) with remaining items

---

## 15. Dashboard Design

### Visual Reference: Linear's Dashboard

### Layout Structure

```
Page Title Row:
┌──────────────────────────────────────────────────────────┐
│ Your Carbon Dashboard                    [Date Filter ▼] │
└──────────────────────────────────────────────────────────┘

Stats Row (3 cards):
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ ANNUAL FOOTPRINT │ │ GOAL PROGRESS    │ │ STREAK           │
│                  │ │                  │ │                  │
│ 4,250            │ │ ████████░░ 65%   │ │ 🔥 7 days        │
│ kg CO₂e/year     │ │ Target: 3,400 kg │ │ Best: 14 days    │
│ ↓ 12% vs last   │ │ 850 kg to go     │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘

Chart Row (2/3 + 1/3):
┌────────────────────────────────┐ ┌────────────────────────┐
│ Category Breakdown             │ │ Quick Actions           │
│                                │ │                         │
│    ┌─────────┐                 │ │ [Recalculate         →] │
│    │  Donut  │  Legend:        │ │ [Chat with AI Coach  →] │
│    │  Chart  │  ■ Transport 42%│ │ [Run Simulation      →] │
│    └─────────┘  ■ Energy   28% │ │ [Create Plan         →] │
│                 ■ Diet     18% │ │                         │
│                 ■ Shopping  7% │ │                         │
│                 ■ Waste     5% │ │                         │
└────────────────────────────────┘ └────────────────────────┘

Trend Chart (full width):
┌────────────────────────────────────────────────────────────┐
│ Footprint Over Time                                        │
│                                                            │
│  5000 ┤                                                    │
│  4500 ┤     ·──·                                           │
│  4000 ┤          ╲                                          │
│  3500 ┤            ╲──·──·                                  │
│  3000 ┤ ─ ─ ─ ─ ─ ─ ─ ─ ─ Global Average ─ ─ ─ ─ ─ ─ ─  │
│       └──────────────────────────────────────────────────  │
│        Jan   Feb   Mar   Apr   May   Jun                   │
└────────────────────────────────────────────────────────────┘

Bottom Row (3 + 2):
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 🌳 12 Trees  │ │ 🚗 4,200 km  │ │ ⛽ 380 gal   │
│   planted    │ │  not driven  │ │   saved      │
└──────────────┘ └──────────────┘ └──────────────┘
┌─────────────────────────┐ ┌────────────────────────────┐
│ Recent Achievements     │ │ Active Plan                │
│ 🌱 First Step           │ │ ████████░░ 65% complete    │
│ 📊 Data Driven          │ │ Next: Switch to LED bulbs  │
│ 🔥 On Fire              │ │ [View Plan →]              │
│ [View All →]            │ │                            │
└─────────────────────────┘ └────────────────────────────┘
```

### Visual Treatment

| Element | Style |
|---|---|
| **Stat cards** | Large `metric` number in `text-foreground`. Label in `overline` style (`uppercase`, `tracking-widest`, `text-muted-foreground`). Delta badge: green if improving, red if worsening. |
| **Donut chart** | 200px diameter. 3px stroke gap between segments. Center text: total number. Hover: segment expands slightly. |
| **Trend line** | 2px stroke width. Dot on each data point (4px). Tooltip on hover with exact value + date. Reference lines dashed with label. |
| **Quick action buttons** | Full-width ghost buttons with icon left, chevron-right right. `hover:bg-accent`. |
| **Equivalency cards** | Icon (32px) + number (`metric-sm`) + label. `bg-card`, `border`, minimal. |

---

## 16. Calculator Design

### Visual Reference: Notion's setup wizard + Typeform

### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌─ Progress Bar ──────────────────────────────────────┐ │
│  │ ●━━━━━━● ○───────○ ○───────○ ○───────○             │ │
│  │ Transport  Energy   Diet    Shopping  Waste          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  Step 1 of 5                                         │ │
│  │                                                      │ │
│  │  Transportation 🚗                                   │ │
│  │  Tell us about how you get around.                   │ │
│  │                                                      │ │
│  │  ┌──────────────────────────────┐                    │ │
│  │  │ Daily car commute distance   │                    │ │
│  │  │ ┌──────────────────┐ km     │                    │ │
│  │  │ │ 25               │        │                    │ │
│  │  │ └──────────────────┘        │                    │ │
│  │  │ Round trip distance          │                    │ │
│  │  └──────────────────────────────┘                    │ │
│  │                                                      │ │
│  │  ... more fields ...                                 │ │
│  │                                                      │ │
│  │  ┌────────────┐  ┌─────────────────┐                │ │
│  │  │  ← Back    │  │   Next →        │                │ │
│  │  └────────────┘  └─────────────────┘                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌───────────────────────────────┐ ← Floating on desktop │
│  │ Running Estimate              │    Bottom sheet mobile │
│  │ 4,250 kg CO₂e/year           │                        │
│  │ ████████░░░░ Transport: 1800 │                        │
│  └───────────────────────────────┘                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Visual Treatment

| Element | Style |
|---|---|
| **Progress bar** | Horizontal stepper with connected dots. Completed: `bg-primary` filled dot + solid line. Current: `bg-primary` pulsing dot. Future: `border` unfilled dot + dashed line. Step labels below dots. |
| **Step card** | Max-width `640px`, centered. `bg-card`, `border`, `rounded-lg`, `p-6`. |
| **Step counter** | `overline` style: "STEP 1 OF 5" |
| **Category title** | `h2` with icon. |
| **Form fields** | Stacked vertically with `space-y-6` gap. Full-width inputs. |
| **Running total** | `bg-card`, `border`, `rounded-lg`. Position: `fixed bottom-4 right-4` on desktop (300px wide), `fixed bottom-0` as sheet on mobile. Number in `metric-sm` style. Category mini-bars below with color indicators. |
| **Navigation buttons** | "Back" = `outline` variant. "Next" = `default` (primary) variant. Right-aligned. |

### Interaction Details

| Interaction | Behavior |
|---|---|
| Step transition | Card content fades out (150ms) and slides left, new content fades in (200ms) and slides from right. `transition: opacity 200ms, transform 200ms`. |
| Running total update | Number animates with `count-up` effect (200ms). Mini-bars scale with `transition: width 300ms ease-out`. |
| Field focus | Emerald focus ring. Label shifts from `text-muted-foreground` to `text-foreground`. |
| Diet type cards | Visual card selection (like Notion's initial setup). Selected card: `border-primary`, `bg-primary/5`. |

---

## 17. AI Coach Design

### Visual Reference: Perplexity AI + Linear command palette

### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  AI Sustainability Coach                                 │
│  Get personalized advice based on your footprint         │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌── Chat Area (scrollable) ──────────────────────────┐ │
│  │                                                     │ │
│  │   ┌─ AI Message ──────────────────────────────────┐│ │
│  │   │ 🤖                                            ││ │
│  │   │ Hi Het! 👋 I've analyzed your carbon           ││ │
│  │   │ footprint. Your biggest impact area is        ││ │
│  │   │ **Transportation** at 1,800 kg CO₂e/year.    ││ │
│  │   │                                               ││ │
│  │   │ Here are 3 quick wins:                        ││ │
│  │   │ • Switch to public transit 2x/week → save 400kg│ │
│  │   │ • Carpool to work → save 300kg                ││ │
│  │   │ • Work from home 1 day/week → save 220kg     ││ │
│  │   │                                    12:34 PM   ││ │
│  │   └───────────────────────────────────────────────┘│ │
│  │                                                     │ │
│  │                    ┌─ User Message ──┐             │ │
│  │                    │ What about my   │             │ │
│  │                    │ diet?    12:35  │             │ │
│  │                    └─────────────────┘             │ │
│  │                                                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌── Quick Prompts ──────────────────────────────────┐  │
│  │ [What's my biggest impact?] [3 easy wins]         │  │
│  │ [Reduce transport emissions] [Compare to average] │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌── Input ──────────────────────────────────────────┐  │
│  │ Ask about your carbon footprint...         [Send] │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  AI-generated advice. Estimates are approximate.  15/20  │
└──────────────────────────────────────────────────────────┘
```

### Visual Treatment

| Element | Style |
|---|---|
| **AI messages** | Left-aligned. `bg-muted`, `rounded-lg` (top-left squared: `rounded-tl-sm`). Max-width 85%. Bot avatar: small `Bot` icon in emerald circle (24px). Markdown rendered. |
| **User messages** | Right-aligned. `bg-primary`, `text-primary-foreground`, `rounded-lg` (top-right squared: `rounded-tr-sm`). Max-width 75%. |
| **Timestamps** | `caption` size, `text-muted-foreground`, bottom-right of each message. |
| **Quick prompts** | Horizontal scrollable chip row. `bg-muted`, `border`, `rounded-md`. Hover: `bg-accent`. |
| **Input area** | Full-width. `bg-background`, `border`, `rounded-lg`. Auto-grow textarea (1–3 lines). Send button: `bg-primary`, icon only, right side of input. Disabled state: 50% opacity. |
| **Typing indicator** | Three dots in AI message bubble, animating with staggered bounce (120ms delay each). |
| **Streaming text** | Characters appear one by one with a subtle `cursor` blink at end. Smooth auto-scroll. |
| **Disclaimer** | `caption` size, `text-foreground-tertiary`, bottom of page. |
| **Rate counter** | `caption` size, right-aligned, `text-muted-foreground`. Turns `text-warning` below 5. |

---

## 18. Simulator Design

### Visual Reference: Toggle-based comparison tool (like pricing page toggles)

### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  Impact Simulator                                        │
│  See how lifestyle changes could reduce your footprint   │
│                                                          │
│  ┌─ Current Footprint ────────────────────────────────┐ │
│  │ Your current footprint: 4,250 kg CO₂e/year        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ Before / After Chart ─────────────────────────────┐ │
│  │                                                     │ │
│  │    4,250 ████████████████████████████                │ │
│  │    2,395 █████████████████            ← projected   │ │
│  │                                                     │ │
│  │    Potential savings: 1,855 kg (43%)                │ │
│  │    🌳 Equivalent to 30 trees planted                │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─ TRANSPORTATION ───────────────────────────────────┐ │
│  │ ┌──────────────────────┐ ┌──────────────────────┐  │ │
│  │ │ Switch to EV         │ │ Reduce commute 50%   │  │ │
│  │ │ ~2,000 kg/year  [ON] │ │ ~1,100 kg/year [OFF] │  │ │
│  │ └──────────────────────┘ └──────────────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
│  ... more category sections ...                          │
│                                                          │
│  ┌─ Actions ──────────────────────────────────────────┐ │
│  │ [Reset All]                  [Apply to My Plan →]  │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Visual Treatment

| Element | Style |
|---|---|
| **Scenario cards** | `bg-card`, `border`, `rounded-lg`, `p-4`. 2-column grid on desktop, stack on mobile. Switch (`shadcn Switch`) on right side. Title in `h4`. Savings in `body-sm text-primary`. |
| **Active scenario card** | `border-primary`, `bg-primary/5`. |
| **Comparison chart** | Two horizontal bars stacked. "Current" bar in `text-muted-foreground` fill. "Projected" bar in `text-primary` fill. Animated width transition (500ms ease-out). |
| **Savings callout** | Large `metric-sm` number in `text-primary`. Percentage in badge. Equivalency below in `body-sm`. |
| **Category headers** | `overline` style: "TRANSPORTATION", "ENERGY", etc. With category icon. `mb-3`. |

---

## 19. Planner Design

### Layout Structure

**No Plan State:**
```
┌──────────────────────────────────────────────────────────┐
│  Reduction Planner                                       │
│  Set a goal and get a personalized action plan           │
│                                                          │
│  ┌─ Goal Setting Card (centered, max-w-lg) ──────────┐ │
│  │                                                     │ │
│  │  Reduce by:     [▼ 20%        ]                    │ │
│  │  Timeframe:     [▼ 6 months   ]                    │ │
│  │                                                     │ │
│  │  Based on your 4,250 kg, you'd target 3,400 kg.   │ │
│  │  That's a reduction of 850 kg CO₂e.               │ │
│  │                                                     │ │
│  │  [  Generate My Plan with AI ✨  ]                  │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Active Plan State:**
```
┌──────────────────────────────────────────────────────────┐
│  Reduction Planner                                       │
│  "Your Green Transition Plan"                            │
│                                                          │
│  ┌─ Plan Header ─────────────────────────────────────┐  │
│  │ Target: −850 kg   Timeframe: 6 months             │  │
│  │ ██████████████░░░░░░░░ 65% complete (8/12 actions)│  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ WEEK 1 ──────────────────────────────────────────┐  │
│  │ ✅ Switch commute to bus 2x/week  −400 kg  Easy   │  │
│  │ ✅ Set thermostat 2° lower        −200 kg  Easy   │  │
│  │ ☐  Start meal planning to reduce... −150 kg Med   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ WEEK 2 ──────────────────────────────────────────┐  │
│  │ ☐  ... more actions ...                           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  [Start Over]                                            │
└──────────────────────────────────────────────────────────┘
```

### Visual Treatment

| Element | Style |
|---|---|
| **Action item** | Checkbox (shadcn `Checkbox`) + text + badge row. Completed: strikethrough text, `text-muted-foreground`. Difficulty badge: Easy=`bg-primary/10 text-primary`, Medium=`bg-warning/10 text-warning`, Hard=`bg-destructive/10 text-destructive`. Savings in `mono` style. |
| **Progress bar** | `h-2`, `bg-muted`, inner fill `bg-primary`, `rounded-full`. Animate width on change. |
| **Week headers** | `overline` style, `text-muted-foreground`. |
| **Generate button** | Full width, `lg` size, `bg-primary`. Loading state: shimmer animation + "Creating your plan..." text. |

---

## 20. Analytics Design

### Visual Reference: Stripe Dashboard

### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  Progress Analytics                      [Date Filter ▼] │
│                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │ CO₂e SAVED   │ │ CALCULATIONS │ │ CURRENT STREAK   │ │
│  │ 850 kg       │ │ 12           │ │ 🔥 7 days        │ │
│  │ cumulative   │ │ total logged │ │ Best: 14         │ │
│  └──────────────┘ └──────────────┘ └──────────────────┘ │
│                                                          │
│  ┌─ Footprint Trend (line chart) ────────────────────┐  │
│  │                                                    │  │
│  │  Smooth bezier curve, area fill below at 5% alpha  │  │
│  │  Dashed reference lines for averages               │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Category Changes (stacked area or grouped bar) ──┐  │
│  │                                                    │  │
│  │  Shows how each category evolved over time         │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Month-over-Month ────┐ ┌─ Equivalencies ─────────┐ │
│  │ May → Jun: ↓ 150 kg   │ │ 🌳 12 trees planted     │ │
│  │ Apr → May: ↓  80 kg   │ │ 🚗 4,200 km not driven  │ │
│  │ Mar → Apr: ↑  20 kg   │ │ ⛽ 380 gallons saved     │ │
│  └────────────────────────┘ └─────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Stripe-Inspired Chart Styling

| Property | Value |
|---|---|
| Line color | `text-primary` (#10B981) |
| Line width | 2px |
| Area fill | `primary` at 5% opacity gradient (top → transparent) |
| Grid lines | Horizontal only. `border-subtle` color. Dashed. |
| Axis labels | `caption` size, `text-muted-foreground`. |
| Data points | Invisible by default. 6px emerald dot appears on hover. |
| Tooltip | `bg-popover`, `border`, `rounded-md`, `shadow-lg`. Shows exact value + date. |
| Reference lines | Dashed, `text-muted-foreground` at 50% opacity. Labeled inline. |
| Curve | `monotone` (smooth bezier, not jagged). |

---

## 21. Achievement Design

### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  Achievements                                            │
│  Track your milestones and celebrate your impact         │
│                                                          │
│  ┌─ Streak Section ──────────────────────────────────┐  │
│  │  🔥 7 Day Streak                     Best: 14     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Progress ────────────────────────────────────────┐  │
│  │  5 of 12 badges earned   ████████░░░░░ 42%        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─ Badge Grid (4 columns) ──────────────────────────┐  │
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │ │
│  │ │  🌱     │ │  📊     │ │  🔥     │ │  🎯     │  │ │
│  │ │ First   │ │ Data    │ │ On Fire │ │ Goal    │  │ │
│  │ │ Step    │ │ Driven  │ │         │ │ Setter  │  │ │
│  │ │ ✅ Jun 1│ │ ✅ Jun 3│ │ ✅ Jun 8│ │ 🔒      │  │ │
│  │ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │ │
│  │ ... 8 more badges ...                              │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Visual Treatment

| Element | Style |
|---|---|
| **Earned badge card** | `bg-card`, `border border-primary/30`, `rounded-lg`. Emoji at 40px. Name in `h4`. Date in `caption text-muted-foreground`. Subtle `bg-primary/5` tint. |
| **Locked badge card** | `bg-card`, `border`, `rounded-lg`. Emoji at 40px with `opacity-30 grayscale`. Name in `h4 text-muted-foreground`. Progress bar below: `h-1.5 bg-muted` with `bg-primary` fill. |
| **Streak display** | Large `metric` number. Flame emoji. `text-foreground`. "Best" in `body-sm text-muted-foreground`. |
| **Unlock notification (toast)** | Special toast variant: `border-primary`, `bg-card`. Large emoji + "Achievement Unlocked!" in `h4` + badge name. Slide-up animation + subtle confetti particle effect (3–5 particles, 500ms, CSS-only). |

---

## 22. Authentication Screens

### Visual Reference: Linear login + Vercel login

### Layout

- **Desktop:** Split screen. Left 50%: brand panel (dark, with gradient orb + tagline). Right 50%: white/light form.
- **Mobile:** Full-screen form, brand logo at top.

```
Desktop:
┌───────────────────────┬───────────────────────┐
│                       │                       │
│    ◉ CarbonSphere AI  │   Welcome back        │
│                       │                       │
│    "Track Smarter.    │   Sign in to continue │
│     Live Greener."    │   your sustainability │
│                       │   journey.            │
│    ┌───────────────┐  │                       │
│    │  Gradient Orb │  │   [Continue w/ Google]│
│    │  (animated)   │  │   ────── or ──────    │
│    └───────────────┘  │   Email: [________]   │
│                       │   Pass:  [________]   │
│                       │   [Forgot password?]  │
│                       │                       │
│                       │   [  Sign In  ]       │
│                       │                       │
│                       │   Don't have account? │
│                       │   Sign up             │
│                       │                       │
└───────────────────────┴───────────────────────┘
```

### Brand Panel Specifications

| Element | Style |
|---|---|
| Background | `bg-background` (#09090B) |
| Gradient orb | 300px × 300px radial gradient. Colors: `emerald-500/20` center → `transparent` edge. Subtle float animation (5s infinite). Also a secondary `blue-500/10` orb offset 100px. Like Vercel's homepage orbs. |
| Logo | White wordmark, 32px height. |
| Tagline | `h2` weight 400, `text-muted-foreground`. |

### Form Panel Specifications

| Element | Style |
|---|---|
| Background | `bg-background` (uses theme — dark: #09090B, light: #FFF) |
| Max width | 400px, centered vertically and horizontally |
| Title | `h1` size |
| Subtitle | `body text-muted-foreground` |
| OAuth button | Full-width, `outline` variant, Google icon (SVG, 18px) + text |
| Divider | `<hr>` with "or" centered in `caption text-muted-foreground` |
| Form fields | Standard input components. Labels above. Error messages below. |
| Submit | Full-width `default` (primary) button |
| Link text | `body-sm text-muted-foreground`. Link in `text-primary`. |

---

## 23. Landing Page Design

### Visual Reference: Vercel + Linear + Stripe Homepage

### Section Breakdown

#### Section 1: Hero

```
┌──────────────────────────────────────────────────────────┐
│  Nav: [Logo]      Features  How It Works      [Sign In]  │
│                                                [Get Started]│
│                                                          │
│                                                          │
│              Track Smarter.                              │
│              Live Greener.                               │
│                                                          │
│     AI-powered carbon footprint tracking that            │
│     turns awareness into action.                         │
│                                                          │
│     [ Calculate Your Footprint — Free ]                  │
│     [ Get Started ]                                      │
│                                                          │
│              ┌────────────────────┐                      │
│              │  Dashboard Preview │ ← Floating card      │
│              │  with glow effect  │    mock of dashboard │
│              └────────────────────┘                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Hero Specifications:**
- Background: `bg-background` with two gradient orbs (emerald + blue) animated with slow float.
- Headline: `display` size (48px), `font-bold`, `tracking-tight`. Center-aligned.
- Subtitle: `h3` size, `text-muted-foreground`, max-width 560px, center-aligned.
- Primary CTA: `default` variant, `lg` size. Ghost shimmer border animation.
- Secondary CTA: `outline` variant, `lg` size.
- Dashboard preview: Floating card angled 2° with subtle perspective. `border`, `rounded-xl`, glow shadow (`0 0 80px rgba(16, 185, 129, 0.15)`). Shows a cropped, non-interactive dashboard mock.
- Vertical padding: `py-24` desktop, `py-16` mobile.

#### Section 2: Features Grid

4 feature cards in a row (2×2 on mobile). Each card:

```
┌─────────────────────┐
│ [Icon in muted bg]  │
│                     │
│ Feature Name        │
│ One-line description│
│ that explains the   │
│ value clearly.      │
└─────────────────────┘
```

- Card: `bg-card`, `border`, `rounded-lg`, `p-6`.
- Icon: 32px, in a 48px `bg-muted` `rounded-md` container.
- Title: `h3`.
- Description: `body text-muted-foreground`.
- Hover: `border-primary/50` transition (200ms).

Features: Calculator, AI Coach, Simulator, Dashboard.

#### Section 3: How It Works (3-step)

Horizontal stepper with connecting line:

```
    ①────────────②────────────③
  Calculate    Get AI       Track &
  Your Impact  Insights     Reduce
```

- Numbers in `rounded-full bg-primary text-primary-foreground` circles (40px).
- Connecting line: 2px `border-border`, dashed.
- Step titles: `h3`, center-aligned.
- Step descriptions: `body text-muted-foreground`, max-width 280px.

#### Section 4: CTA

- Heading: `h2`, "Ready to make a difference?"
- Subtext: `body text-muted-foreground`, "Join thousands of people taking climate action."
- Button: `default lg`, "Start Free — No Credit Card"
- Background: Subtle gradient or `bg-muted` band.

#### Section 5: Footer

- `border-t`, `bg-background`, `py-8`.
- Logo (small), copyright, links: Privacy, Terms, GitHub icon.
- Simple, minimal. One row.

---

## 24. Mobile Design Strategy

### Core Principles

1. **Thumb-zone optimized:** Primary actions placed in bottom 40% of screen.
2. **Single-column layouts:** All grids collapse to single column below 768px.
3. **Bottom sheets over modals:** On mobile, prefer bottom sheets (`shadcn Sheet`) for secondary actions.
4. **Full-width components:** Buttons, inputs, cards expand to full width on mobile.
5. **Collapsed navigation:** Bottom tab bar with "More" overflow.

### Mobile-Specific Adaptations

| Desktop | Mobile |
|---|---|
| Sidebar navigation | Bottom tab bar |
| Multi-column card grids | Single column stack |
| Floating running total (calculator) | Bottom sheet |
| Side-by-side comparison (simulator) | Stacked vertically |
| Horizontal badge grid (4 col) | 2-column grid |
| Chart tooltips on hover | Tap-to-reveal |
| Split auth layout | Full-screen form |

---

## 25. Responsive Design Rules

### Breakpoints

| Name | Width | Tailwind Prefix |
|---|---|---|
| Mobile | < 640px | Default (no prefix) |
| Small | ≥ 640px | `sm:` |
| Medium | ≥ 768px | `md:` |
| Large | ≥ 1024px | `lg:` |
| XL | ≥ 1280px | `xl:` |

### Rules

1. **Design mobile-first.** Write base styles for mobile, then add `md:` and `lg:` overrides.
2. **Content max-width:** `max-w-7xl` (1280px) on all authenticated pages. `max-w-6xl` (1152px) on landing page.
3. **Container padding:** `px-4` (mobile) → `px-6` (md) → `px-8` (lg).
4. **Card grid:** `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`.
5. **No horizontal scrolling.** Ever. Except for the quick prompt chip row in AI Coach.
6. **Touch targets:** All interactive elements minimum 44px × 44px (WCAG 2.5.5).
7. **Font size:** Do NOT reduce font sizes below `12px` at any breakpoint.

---

## 26. Dark Mode Strategy

### Default: Dark Mode

CarbonSphere AI is **dark-first**. The default theme is dark. Users can switch to light via Settings or the sidebar/header toggle.

### Implementation

1. Use CSS custom properties (`:root` and `.dark` class) via shadcn/ui theme setup.
2. Apply `dark` class to `<html>` by default.
3. Persist theme preference to `localStorage` and the user's profile (if authenticated).
4. Use `next-themes` for SSR-safe theme management (prevents flash of wrong theme).

### Dark Mode Color Mapping (CSS Variables)

```css
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 5.5%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 5.5%;
  --popover-foreground: 0 0% 98%;
  --primary: 160 84% 39%;
  --primary-foreground: 0 0% 2%;
  --secondary: 240 5% 12%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 5% 12%;
  --muted-foreground: 240 5% 65%;
  --accent: 240 5% 12%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5% 14%;
  --input: 240 5% 14%;
  --ring: 160 84% 39%;
}
```

### Dark Mode Rules

- **Never use pure black (#000000).** Darkest surface is `#09090B`.
- **Never use pure white (#FFFFFF) for text.** Lightest text is `#FAFAFA`.
- **Borders are subtle**, not harsh. `#222228` default.
- **Reduce visual weight of shadows.** Shadows are `rgba(0,0,0,0.3-0.5)`, not colored.
- **Charts:** Maintain same accent colors but reduce background grid contrast.

---

## 27. Light Mode Strategy

### Light Mode Color Mapping

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 99%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 160 84% 39%;
  --primary-foreground: 0 0% 100%;
  --secondary: 240 5% 96%;
  --secondary-foreground: 240 6% 10%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 46%;
  --accent: 240 5% 96%;
  --accent-foreground: 240 6% 10%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 6% 90%;
  --input: 240 6% 90%;
  --ring: 160 84% 39%;
}
```

### Light Mode Rules

- Card background: `#FCFCFC` (not pure white — creates subtle layering).
- Shadows are `rgba(0, 0, 0, 0.05–0.1)` (very subtle).
- Primary (emerald) slightly darkened for better contrast on white surfaces.
- Charts: Slightly thicker grid lines for legibility.

---

## 28. Accessibility Guidelines

### Color Contrast

| Pairing | Required Ratio | Actual | Status |
|---|---|---|---|
| `foreground` on `background` (dark) | 4.5:1 | ~17:1 | ✅ |
| `muted-foreground` on `background` (dark) | 4.5:1 | ~6.5:1 | ✅ |
| `primary` on `background` (dark) | 3:1 (large text) | ~5.2:1 | ✅ |
| `primary-foreground` on `primary` | 4.5:1 | ~8:1 | ✅ |
| `foreground` on `card` (dark) | 4.5:1 | ~15:1 | ✅ |

### Component Accessibility Checklist

| Component | Requirements |
|---|---|
| **All buttons** | Visible focus ring (2px `ring-primary`, 2px offset). |
| **All inputs** | Associated `<label>`. `aria-invalid` + `aria-describedby` for errors. |
| **All charts** | Hidden `<table>` with `sr-only` class containing equivalent data. `aria-label` on chart container. |
| **All icons (decorative)** | `aria-hidden="true"`. |
| **All icon buttons** | `aria-label` describing action. |
| **All modals** | Focus trap. `Escape` closes. Focus returns to trigger on close. |
| **All toasts** | `role="status"`, `aria-live="polite"`. |
| **Navigation** | `<nav>` with `aria-label`. Active item: `aria-current="page"`. |
| **Progress bars** | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. |
| **Theme toggle** | `aria-label="Switch to {opposite} mode"`. |

### Keyboard Navigation

All interactive elements must be reachable via `Tab`. All activatable via `Enter`/`Space`. All dismissible via `Escape`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 29. Animation Guidelines

### Core Principle: Motion with Meaning

Every animation must communicate a state change or provide spatial context. Zero decorative animation.

### Timing Functions

| Name | Value | Usage |
|---|---|---|
| `ease-default` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Standard transitions |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Enters + exits |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering (modals, toasts) |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy micro-interactions (badge unlock) |

### Duration Scale

| Duration | Usage |
|---|---|
| 100ms | Hover effects (color, opacity) |
| 150ms | Button press feedback |
| 200ms | Focus ring, input state changes |
| 300ms | Card transitions, chart data updates |
| 500ms | Page transitions, chart animations |
| 1000ms | Badge unlock animation |

### Specific Animations

| Element | Animation |
|---|---|
| **Page load** | Content fades in + slides up 8px. 300ms. Stagger children by 50ms. |
| **Card hover** | `border-color` transition, 150ms. Subtle `translateY(-1px)`. |
| **Chart data** | Draw-in from left. 500ms ease-out. |
| **Progress bar** | Width animates from 0 to value. 500ms ease-out. |
| **Donut chart segments** | Animate arc from 0° to final angle. Stagger by 100ms per segment. |
| **Counter numbers** | Count up from 0 to value. 500ms. Use `tabular-nums`. |
| **Toast enter** | Slide up from bottom + fade in. 300ms ease-out. |
| **Toast exit** | Slide right + fade out. 200ms ease-in. |
| **Step transition (calculator)** | Current step fades out + slides left. New step fades in + slides from right. 200ms. |
| **Skeleton shimmer** | Left-to-right gradient sweep. 1.5s infinite. |
| **AI typing** | Three dots with staggered opacity bounce. 1.2s infinite. |
| **Gradient orbs (landing)** | Slow float. `translateY(±20px)` over 8s. Infinite. Ease-in-out. |

---

## 30. Micro-Interactions

| Interaction | Behavior |
|---|---|
| **Button hover** | Background darkens/lightens 10%. 100ms transition. Cursor: pointer. |
| **Button press** | `scale(0.98)` for 100ms. Provides tactile feedback. |
| **Checkbox toggle (planner)** | Checkmark draws in with SVG path animation. 200ms. If completing action: brief confetti particles (CSS). |
| **Switch toggle (simulator)** | Smooth slide + color transition. 200ms. Scenario card border flashes `border-primary` briefly. |
| **Nav item hover** | Background shifts to `bg-accent`. 100ms. |
| **Nav item active** | Left border-primary slides in from top. 150ms. |
| **Chart tooltip** | Fades in (100ms). Follows cursor with 4px offset. |
| **Running total (calculator)** | Numbers count-up animate on value change. 200ms. |
| **Badge unlock** | Scale from 0.8 to 1.05 to 1.0 (spring). 600ms. Brief golden glow ring. |
| **Input focus** | Border transitions to `border-ring`. Ring appears with 200ms fade. |
| **Error shake** | `translateX(±4px)` 3 times over 300ms on invalid submit. |
| **Streamed AI text** | Characters appear with 20ms stagger. Blinking cursor at end. |
| **Scroll indicator (more below)** | Subtle arrow bouncing at bottom of content. `translateY(4px)` over 1.5s. |

---

## 31. Empty State Design

### Visual Pattern

Every empty state follows this structure:

```
┌──────────────────────────────────┐
│                                  │
│         [Muted Icon 48px]        │
│                                  │
│     Headline (h3, center)        │
│                                  │
│  Description (body, muted,       │
│  max-w-sm, center)               │
│                                  │
│     [  Primary CTA  ]           │
│                                  │
└──────────────────────────────────┘
```

- **Icon:** Relevant Lucide icon, 48px, `text-muted-foreground` at 50% opacity.
- **Headline:** `h3`, `text-foreground`.
- **Description:** `body`, `text-muted-foreground`, max-width 384px, centered.
- **CTA:** `default` variant button.
- **Tone:** Encouraging, not scolding. "Let's get started!" not "No data found."

---

## 32. Error State Design

### Inline Field Error

```
┌────────────────────────────────┐
│ Email address                  │
│ ┌────────────────────────────┐ │ ← border-destructive
│ │ not-an-email               │ │
│ └────────────────────────────┘ │
│ ⚠ Please enter a valid email   │ ← text-destructive, caption
└────────────────────────────────┘
```

### Page-Level Error (error.tsx)

```
┌──────────────────────────────────────┐
│                                      │
│        [AlertCircle 48px, red/muted] │
│                                      │
│     Something went wrong             │
│                                      │
│  We couldn't load this page.         │
│  Please try again or go home.        │
│                                      │
│     [  Try Again  ]  [  Go Home  ]   │
│                                      │
└──────────────────────────────────────┘
```

### Error Toast

```
┌────────────────────────────────────────┐
│ 🔴  Couldn't save your data.          │
│     Please try again.          [ × ]   │
└────────────────────────────────────────┘
```

---

## 33. Loading State Design

### Skeleton Screen Pattern

Use `shadcn Skeleton` component. Gray rectangles matching the exact shape and size of the content they replace.

```css
/* Shimmer effect */
.skeleton {
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 25%,
    hsl(var(--muted) / 0.5) 50%,
    hsl(var(--muted)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Skeleton Specifications by Page

| Page | Skeleton Layout |
|---|---|
| **Dashboard** | 3 stat card skeletons (height match) + chart rectangle + 3 equivalency rectangles |
| **Analytics** | 3 stat skeletons + 2 chart rectangles |
| **Achievements** | Streak bar skeleton + 12 badge card skeletons (2×6 or 4×3 grid) |
| **Planner** | Header bar skeleton + 6 action item skeletons (checkbox + text lines) |
| **AI Coach** | Chat area: 2 message bubble skeletons (different widths) |

### Button Loading State

```
┌──────────────────────────┐
│  ◠ Saving...             │ ← Spinner (14px) replaces icon. Text changes.
└──────────────────────────┘    Button disabled. 60% opacity.
```

---

## 34. Data Visualization Design

### Chart Library: Recharts

### Global Chart Styling Rules

| Property | Value |
|---|---|
| Font family | Inter (inherit from body) |
| Font size (labels) | 12px |
| Font color | `hsl(var(--muted-foreground))` |
| Grid lines | Horizontal only, dashed, `hsl(var(--border))` |
| Background | Transparent (inherits card bg) |
| Responsive | `<ResponsiveContainer width="100%" height={300}>` |
| Curve type | `monotone` for line charts |
| Animation | `animationDuration={500}` |

### Donut Chart (Category Breakdown)

| Property | Value |
|---|---|
| Inner radius | 60% of outer |
| Outer radius | 100px (desktop), 80px (mobile) |
| Stroke gap | 3px between segments |
| Center label | Total number in `metric` style |
| Legend | Right side (desktop), below (mobile). Dots + labels. |
| Colors | Use chart color palette from Section 6 |

### Line Chart (Trend)

| Property | Value |
|---|---|
| Stroke width | 2px |
| Dot | Hidden by default, 5px `fill-primary` on hover |
| Area fill | Gradient from `primary/10` at top to `transparent` at bottom |
| Reference lines | Dashed, `stroke-muted-foreground/50`, with inline label |
| Tooltip | Custom styled with `bg-popover border rounded-md shadow-lg p-3` |

### Bar Chart (Comparison)

| Property | Value |
|---|---|
| Bar radius | `[4, 4, 0, 0]` (rounded top) |
| Bar gap | 4px |
| Category gap | 24px |
| Your bar | `fill-primary` |
| Average bars | `fill-muted` |
| Highlight | Active bar gets `fill-primary`, others get `fill-muted/50` on hover |

### Accessible Data Table (Hidden)

Every chart must be accompanied by:

```html
<table className="sr-only" aria-label="Category breakdown data">
  <thead>
    <tr><th>Category</th><th>Emissions (kg CO₂e)</th><th>Percentage</th></tr>
  </thead>
  <tbody>
    <tr><td>Transportation</td><td>1,785</td><td>42%</td></tr>
    ...
  </tbody>
</table>
```

---

## 35. Premium SaaS Patterns

These patterns separate a premium SaaS product from a hackathon prototype:

| Pattern | Implementation |
|---|---|
| **Command palette** (optional) | `Cmd+K` opens search/navigation overlay. Like Linear. Use `shadcn Command` (built on cmdk). |
| **Keyboard shortcuts** | Display subtle hints in tooltips: "Dashboard (⌘1)". |
| **Smooth page transitions** | Fade-in + slide-up on navigation. 200ms. Using `framer-motion` `AnimatePresence`. |
| **Tabular numbers** | All data displays use `font-variant-numeric: tabular-nums` for aligned columns. |
| **Relative timestamps** | "2 hours ago", "Yesterday" instead of raw dates. |
| **Monospace data** | Financial-style number formatting: `4,250 kg` with comma separators and unit labels. |
| **Hover cards** | On achievement badges, show details in hover card (`shadcn HoverCard`) instead of modal. |
| **Subtle grid dots** | Landing page background: dot grid pattern at 5% opacity. Creates depth without noise. |
| **Loading progress** | NProgress-style thin loading bar at very top of page during navigation. Emerald color. |
| **Favicon with status** | Standard favicon. On badge unlock, briefly change to ✨ (if feasible). |

---

## 36. Judge-Wow Features

These features create an immediate "wow" impression for hackathon judges:

| Feature | Visual Impact | Implementation Effort |
|---|---|---|
| **Animated gradient orbs on landing** | Ultra-high. Feels like Vercel/Arc. | CSS animations only. Low effort. |
| **Dashboard loads with staggered animation** | High. Feels premium and alive. | Framer-motion stagger. Medium effort. |
| **AI coach streams text in real-time** | High. Feels like ChatGPT/Perplexity. | Vercel AI SDK streaming. Medium effort. |
| **Chart draw-in animations** | Medium. Polished feeling. | Recharts built-in. Low effort. |
| **Badge unlock with confetti particles** | High. Delightful surprise. | CSS-only particles. Low effort. |
| **Smooth counter animations on metrics** | Medium. Data comes alive. | Custom hook. Low effort. |
| **Dark mode as default** | Medium. Instant premium feeling. | next-themes. Low effort. |
| **Split-screen auth with gradient orb** | High. First impression screen. | CSS. Low effort. |
| **Responsive simulator with live chart updates** | High. Interactive and engaging. | Recharts + state. Medium effort. |
| **Skip-to-content link + keyboard nav** | Medium with judges. Shows maturity. | HTML + CSS. Very low effort. |

---

## 37. Design Tokens

### Complete Token Reference (CSS Custom Properties)

```css
:root {
  /* Radius */
  --radius: 0.5rem;

  /* Font */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Transitions */
  --transition-fast: 100ms;
  --transition-default: 200ms;
  --transition-slow: 300ms;
  --transition-ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --transition-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Shadows (Light mode) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.dark {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.5);
}
```

---

## 38. Tailwind Mapping

### tailwind.config.ts Extensions

```typescript
const config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.025em' }],
        'metric': ['2.25rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'metric-sm': ['1.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': '#10B981', // emerald - Transportation
          '2': '#3B82F6', // blue - Energy
          '3': '#F59E0B', // amber - Diet
          '4': '#8B5CF6', // violet - Shopping
          '5': '#F43F5E', // rose - Waste
        },
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      keyframes: {
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 8s ease-in-out infinite',
        'count-up': 'count-up 0.3s ease-out',
      },
    },
  },
};
```

---

## 39. shadcn/ui Component Usage

### Required Components (Install via `npx shadcn@latest add`)

| Component | Usage Location |
|---|---|
| `button` | All CTAs, form submits, nav actions |
| `card` | Dashboard stats, feature cards, settings sections |
| `input` | Calculator form fields, settings |
| `label` | All form fields |
| `select` | Dropdowns (fuel type, diet, filters) |
| `checkbox` | Planner action items |
| `switch` | Simulator toggles, settings toggles |
| `slider` | Calculator (meals, trash bags) |
| `radio-group` | Calculator (diet type, recycling) |
| `progress` | Goal progress, plan progress |
| `badge` | Category tags, difficulty, deltas |
| `toast` / `sonner` | Success, error, achievement notifications |
| `dialog` | Delete confirmation, achievement unlock detail |
| `sheet` | Mobile "More" nav, mobile running total |
| `dropdown-menu` | User menu, date filter |
| `avatar` | Sidebar user, chat messages |
| `separator` | Section dividers |
| `skeleton` | Loading states |
| `tooltip` | Icon buttons, collapsed nav labels |
| `tabs` | Settings sections (if needed) |
| `hover-card` | Badge details on achievements page |
| `command` | Command palette (Cmd+K) (stretch goal) |
| `scroll-area` | Chat message container, long lists |

### Customization Rules

1. **Do NOT modify shadcn source files** in `components/ui/` unless necessary for design token alignment.
2. **Use `cn()` utility** (from `lib/utils.ts`) for all conditional class merging.
3. **Create wrapper components** in `components/` for domain-specific uses (e.g., `StatCard`, `MetricDisplay`, `CategoryBadge`).
4. **All theme colors reference CSS variables** — never hardcode hex values in component classes.

---

## 40. Final Visual Direction

### Summary: Ultra-Premium Sustainability SaaS

CarbonSphere AI is designed to look and feel like a **Series-A funded startup's flagship product**, not a hackathon prototype. The visual direction is:

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│   DARK, NEUTRAL SURFACES                               │
│   + SINGLE EMERALD ACCENT                              │
│   + INTER TYPOGRAPHY WITH TIGHT TRACKING               │
│   + MATHEMATICAL SPACING (4px GRID)                    │
│   + SUBTLE BORDERS (NOT SHADOWS)                       │
│   + PURPOSEFUL MICRO-ANIMATIONS                        │
│   + STRIPE-GRADE DATA VISUALIZATION                    │
│   + WCAG 2.1 AA ACCESSIBILITY                          │
│   + VERCEL-STYLE LANDING PAGE                          │
│   + LINEAR-STYLE DASHBOARD                             │
│   + PERPLEXITY-STYLE AI CHAT                           │
│                                                        │
│   = JUDGE-WINNING FIRST IMPRESSION                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Design Quality Checklist

- [ ] Every page has generous whitespace — nothing feels cramped
- [ ] Color palette is strictly monochromatic + emerald only
- [ ] Typography creates clear hierarchy without decorative elements
- [ ] Dark mode is the default and looks flawless
- [ ] Light mode is equally polished
- [ ] Every chart has an accessible data table alternative
- [ ] Every interactive element has a visible focus indicator
- [ ] Every animation respects `prefers-reduced-motion`
- [ ] Every empty state has an illustration, message, and CTA
- [ ] Every error state has a clear message and recovery action
- [ ] Dashboard loads with staggered animation
- [ ] Landing page has animated gradient orbs
- [ ] AI coach streams text in real-time
- [ ] Fonts load with zero layout shift (next/font)
- [ ] Touch targets are ≥ 44px on mobile
- [ ] Bottom tab bar has safe area padding on iOS
- [ ] No horizontal scrolling at any viewport width
- [ ] All numbers use `tabular-nums` for alignment
- [ ] Badges unlock with a satisfying micro-animation

---

> [!TIP]
> **For the AI coding agent:** This design brief is the single source of truth for all visual decisions. When in doubt, reference the color tokens (Section 6), typography scale (Section 7), and component specs (Section 13). Every hex color, font size, spacing value, and animation timing is specified — do not invent new values.

---

*Document Version 1.0 — June 8, 2026*
*CarbonSphere AI — Track Smarter. Live Greener.* 🌍
