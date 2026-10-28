# Clarivo (APP NAME) — Design System

Design specification for Clarivo, a personal finance tracker with an AI Copilot.
Theme: Emerald Ledger. Stack: React + Vite, Tailwind CSS, Redux Toolkit, Recharts.

Clarivo uses the Emerald Ledger theme: a calm, trustworthy glassmorphism theme. Frosted cards float over soft emerald and teal light. It ships in a light and a dark mode that share one set of semantic tokens, so components never contain mode-specific colors.

---

## 1. Principles

1. **Numbers come first.** Glass is decoration. Amounts, labels, and chart values must always be legible. Use more opaque glass wherever dense data sits (tables, forms, modals).
2. **One brand, three meanings.** Emerald is the brand. Income is green, expenses are rose, and warnings are amber. Never rely on color alone (see Accessibility).
3. **Semantic tokens only.** Components use `bg-glass`, `text-ink`, `text-expense`. They never use raw hex values or `dark:` color overrides.
4. **Quiet by default.** One primary button per view. Subtle motion. No neon glows on UI elements.
5. **Honest wording.** Use "net cash flow" or "recorded balance", never "bank balance". Sentence case for all UI text.

### 1.1 Brand: Clarivo

Clarivo is an invented name built from "clarity". It describes the product promise: making your recorded money easy to see and understand.

| Element | Specification |
| --- | --- |
| Product name | Clarivo (capital C, rest lowercase; never all caps or "ClariVo") |
| Tagline | "Your money, made clear." |
| AI feature name | Clarivo Copilot (shortened to "Copilot" inside the panel after the first mention) |
| Wordmark | "Clarivo" in Inter 500, 18px in the navbar and sidebar, letter-spacing `-0.01em`, color `ink` |
| Logo mark | 32px rounded-xl tile filled with the brand gradient (`bg-brand`), containing an `on-brand` glyph: an open "C" ring with a small upward tick, suggesting clarity and growth |
| Mark and wordmark spacing | 10px gap; clear space around the lockup equals half the mark height |
| Minimum size | Mark 20px, lockup 96px wide |
| Favicon and app icon | The gradient tile with the "C" glyph at 32, 180, and 512px. The tile is self-contained, so it works on light and dark browser chrome |

Where the name appears:

| Location | Text |
| --- | --- |
| Browser tab (`index.html`) | `Clarivo` (pages use `Dashboard · Clarivo`, `Transactions · Clarivo`, `Budgets · Clarivo`) |
| Login and register pages | Lockup above the form, tagline below it |
| Sidebar and top bar | Lockup at top-left |
| Copilot panel header | "Clarivo Copilot" |
| Copilot empty state | "Ask Clarivo about your spending" |
| PDF export header | "Clarivo — Transaction report" |
| Export filenames | `clarivo-transactions-YYYY-MM-DD.csv` and `clarivo-transactions-YYYY-MM-DD.pdf` |
| README title | `# Clarivo` |
| Backend system prompt, role line | "You are Clarivo Copilot, the AI assistant embedded in the Clarivo personal finance tracker." |

Voice: plain, calm, and precise. Clarivo explains numbers; it does not lecture or celebrate. Avoid slogans in the product UI beyond the tagline on the auth pages.

Before launch, check domain, app store, and trademark availability for the name.

---

## 2. Color tokens

Colors are stored as space-separated RGB channels so Tailwind opacity modifiers (`bg-accent/10`) work.

### 2.1 Core palette

| Token | Purpose | Light | Dark |
| --- | --- | --- | --- |
| `canvas` | Page background | `#ECFDF5` | `#06130F` |
| `ink` | Primary text | `#0F172A` | `#E5E9F5` |
| `ink-soft` | Secondary text | `#475569` | `#97A0B8` |
| `ink-muted` | Hints, captions, placeholders | `#586A82` | `#7C88A5` |
| `accent` | Links, active nav, key figures | `#047857` | `#34D399` |
| `income` | Income amounts and bars | `#059669` | `#34D399` |
| `expense` | Expense amounts, over-budget, delete | `#E11D48` | `#FB7185` |
| `warning` | Near-limit budgets, caution | `#D97706` | `#FBBF24` |
| `info` | Neutral notices | `#0284C7` | `#38BDF8` |

