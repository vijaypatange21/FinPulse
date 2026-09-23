# Design System — Lending Platform UI Overhaul

> Re-skin spec. Logic/data/routes unchanged — this doc governs visual layer only: tokens, layout, components, motion. Built for direct use by a coding agent doing a UI migration on an existing app.

---

## 0. Source Reference — What Each Image Contributes

Two references were provided. They are **not** blended 50/50 — each owns a specific job:

| Reference | Contributes | Does NOT contribute |
|---|---|---|
| **Image 1** (dark invoices dashboard) | Full visual language for **both** themes: color palette, typography feel, card geometry, badge style, detail-panel pattern, button style, glow/accent treatment | Layout structure (its top pill-tab nav is replaced) |
| **Image 2** (light sidebar dashboard) | **Layout only**: the floating collapsible left sidebar (icon-rail ↔ labeled-rail), bento grid arrangement of stat cards | Its color palette (sage/cream) — not used. Its typography — not used. |

Rationale: you asked for "same theme like font and all things" from image 1, and explicitly said the light theme should still trace back to that same reference ("dark theme must be same"). Image 2 is called out only for the sidebar. So both themes share one color/type identity (tuned per-theme for contrast); the sidebar shape comes from image 2 but is re-colored to match.

---

## 1. Design Principles

1. **One accent, used with discipline.** A single lime-acid accent carries every "this matters" moment — primary CTAs, active nav state, positive status. It is not sprinkled decoratively.
2. **Dark is canonical.** The dark theme is the reference truth (locked per §2.1). Light theme (§2.2) is a deliberate re-derivation, not an inversion filter.
3. **Contrast-panel pattern.** Image 1's trick — a light "island" card floating inside a dark shell for the detail/list panel — is the signature move. We keep it in both themes by making it an *inverse* panel (opposite of the theme's canvas color), so it always reads as "the important thing."
4. **Numbers are the hero.** This is a money app. Every amount uses tabular figures, generous size, and gets a beat of motion when it changes (count-up), never a static swap.
5. **Motion answers actions, not idle time.** Sidebar collapse, tab switch, row expand, drawer open — motion explains *what changed*. One orchestrated stagger reveal on first dashboard paint is the only non-triggered motion allowed.
6. **Sidebar is permanent chrome.** Both roles (Lender, Borrower) live inside the same shell; only the nav item set changes.

---

## 2. Design Tokens

### 2.1 Color — Dark Theme (default, canonical)

| Token | Value | Use |
|---|---|---|
| `--bg-canvas` | `#0D0F14` | App background |
| `--bg-surface` | `#15181F` | Standard cards |
| `--bg-surface-raised` | `#1C2029` | Nested/hover cards, inputs |
| `--bg-inverse-panel` | `#F6F5F1` | Contrast panel (detail views, list-over-dark pattern) |
| `--text-primary` | `#F5F5F2` | Headings, body on dark |
| `--text-secondary` | `#8B8F98` | Labels, captions, metadata |
| `--text-on-inverse` | `#14161B` | Text sitting on `--bg-inverse-panel` |
| `--text-on-accent` | `#0E1206` | Text on accent-filled elements |
| `--accent` | `#C9FF4D` | Primary CTA, active nav, key highlights |
| `--accent-hover` | `#B8F02F` | Accent pressed/hover |
| `--accent-glow` | `rgba(201,255,77,0.18)` | Hover glow / focus ring |
| `--border-subtle` | `rgba(255,255,255,0.07)` | Card/divider borders |
| `--status-pending` | `#F5A623` | Pending review |
| `--status-info` | `#5B9BFF` | Under review / info |
| `--status-positive` | `#34D1A3` | Approved / disbursed |
| `--status-negative` | `#FF6B6B` | Rejected / overdue |

### 2.2 Color — Light Theme

Same hue family, re-tuned for AA contrast on a light canvas — not a naive invert.

| Token | Value | Use |
|---|---|---|
| `--bg-canvas` | `#F4F3EE` | App background (warm off-white, not stark white) |
| `--bg-surface` | `#FFFFFF` | Standard cards |
| `--bg-surface-raised` | `#FBFAF6` | Nested/hover cards, inputs |
| `--bg-inverse-panel` | `#14161B` | Contrast panel — now dark-on-light, inverse of §2.1 |
| `--text-primary` | `#14161B` | Headings, body |
| `--text-secondary` | `#6B6F76` | Labels, captions |
| `--text-on-inverse` | `#F5F5F2` | Text on `--bg-inverse-panel` |
| `--text-on-accent` | `#0E1206` | Text on accent-filled elements |
| `--accent` | `#7FA829` | Deepened/desaturated lime — same hue as dark accent, darkened ~35% for contrast on light bg |
| `--accent-hover` | `#6E9422` | Accent pressed/hover |
| `--accent-glow` | `rgba(127,168,41,0.14)` | Hover glow / focus ring |
| `--border-subtle` | `rgba(20,22,27,0.08)` | Card/divider borders |
| `--status-pending` | `#B9770E` | Pending review |
| `--status-info` | `#3A6FD1` | Under review / info |
| `--status-positive` | `#1F9C77` | Approved / disbursed |
| `--status-negative` | `#D9484B` | Rejected / overdue |

