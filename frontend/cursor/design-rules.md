# Airier Design Rules

**Philosophy:** Simple, clean, and modern. Prioritize clarity and trust over decoration. Think Wealthsimple: confident use of space, clear hierarchy, one strong accent, no visual noise. Every element should earn its place.

---

## 1. Layout & structure

- **Page container:** Use a constrained width and center content. Prefer `max-w-6xl` or `max-w-7xl mx-auto` for list/dashboard pages; `max-w-3xl` for focused flows (e.g. Settings).
- **Main content area:** Wrap page content in `DashboardLayout`; inner content uses `<main className="flex-1 p-6">`. Keep consistent horizontal padding (`p-6`).
- **Page header pattern:** One primary title (`text-3xl font-semibold text-foreground`) and one short supporting line (`text-muted-foreground mt-1`). Put primary actions (e.g. “Add Property”) on the right with a `Button`.
- **Sections:** Group related UI in clear blocks. Use `mb-6` or `mb-8` between major sections. Avoid nesting more than needed.

---

## 2. Color & semantic tokens

Use CSS variables / Tailwind semantic colors only. Do not introduce new raw hex or HSL in components.

| Token | Use |
|-------|-----|
| `background` | Page and app background (warm off-white). |
| `foreground` | Primary text and headings. |
| `muted` / `muted-foreground` | Secondary backgrounds and supporting text (labels, captions, metadata). |
| `card` | Surface for cards and elevated panels. |
| `border` | Dividers, card borders, input borders. |
| `primary` / `primary-foreground` | Brand accent (red), primary actions, key CTAs. |
| `secondary` | Subtle backgrounds (inputs, nav hover, section blocks). |
| `status-online` | Success, active, “on” states. |
| `status-warning` | Warnings, attention needed. |
| `status-offline` | Inactive, error, or “off” states. |
| `destructive` | Destructive actions only. |

- **Restraint:** Prefer `foreground` and `muted-foreground` for almost all text. Use `primary` sparingly (buttons, links, active states).
- **Borders:** Use `border-border`. For very subtle dividers, `border-border/50` is acceptable. Avoid colored borders except for focus/ring.

---

## 3. Typography

- **Font:** Outfit only (`font-outfit`). No second font for UI.
- **Body:** `antialiased`, tight letter-spacing (`-0.04em`). Applied globally in `index.css`.
- **Headings:** `font-semibold tracking-tight`; keep the same letter-spacing for consistency.
- **Scale:**
  - Page title: `text-3xl font-semibold text-foreground`
  - Section title: `text-lg font-semibold`
  - Card/section subtitle: `text-sm text-muted-foreground`
  - Body / list content: `text-sm` or default; labels: `text-sm text-muted-foreground`
  - Small labels / metadata: `text-xs text-muted-foreground`; uppercase labels: `text-[10px] uppercase tracking-wider text-muted-foreground` when needed
- **Hierarchy:** One clear H1 per view. Use weight and color (foreground vs muted) to show importance, not size alone.

---

## 4. Cards & surfaces

- **Standard card:**  
  `bg-card rounded-2xl border border-border shadow-card`  
  For softer emphasis: `shadow-soft` instead of `shadow-card`.
- **Interactive cards (e.g. list items):** Add `card-hover` for the shared hover behavior: `transition-all duration-300 ease-out hover:shadow-elevated hover:-translate-y-1`.
- **Inner rounded areas:** Use `rounded-xl` inside cards (e.g. image containers, icon boxes). Use `rounded-lg` for smaller chunks (inputs, nav items).
- **Padding:** Cards use `p-6`; compact blocks use `p-4`. Keep internal spacing consistent within a section.
- **No glassmorphism in dashboard:** Avoid `backdrop-blur` and translucent panels in main app UI. Use solid `bg-card` and `border-border`. Exception: overlays on dark hero images (e.g. property header) may use a light blur for readability.

---

## 5. Buttons & actions

- Use the shared `Button` component. Prefer semantic variants: `default` (primary CTA), `outline` (secondary), `ghost` (tertiary).
- **Primary actions:** `variant="default"` with `bg-primary hover:bg-primary/90 text-primary-foreground`. Do not add custom shadows or heavy borders; keep the default button style.
- **Sizes:** `size="sm"` for inline or bar actions; default for main CTAs. Use `asChild` with `Link` when the action is navigation (e.g. “Add Property”).
- **One primary CTA per section:** Avoid multiple competing primary buttons in the same block.

---

## 6. Forms & inputs

- **Inputs:** Use `Input` with `bg-secondary border-0` (or default) for a soft, minimal field. Keep borders subtle; avoid heavy outlines.
- **Labels:** `Label` with `text-sm text-muted-foreground` above the field. Use `space-y-2` between label and input.
- **Grouping:** Use `space-y-4` between fields; `grid grid-cols-1 md:grid-cols-2 gap-4` for two-column form blocks when appropriate.
- **Section intro:** For form sections, use a small icon + title + description (e.g. `text-lg font-semibold` + `text-sm text-muted-foreground`).