### 2.2 Brand gradients

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `brand-from` / `brand-to` (button) | `#047857` → `#0F766E` | `#10B981` → `#14B8A6` | Primary button background |
| `on-brand` | `#FFFFFF` | `#022C22` | Text on primary button |
| `viz-from` / `viz-to` | `#10B981` → `#14B8A6` | `#10B981` → `#14B8A6` | Logo, progress fills, decorative accents, chart highlights |

The button gradient is deliberately deeper in light mode. White text on the brighter `#10B981` is only about 2.5:1 contrast, which fails WCAG AA. The deeper gradient reaches roughly 5.5:1. In dark mode the bright gradient is kept and paired with dark text (roughly 6:1).

### 2.3 Glass and surface tokens

| Token | Light | Dark |
| --- | --- | --- |
| `glass` (standard card) | `rgb(255 255 255 / 0.60)` | `rgb(255 255 255 / 0.06)` |
| `glass-strong` (modals, tables, tooltips) | `rgb(255 255 255 / 0.78)` | `rgb(255 255 255 / 0.10)` |
| `glass-border` | `rgb(255 255 255 / 0.90)` | `rgb(255 255 255 / 0.12)` |
| `field` (inputs) | `rgb(255 255 255 / 0.70)` | `rgb(255 255 255 / 0.05)` |
| `track` (progress track, gridlines) | `rgb(15 23 42 / 0.08)` | `rgb(255 255 255 / 0.10)` |
| `solid` (fallback without backdrop blur) | `#FFFFFF` | `#0D1F1A` |
| `glow-1` (background blob, emerald) | `rgb(16 185 129 / 0.30)` | `rgb(16 185 129 / 0.35)` |
| `glow-2` (background blob, sky/cyan) | `rgb(56 189 248 / 0.25)` | `rgb(6 182 212 / 0.22)` |
| `shadow-glass` | `0 8px 32px rgb(4 120 87 / 0.10)` | `0 8px 32px rgb(0 0 0 / 0.40)` |

### 2.4 Semantic usage rules

| Meaning | Color | Required companion cue |
| --- | --- | --- |
| Income | `income` | `+` sign and up-arrow icon |
| Expense | `expense` | `−` sign and down-arrow icon |
| Net cash flow | `accent` | Label "Net cash flow" |
| Budget under 75% | `income` | Percentage text |
| Budget 75–99% | `warning` | Percentage text and "Near limit" label |
| Budget 100% or more | `expense` | "Over by ₹X" text |
| Destructive action | `expense` | Confirmation dialog |

Brand emerald and income green share a hue. Keep them apart by role: the brand gradient is only for buttons, logo, and progress fills. Income values always carry a `+` and an arrow.

---

## 3. Chart palette

Recharts needs real color strings, not Tailwind classes. Use the hook in section 12 to read the active values.

### 3.1 Income vs expense (bar and line)

| Series | Light | Dark |
| --- | --- | --- |
| Income | `#059669` | `#34D399` |
| Expense | `#E11D48` | `#FB7185` |
| Net cash flow line | `#0F766E` | `#2DD4BF` |

Bars have rounded tops (`radius={[6, 6, 0, 0]}`), and the two series in a month are 4px apart.

### 3.2 Expense category pie