Status colors are darkened from their dark-theme counterparts for the same AA-on-light reason — never reuse dark-theme hex values directly on light backgrounds.

### 2.3 Typography

| Role | Family | Notes |
|---|---|---|
| Display / headings / big stat numbers | **Clash Display** (Fontshare, free, variable) | Geometric, confident — matches image 1's bold headline character. Self-host in production. |
| UI text / body / table data / labels | **Satoshi** (Fontshare, free, variable) | Clean grotesk, excellent numeral legibility. |

All monetary figures: `font-variant-numeric: tabular-nums` app-wide, no exceptions — amounts must not jitter in width when they update.

Type scale:

| Token | Size / Line | Weight | Family | Used for |
|---|---|---|---|---|
| `--text-display` | 48 / 56 | 600 | Clash Display | Hero dashboard figure |
| `--text-h1` | 32 / 40 | 600 | Clash Display | Page title |
| `--text-h2` | 22 / 28 | 500 | Clash Display | Section title |
| `--text-h3` | 16 / 22 | 500 | Satoshi | Card title |
| `--text-stat` | 28 / 32 | 600 | Clash Display, tabular-nums | Stat card figures |
| `--text-body` | 14 / 20 | 400 | Satoshi | Body copy |
| `--text-label` | 12 / 16 | 500 | Satoshi, +0.01em tracking | Field labels, table headers |

Labels are set in **sentence case**, never all-caps — image 1 itself uses sentence case for its stat labels ("Overdue", "Due within next month"); keep that.

### 2.4 Spacing & Radius

Spacing (8px base — generous, not cramped):
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

Radius:

| Token | Value | Used for |
|---|---|---|
| `--radius-xs` | 8px | Chips, small badges |
| `--radius-sm` | 12px | Buttons, inputs |
| `--radius-md` | 16px | Compact cards |
| `--radius-lg` | 24px | Primary cards (matches image 1's card rounding) |
| `--radius-xl` | 32px | Page-level panels, sidebar shell |
| `--radius-pill` | 999px | Status badges, segmented tabs, primary buttons |

### 2.5 Elevation & Glass

No generic `rgba(0,0,0,.1)` soft-shadow-on-everything. Two elevation moves only:

- **Dark theme lift:** `box-shadow: 0 12px 32px rgba(0,0,0,0.35)`; on hover, add `0 0 0 1px var(--accent-glow)` — a glow, not a bigger shadow.
- **Light theme lift:** `box-shadow: 0 8px 24px rgba(20,18,10,0.06)` — warm-toned, not neutral grey.
- **Glass** (sidebar, top bar only): `backdrop-filter: blur(20px)`, surface color at 80% opacity, 1px `--border-subtle` edge. Reserve glass for floating chrome, not content cards — keeps the SaaS-kit sameness out of the main grid.

### 2.6 Iconography

Lucide icons, 1.5px stroke, 20px default / 18px in dense table rows. No mixed icon sets.

---

## 3. Layout Architecture

### 3.1 App Shell

```
┌─┬──────────────────────────────────────────────┐
│S│  Top bar: page title · search · bell · avatar │
│I├──────────────────────────────────────────────┤
│D│                                                │
│E│   Bento stat row (2–4 cards)                  │
│B│                                                │
│A│   ┌───────────────┐  ┌──────────────────────┐ │
│R│   │ List / table   │  │ Inverse detail panel │ │
│ │   │ (dark surface) │  │ (light island)        │ │
│ │   └───────────────┘  └──────────────────────┘ │
└─┴──────────────────────────────────────────────┘
```

Sidebar floats with 16px inset from viewport edges, full height minus insets, `--radius-xl`, glass surface. Content area sits in a 12-column grid, 24px gutter, 32px outer margin.

### 3.2 Sidebar Navigation (image 2's contribution)

| State | Width | Content |
|---|---|---|
| Collapsed | 84px | Icon only, centered in 44px circular hit target |
| Expanded | 264px | Icon + label, left-aligned, 44px row height |

- Transition: `width 320ms cubic-bezier(0.22, 1, 0.36, 1)`. Labels fade + translateX(-8px→0) in, starting at 40% of the width transition, over 160ms — so text never smears mid-resize.
- Toggle: explicit chevron button pinned at top of sidebar (not hover-triggered — predictable, not twitchy). Collapsed state still shows a tooltip on hover (400ms delay, 150ms fade) with the label.
- Active item: sliding pill highlight using a shared-layout animation (e.g. Framer Motion `layoutId`) so the highlight *moves* between items rather than popping — `--accent` at 14% fill (dark) / 10% fill (light) + a 3px left accent bar when expanded.
- Structure top→bottom: mark/logo (icon-only when collapsed) → collapse toggle → primary nav group → hairline divider → secondary group (Settings, Help) → bottom-anchored user chip (avatar + name + role badge when expanded, avatar + status dot only when collapsed).
- Auto-collapses at ≤1024px viewport; becomes an off-canvas drawer with scrim below 640px.

**Nav sets (per role):**

*Borrower:* Dashboard · My Loans · Apply for Loan · Repayments · Documents/KYC · Notifications · Settings
*Lender:* Dashboard · Applications · Approvals · Portfolio · Borrowers · Analytics · Settings

Role is fixed per logged-in account — the nav set is not user-toggleable, just data-driven off the session role.

### 3.3 Top Bar

Replaces image 1's pill tab-bar (that job now belongs to the sidebar). Top bar holds: page title (left), global search (center-left, `--radius-pill` input), notification bell with unread dot, avatar menu (right). Contextual page actions (e.g. "+ New Application", "Export") sit right-aligned below the title as a secondary row, using the same pill-button styling image 1 used for its icon row.

Where a page genuinely needs sub-tabs (e.g. Loans: All / Active / Pending / Closed), reuse image 1's rounded pill-group control as a **local segmented control**, not as primary navigation.

### 3.4 Bento Grid

Stat cards follow a bento pattern: 3 quiet cards (bg-surface) + 1 contrast card (solid `--accent` or `--bg-inverse-panel` fill) per row, mirroring image 2's "Activity" card treatment. The contrast card is reserved for the single most important number on that page (e.g. "Outstanding Balance").

---

## 4. Core Components

| Component | Spec |
|---|---|
| **Stat card** | `--radius-lg`, `--bg-surface`, 24px padding. Label (`--text-label`, secondary) → figure (`--text-stat`) → optional sparkline/delta below. |
| **Contrast card** | Same shape, filled `--accent` or `--bg-inverse-panel`; text flips to `--text-on-accent` / `--text-on-inverse`. |
| **Data table / list row** | 56px row height, avatar/icon + primary label + metadata + status badge + amount (right-aligned, tabular-nums). Selected row = full pill highlight in `--bg-inverse-panel`, matching image 1's selected-invoice treatment. |
| **Status badge** | `--radius-pill`, 12% tint background of its status color, dot + label, sentence case. |
| **Inverse detail panel** | The image-1 "light island" pattern, kept as `--bg-inverse-panel` in *both* themes. Holds: entity header (avatar/logo + name + status), breakdown line items with amounts, subtotal/total/balance rows, primary action button pinned bottom-right. |
| **Loan account card** | Repurposes image 2's stacked credit-card visual: two offset rounded cards, front shows masked loan ID (`•••• 4471`), lender mark, outstanding balance; back card peeks behind in a muted tone. Ghost "View Statement" button below, echoing "Add New Card +". |
| **Repayment progress ring** | Repurposes image 2's gauge: circular progress, track in `--bg-surface-raised`, stroke in `--accent`, center shows `%` + "3 of 24 EMIs paid" subtext. |
| **Tenure timeline** | Repurposes image 1's Sep–Oct–Nov–Dec dotted bar as a horizontal repayment schedule: filled segment = paid months, pulsing dot = current month, muted = upcoming, per-tick tooltip shows EMI amount/date. |
| **Buttons** | Primary: `--radius-pill`, `--accent` fill, `--text-on-accent`, magnetic hover (button translates ≤6px toward cursor within its bounds) + glow. Secondary: outline, `--border-subtle`. Ghost: text-only, underline on hover. |
| **Avatar stack** | Overlapping 32px circles, 2px canvas-color ring, +N overflow chip — used for multi-party items (co-borrowers, loan officers). |
| **Modal / drawer** | Slides in from right, `--bg-inverse-panel`, `--radius-xl` on the leading edge, scrim behind at 40% opacity. |
| **Empty state** | Icon + one direct sentence in the interface's voice + primary action. No illustration clichés. |
| **Loading skeleton** | Shimmer sweep on `--bg-surface-raised` blocks matching final content geometry — never a generic spinner for list/table loads. |

---

## 5. Motion & Interaction System

| Token | Value |
|---|---|
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-spring` | spring(stiffness 300, damping 30) |
| `--dur-fast` | 120ms |
| `--dur-base` | 220ms |
| `--dur-slow` | 320ms |

- **Sidebar collapse/expand:** see §3.2.
- **Nav active indicator:** shared-layout slide, `--dur-base`, `--ease-standard`.
- **Dashboard first paint:** one staggered reveal only — stat cards fade+translateY(12px→0), 60ms stagger, `--dur-base`. Does not repeat on every scroll or re-render.
- **Card hover:** glow ring fade-in `--dur-fast`; no lift/scale on every card — reserve scale for genuinely interactive cards (loan account card, apply-CTA).
- **Number count-up:** on value change, animate digits over `--dur-slow` with `--ease-standard`, not an instant swap.
- **Row expand / drawer open:** height/width spring via `--ease-spring`, content cross-fades in after container settles ~50%.
- **Chart draw-in:** line/area charts draw left→right once on mount, `--dur-slow`, not on every re-render.
- **Scroll:** momentum smoothing (e.g. Lenis) applied to long list/table regions and any marketing/onboarding screens only — not needed for the fixed-viewport dashboard shell itself.
- **Reduced motion:** all of the above collapse to opacity-only crossfades under `prefers-reduced-motion`.

---

## 6. Theming Mechanism

- Tokens as CSS custom properties on `:root`, redefined under `[data-theme="light"]`. Dark values (§2.1) are the default/undecorated selector — treat them as the source of truth; any future token change starts from the dark set and is re-derived into light, never the reverse.
- Component code references tokens only (`bg-[var(--bg-surface)]` etc. if using Tailwind arbitrary values, or map tokens into `tailwind.config` theme.extend.colors) — no hardcoded hex in components.
- Theme toggle persists to user preference (local storage / account setting), defaults to dark.

---

## 7. Page Application Map

| Page | Key components used |
|---|---|
| Dashboard (both roles) | Bento stat row, contrast card, tenure timeline, repayment progress ring, recent-activity list |
| Loan Applications (list) | Data table, status badges, local segmented control, inverse detail panel on row select |
| Loan Detail | Inverse detail panel, loan account card, repayment progress ring |
| Apply for Loan (form) | Multi-step form in inverse panel, progress stepper using the pill-tab visual language |
| Repayments / EMI schedule | Tenure timeline, data table, count-up amounts |
| Approvals queue (Lender) | Data table with bulk-select, inverse detail panel with Approve/Reject primary+secondary buttons |
| Documents / KYC | Upload cards, status badges, empty state pattern |
| Settings / Profile | Standard cards, avatar, theme toggle |

---

## 8. Implementation Notes for Agent

- Do not restructure data flow, routing, or state — this is a re-skin. Swap class names/styles and wrap existing markup in the new shell.
- Recommended additions if not already present: Framer Motion (layout animations, shared-layout nav indicator), Lucide React (icons), Lenis (scroll smoothing on list-heavy pages only), Clash Display + Satoshi self-hosted via `@font-face`.
- Centralize tokens in one file (`tokens.css` or Tailwind theme extension) before touching components — every other change should read from it.
- Migration order: tokens → app shell (sidebar + top bar) → stat/bento components → table/list + inverse panel pattern → forms/modals → motion pass last, once static states are correct.

---

## 9. Accessibility & Quality Bar

- All text meets AA contrast against its actual background (light-theme accent, §2.2, was tuned specifically for this).
- Visible keyboard focus ring using `--accent-glow` on every interactive element, including collapsed sidebar icons.
- Sidebar collapse state, active nav item, and status badges all carry a non-color signal too (icon, text) — not color alone.
- `prefers-reduced-motion` honored per §5.

---

## 10. Do / Don't

| Do | Don't |
|---|---|
| One accent, used sparingly for the thing that matters most on screen | Rainbow-code every status/category with its own hue |
| Sentence-case labels | Tracked-out ALL-CAPS eyebrows |
| Motion tied to an action or one load-time reveal | Fade-slide-up on every card, on every render |
| Inverse panel reserved for the "this is the focused thing" moment | Using the light-island pattern for every card (dilutes it) |
| Tabular-nums on every amount | Letting currency figures reflow/jitter |