---

## 7. Status & badges

- **StatusBadge:** Use for AI/service status (online, warning, offline). Keep the existing semantic colors: `status-online`, `status-warning`, `status-offline` with the tinted backgrounds (`/10`) and borders (`/20`).
- **Status dots:** For inline status (e.g. “Active” / “Inactive”), use a small dot: `w-2 h-2 rounded-full` with `bg-status-online` or `bg-muted-foreground`. No glow or custom shadows.
- **Counts and pills:** Use `bg-primary text-primary-foreground` for numeric badges (e.g. guest count) when they’re the main focus; keep them small and rounded (`rounded-full`).

---

## 8. Navigation & tabs

- **Sidebar:** Use `nav-item` and `nav-item-active` for links. Active = `bg-primary/10 text-primary font-medium`. Inactive = `text-muted-foreground` with hover `bg-secondary text-foreground`.
- **Tabs (in-page):** Use `tab-item` and `tab-item-active`. Active = `text-primary border-primary` with bottom border; inactive = `text-muted-foreground` with transparent border. No heavy backgrounds.
- **Section labels in nav:** Use `text-xs font-medium text-muted-foreground uppercase tracking-wider` for group labels (e.g. “Menu”).

---

## 9. Imagery & media

- **Images in cards:** Use `object-cover` and a fixed aspect ratio (e.g. `aspect-[16/10]`) inside `rounded-xl overflow-hidden`. Optional: `transition-transform duration-500 group-hover:scale-105` for a subtle zoom on hover.
- **Hero / banner images:** Use a gradient overlay for text readability (e.g. `from-black/70 via-black/25 to-transparent`). Prefer a single, clear focal area; avoid busy overlays.
- **Icons:** Lucide only. Use consistent sizes: `w-4 h-4` or `w-5 h-5` for nav/actions; `w-3.5 h-3.5` for inline with text when needed.

---

## 10. Motion & animation

- **Page enter:** Use `animate-fade-in` for the main content wrapper. Optional staggered children with `animationDelay` (e.g. list cards).
- **Transitions:** Prefer `transition-all duration-200` or `duration-300` and `ease-out` for hover/focus. Avoid long or flashy animations.
- **No auto-playing motion:** No looping animations that draw attention (except very subtle pulse on status dots if already defined).
- **Success / completion:** Use the existing completion keyframes (e.g. checkmark, float-up) for one-off success states; keep them short and clear.

---

## 11. Spacing & rhythm

- **Base unit:** 4px. Use Tailwind spacing (1 = 4px). Prefer `gap-4`, `gap-5`, `gap-6` for flex/grid; `p-4`, `p-6` for padding.
- **Vertical rhythm:** `mb-6` between sections; `mb-8` before major content (e.g. before a grid). Use `space-y-4` or `space-y-6` inside a section.
- **Consistency:** Use the same spacing for similar components (e.g. all list cards get the same padding and gap).

---

## 12. Do’s and don’ts

**Do:**

- Use semantic color tokens for all UI (background, foreground, muted, primary, status).
- Prefer `rounded-2xl` for cards and `rounded-xl` for inner elements.
- Keep one primary action per area and use outline/ghost for secondary actions.
- Use StatusBadge and status dots for state; keep labels short and consistent.
- Add `animate-fade-in` to page-level content for a consistent entrance.
- Use the same card pattern (`bg-card rounded-2xl border border-border shadow-card` or `shadow-soft`) everywhere.

**Don’t:**

- Introduce new fonts or ad‑hoc hex colors in components.
- Use heavy shadows, glow, or glassmorphism in the main dashboard.
- Add more than one primary-style button in a single section.
- Use large or decorative animations; avoid motion that doesn’t support clarity.
- Mix different card styles (e.g. different radii or border weights) without a clear reason.
- Overcrowd cards or headers; when in doubt, remove or group secondary info.

---

## 13. Reference: key class combinations

| Element | Classes |
|--------|--------|
| Page container | `max-w-6xl mx-auto animate-fade-in` or `max-w-3xl mx-auto` |
| Page title | `text-3xl font-semibold text-foreground` |
| Page subtitle | `text-muted-foreground mt-1` |
| Card | `bg-card rounded-2xl border border-border shadow-card` or `shadow-soft` |
| Card with hover | Add `card-hover` |
| Section block | `bg-card rounded-2xl border border-border p-6 shadow-soft mb-6` |
| Divider | `border-t border-border` or `w-px h-5 bg-border` (vertical) |
| Primary button | `Button` with `variant="default"` (no extra classes) |
| Status dot | `w-2 h-2 rounded-full bg-status-online` or `bg-muted-foreground` |
| Label above input | `text-sm text-muted-foreground` |

These rules reflect the current Airier UI and are intended to keep the product simple, clean, and modern in the spirit of apps like Wealthsimple.