| Category | Light | Dark |
| --- | --- | --- |
| `food_dining` | `#D97706` | `#FBBF24` |
| `housing` | `#4F46E5` | `#818CF8` |
| `transportation` | `#0284C7` | `#38BDF8` |
| `utilities` | `#0891B2` | `#22D3EE` |
| `healthcare` | `#E11D48` | `#FB7185` |
| `shopping` | `#7C3AED` | `#A78BFA` |
| `entertainment` | `#DB2777` | `#F472B6` |
| `education` | `#0D9488` | `#2DD4BF` |
| `travel` | `#EA580C` | `#FB923C` |
| `subscriptions` | `#C026D3` | `#E879F9` |
| `personal_care` | `#65A30D` | `#A3E635` |
| `debt_payment` | `#78716C` | `#A8A29E` |
| `other_expense` | `#64748B` | `#94A3B8` |

Rules:
- A category always keeps the same color everywhere (pie, legend, budget rows, transaction badges).
- Show a legend with labels and values. Do not rely on color alone.
- Group slices under 3% into "Other" when the pie has more than 8 slices.
- Income categories use shades of emerald and teal (`#059669`, `#0D9488`, `#10B981`, `#14B8A6`, `#34D399`, `#2DD4BF`, `#6EE7B7`).

### 3.3 Chart chrome

- Gridlines: `track` color, 1px, horizontal only.
- Axis text: `ink-muted`, 12px.
- Tooltip: `glass-strong` surface, `glass-border`, 12px radius, `ink` text, amounts in `tabular-nums`.
- Empty chart: dashed `glass-border` outline with an icon and "No data for this period".

---

## 4. Typography

**Font:** Inter (variable), with fallback `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`.

| Role | Size / line height | Weight | Tailwind |
| --- | --- | --- | --- |
| Page title | 24px / 32px | 500 | `text-2xl font-medium` |
| Section title | 18px / 28px | 500 | `text-lg font-medium` |
| Card title | 15px / 24px | 500 | `text-[15px] font-medium` |
| Body | 14px / 22px | 400 | `text-sm` |
| Caption, labels | 12px / 18px | 400 | `text-xs text-ink-soft` |
| Summary figure | 28px / 36px | 500 | `text-[28px] font-medium tabular-nums` |
| Table figure | 14px / 22px | 500 | `text-sm font-medium tabular-nums` |

Rules:
- Two weights only: 400 and 500. No bold (700) and no italics for emphasis.
- All amounts use `tabular-nums` so columns align.
- No text below 12px.
- Format currency with `Intl.NumberFormat('en-IN', { style: 'currency', currency })`. Convert `amountMinor` to a decimal at the display boundary only.
- Use sentence case everywhere: "Add transaction", not "Add Transaction".

---

## 5. Shape, spacing, and elevation

| Token | Value | Tailwind |
| --- | --- | --- |
| Card radius | 16px | `rounded-2xl` |
| Control radius (inputs, buttons) | 12px | `rounded-xl` |
| Badge and chip radius | 8px | `rounded-lg` |
| Pill radius (toggle, filters) | 9999px | `rounded-full` |
| Card padding | 20px (16px on mobile) | `p-5 max-sm:p-4` |
| Grid gap | 16px (24px on desktop) | `gap-4 lg:gap-6` |
| Page max width | 1280px | `max-w-7xl` |
| Minimum touch target | 44px | `min-h-11` |

### Glass levels

| Level | Blur | Fill | Use |
| --- | --- | --- | --- |
| `glass` | 16px | `glass` | Summary cards, chart cards, budget cards, Copilot messages |
| `glass-strong` | 24px | `glass-strong` | Navbar, sidebar, modals, drawers, Copilot panel, tooltips, transaction table |
| `solid` | none | `solid` | Fallback when `backdrop-filter` is unsupported, and the mobile low-power fallback |

Only two floating layers should be visible at once (for example, a modal over the page). Do not stack glass on glass more than one level deep, because blur compounds and hurts legibility.

---

## 6. Tailwind and CSS implementation

### 6.1 `tailwind.config.js` (Tailwind v3)

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent) / <alpha-value>)',
        income: 'rgb(var(--income) / <alpha-value>)',
        expense: 'rgb(var(--expense) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        'on-brand': 'rgb(var(--on-brand) / <alpha-value>)',
        glass: 'var(--glass)',
        'glass-strong': 'var(--glass-strong)',
        'glass-border': 'var(--glass-border)',
        field: 'var(--field)',
        track: 'var(--track)',
        solid: 'var(--solid)',
      },
      backgroundImage: {
        brand: 'linear-gradient(135deg, rgb(var(--brand-from)), rgb(var(--brand-to)))',
        viz: 'linear-gradient(90deg, rgb(var(--viz-from)), rgb(var(--viz-to)))',
      },
      boxShadow: {
        glass: 'var(--shadow-glass)',
      },
      backdropBlur: { glass: '16px', 'glass-strong': '24px' },
      transitionDuration: { DEFAULT: '150ms' },
    },
  },
  plugins: [],
};
```

On Tailwind v4, move the same tokens into an `@theme` block in the CSS file and use `@custom-variant dark (&:where(.dark, .dark *));`.

### 6.2 `src/styles/theme.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --canvas: 236 253 245;
  --ink: 15 23 42;
  --ink-soft: 71 85 105;
  --ink-muted: 88 106 130;
  --accent: 4 120 87;
  --income: 5 150 105;
  --expense: 225 29 72;
  --warning: 217 119 6;
  --info: 2 132 199;

  --brand-from: 4 120 87;
  --brand-to: 15 118 110;
  --on-brand: 255 255 255;
  --viz-from: 16 185 129;
  --viz-to: 20 184 166;

  --glass: rgb(255 255 255 / 0.6);
  --glass-strong: rgb(255 255 255 / 0.78);
  --glass-border: rgb(255 255 255 / 0.9);
  --field: rgb(255 255 255 / 0.7);
  --track: rgb(15 23 42 / 0.08);
  --solid: #ffffff;
  --glow-1: rgb(16 185 129 / 0.3);
  --glow-2: rgb(56 189 248 / 0.25);
  --shadow-glass: 0 8px 32px rgb(4 120 87 / 0.1);
  color-scheme: light;
}

.dark {
  --canvas: 6 19 15;
  --ink: 229 233 245;
  --ink-soft: 151 160 184;
  --ink-muted: 124 136 165;
  --accent: 52 211 153;
  --income: 52 211 153;
  --expense: 251 113 133;
  --warning: 251 191 36;
  --info: 56 189 248;

  --brand-from: 16 185 129;
  --brand-to: 20 184 166;
  --on-brand: 2 44 34;
  --viz-from: 16 185 129;
  --viz-to: 20 184 166;

  --glass: rgb(255 255 255 / 0.06);
  --glass-strong: rgb(255 255 255 / 0.1);
  --glass-border: rgb(255 255 255 / 0.12);
  --field: rgb(255 255 255 / 0.05);
  --track: rgb(255 255 255 / 0.1);
  --solid: #0d1f1a;
  --glow-1: rgb(16 185 129 / 0.35);
  --glow-2: rgb(6 182 212 / 0.22);
  --shadow-glass: 0 8px 32px rgb(0 0 0 / 0.4);
  color-scheme: dark;
}

@layer base {
  body {
    @apply bg-canvas font-sans text-sm text-ink antialiased;
  }
  :focus-visible {
    @apply outline-none ring-2 ring-accent ring-offset-2 ring-offset-canvas;
  }
}

@layer components {
  .glass {
    @apply rounded-2xl border border-glass-border bg-glass shadow-glass backdrop-blur-glass;
  }
  .glass-strong {
    @apply rounded-2xl border border-glass-border bg-glass-strong shadow-glass backdrop-blur-glass-strong;
  }
  .btn {
    @apply inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition active:scale-[0.98];
  }
  .btn-primary {
    @apply btn bg-brand text-on-brand hover:brightness-110;
  }
  .btn-secondary {
    @apply btn border border-glass-border bg-glass text-ink hover:bg-glass-strong;
  }
  .btn-ghost {
    @apply btn text-ink-soft hover:bg-glass hover:text-ink;
  }
  .btn-danger {
    @apply btn bg-expense text-white hover:brightness-110;
  }
  .input {
    @apply min-h-11 w-full rounded-xl border border-glass-border bg-field px-3 text-ink placeholder:text-ink-muted;
  }
}

@supports not (backdrop-filter: blur(1px)) {
  .glass,
  .glass-strong {
    background: var(--solid);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

The `btn-danger` text is white on `expense`. In dark mode `#FB7185` with white text is low contrast, so override with `dark:text-[#2A0A12]` or use the secondary button with an `expense`-colored label for destructive actions.

### 6.3 Animated background (`AppBackground.jsx`)

```jsx
export default function AppBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      <div
        className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'var(--glow-1)' }}
      />
      <div
        className="absolute -bottom-32 -right-24 h-[460px] w-[460px] rounded-full blur-3xl"
        style={{ background: 'var(--glow-2)' }}
      />
    </div>
  );
}
```

Mount it once in the root layout. Use `max-md:hidden` on the second blob if mobile performance suffers.

---

## 7. Theme switching

Storage: `localStorage` key `theme` with values `light` or `dark`. No database field is needed.

Prevent a flash of the wrong theme by adding this inline script in `index.html` before the app bundle:

```html
<script>
  try {
    var t = localStorage.getItem('theme');
    var dark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
</script>
```

Hook:

```js
// src/hooks/useTheme.js
import { useCallback, useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}
```

Toggle button: pill-shaped `glass` button with a sun icon in dark mode and a moon icon in light mode. It needs `aria-label="Switch to dark mode"` (or light) and `aria-pressed` reflecting the current state.

---

## 8. Layout

| Breakpoint | Layout |
| --- | --- |
| Under 640px (mobile) | Top bar with menu button, content in one column, bottom padding for safe areas, tables become `TransactionCard` lists |
| 640–1023px (tablet) | Top bar, two-column card grid, collapsible drawer navigation |
| 1024px and up (desktop) | Fixed `glass-strong` sidebar (240px), main content in a 12-column grid |

Dashboard grid (desktop):
- Row 1: three summary cards (income, expenses, net cash flow), each 4 columns.
- Row 2: monthly trends bar chart (8 columns) and category pie (4 columns).
- Row 3: budget progress (5 columns) and recent transactions (7 columns).
- Copilot: a floating button at bottom-right opens a right-hand drawer (420px wide on desktop, full screen on mobile).

Navigation items: Dashboard, Transactions, Budgets. The active item has `bg-accent/10 text-accent` and a 2px `accent` left indicator.

---

## 9. Components

### 9.1 Summary card
`glass`, padding 20px. Label in caption style, figure in summary style, then a trend line (`+12% vs last month`) in `income` or `expense` with an arrow icon. Net cash flow uses `accent` for the figure. Include a small icon tile (36px, `rounded-xl`, `bg-accent/10 text-accent`).

### 9.2 Buttons
- Primary: `btn-primary`. One per view.
- Secondary: `btn-secondary`. Default for most actions.
- Ghost: `btn-ghost`. Toolbars, icon buttons.
- Danger: only in confirmation dialogs.
- Loading state: spinner replaces the label text width-stable, button stays enabled but ignores repeated clicks.
- Labels are verb-first, 1–3 words: "Add transaction", "Export CSV", "Save budget".

### 9.3 Form controls
- Inputs use `.input`. The label sits above in caption style, and helper or error text sits below at 12px.
- Error state: `border-expense`, message in `text-expense` with an icon, and `aria-invalid="true"`.
- Amount field: prefix with the currency symbol, right-aligned digits, `tabular-nums`.
- Type selector (income or expense): segmented control, pill-shaped. The active segment uses `bg-brand text-on-brand`.
- Category select shows only categories valid for the selected type.
- Date range filter: two date inputs plus quick pills (This month, Last month, Last 3 months, Custom).

### 9.4 Transaction table (desktop)
`glass-strong`, sticky header, 52px rows, row hover `bg-accent/5`, dividers `border-glass-border`. Columns: Date, Category (colored dot and label), Notes (truncate with tooltip), Amount (right-aligned, colored, signed), Actions. On mobile use `TransactionCard`: category dot and name on the left, amount on the right, date and notes below.

### 9.5 Category badge
`rounded-lg px-2 py-0.5 text-xs`, a 8px dot in the category chart color, label in `ink-soft`, background `bg-track`.

### 9.6 Budget progress row
Label and `₹spent / ₹limit` on one line, then a 8px `rounded-full` track (`bg-track`) with a fill. Fill is `bg-viz` under 75%, `bg-warning` for 75–99%, and `bg-expense` at 100% or more (capped at 100% width). Text below: "₹X left" or "Over by ₹X".

### 9.7 Modals and delete confirmation
`glass-strong`, max width 440px, centered, scrim `bg-black/40` with `backdrop-blur-sm`. Focus is trapped, Escape closes, and the destructive button is on the right with the cancel button on its left. Copy is specific: "Delete this transaction? This can't be undone."

### 9.8 Toasts (React Toastify)
`glass-strong` surface, 12px radius, a left icon in the semantic color, top-right on desktop and top-center on mobile. Examples: "Transaction added", "Couldn't export your transactions. Try again." Avoid "successfully" and exclamation marks.

### 9.9 Loading, empty, and error states
- Loading: skeleton blocks with `bg-track` and a slow pulse, matching the final layout height to avoid layout shift.
- Empty: centered icon tile, headline that invites action ("Add your first transaction"), one line of explanation, one primary button.
- Error: `glass` card with an `expense` icon, a plain-language message, and a "Try again" button. Never show stack traces or raw backend messages.

### 9.10 AI Copilot panel
- Container: `glass-strong` drawer, header with title "Clarivo Copilot", a clear-chat ghost button, and a close button.
- User messages: right-aligned, `bg-brand text-on-brand`, radius `16px 16px 4px 16px`.
- Copilot messages: left-aligned, `bg-field border border-glass-border`, radius `16px 16px 16px 4px`, text in `ink`. Amounts use `tabular-nums`. Small tables render with `track` row dividers.
- Input row: `.input` plus a square 44px send button (`btn-primary`).
- Suggested questions: pill chips under the empty state ("How much did I spend this month?").
- Loading: three-dot typing indicator in `ink-muted`.
- Privacy notice: a 12px `ink-muted` line below the input: "Your question and the minimum required financial context may be sent to the configured AI provider."
- Responses are rendered as text or safe Markdown only. Never render raw HTML from the model.

### 9.11 Export controls
A secondary button with a download icon and a small menu ("Download CSV", "Download PDF"). The menu lists the active filters so the user knows what will be exported.

---

## 10. Motion

| Interaction | Duration | Easing |
| --- | --- | --- |
| Hover, focus, button press | 150ms | `ease-out` |
| Drawer and modal enter | 200ms | `ease-out` (fade and 8px translate) |
| Chart enter | 400ms | `ease-out` (disable under reduced motion) |
| Theme change | 200ms color transition on `body` only | `ease` |

No bouncing, parallax, or looping decorative animation. All motion respects `prefers-reduced-motion`.

---

## 11. Accessibility

- Text contrast of at least 4.5:1 for body text and 3:1 for large text and UI boundaries, in both modes. Verify final values with a contrast checker after any palette change, especially text over the translucent glass.
- Focus ring is a 2px `accent` ring with an offset, visible on every interactive element.
- Do not rely on color alone: amounts carry `+` or `−` signs and icons, budget states carry text, pie slices have a legend.
- Charts have a text summary or a "View as table" option for screen readers, and `role="img"` with an `aria-label` on each chart container.
- Touch targets are at least 44px.
- Form errors are linked with `aria-describedby`, and toasts use `role="status"` (or `role="alert"` for errors).
- Modals trap focus and return focus to the trigger on close.
- Respect `prefers-reduced-motion` and `prefers-color-scheme` (first visit only).

---

## 12. Reading theme colors in Recharts

```js
// src/hooks/useChartColors.js
import { useMemo } from 'react';
import { useTheme } from './useTheme';

const read = (name) => `rgb(${getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace(/ /g, ' ')})`;

export function useChartColors() {
  const { theme } = useTheme();
  return useMemo(
    () => ({
      income: read('--income'),
      expense: read('--expense'),
      accent: read('--accent'),
      inkMuted: read('--ink-muted'),
      grid: getComputedStyle(document.documentElement).getPropertyValue('--track').trim(),
    }),
    [theme]
  );
}
```

Pass these to `fill`, `stroke`, and tick styles. Recomputing on `theme` means charts re-theme instantly when the toggle is used. Category colors come from a `CATEGORY_COLORS` map in `src/utils/categoryColors.js` with `{ light, dark }` values from section 3.2.

---

## 13. Do and don't

| Do | Don't |
| --- | --- |
| Use semantic tokens (`bg-glass`, `text-income`) | Hardcode hex values or write `dark:bg-slate-900` in components |
| Use `glass-strong` for tables, modals, and the Copilot panel | Put dense text on the lightest glass over a bright glow |
| Pair color with a sign, icon, or label | Show income and expenses with color only |
| Keep one primary button per view | Use gradient buttons for every action |
| Use `tabular-nums` on all money values | Mix proportional and tabular digits in one column |
| Keep category colors consistent app-wide | Assign colors by order in the list |
| Say "net cash flow" or "recorded balance" | Say "bank balance" |
| Use sentence-case labels and specific error messages | Use title case, "Oops!", or raw error strings |

---

## 14. File map

```
frontend/src/
├── styles/
│   └── theme.css              # tokens + component classes (section 6.2)
├── hooks/
│   ├── useTheme.js            # theme toggle (section 7)
│   └── useChartColors.js      # chart colors (section 12)
├── utils/
│   ├── categoryColors.js      # category → { light, dark }
│   └── formatCurrency.js      # Intl.NumberFormat en-IN helper
├── components/
│   ├── ui/                    # Button, Input, Card, Badge, Modal, Skeleton, Toggle, Logo
│   ├── charts/                # TrendsChart, CategoryPie, ChartTooltip
│   └── copilot/               # CopilotPanel and related components
└── layouts/
    ├── AppBackground.jsx      # glow blobs (section 6.3)
    └── AppLayout.jsx          # sidebar, top bar, drawer
tailwind.config.js             # section 6.1
index.html                     # theme pre-paint script (section 7), <title>Clarivo</title>, favicon links
```

---

## 15. Acceptance checklist

- [ ] Toggling the theme updates every page, chart, table, modal, and the Copilot panel without a reload.
- [ ] The chosen theme persists after refresh and does not flash the wrong theme on load.
- [ ] No component contains a raw hex color or a `dark:` color override.
- [ ] All text and UI boundaries pass contrast checks in both modes.
- [ ] Income, expense, and budget states are understandable in grayscale.
- [ ] Charts re-theme on toggle and keep consistent category colors.
- [ ] The layout works at 360px, 768px, and 1280px widths.
- [ ] Glass degrades to solid surfaces when `backdrop-filter` is unsupported.
- [ ] Reduced-motion users see no animation beyond instant state changes.
- [ ] The name "Clarivo" appears consistently in the browser title, navbar, auth pages, Copilot panel, PDF header, export filenames, and README.