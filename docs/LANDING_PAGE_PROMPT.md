# Landing Page Design & Animation Brief: Airier

Use this brief to build a marketing landing page that matches the Airier app’s design system and includes the described scroll-driven 3D/animation concept.

---

## 1. Product context

**Airier** is an AI guest concierge for short-term rental hosts. Hosts add property details (amenities, “where is” info, local recommendations, rules, exact Q&A). Guests get 24/7 chat that answers with that knowledge (e.g. “Where’s the first aid kit?” → “The first aid kit is in the closet next to the door”).

**Tagline (from app):** “The short-term rental host that never sleeps.”

**Landing page goal:** Show how Airier turns property knowledge into instant, accurate guest answers, with a scroll-driven story that highlights real features inside a 3D property.

---

## 2. Design system (match the app exactly)

### Typography
- **Font:** Outfit (weights 400, 500, 600, 700). Use as primary UI and heading font.
- **Body:** Slight tight tracking: `letter-spacing: -0.04em`; antialiased.
- **Headings (h1–h6):** Semibold, `tracking-tight`, same `-0.04em` letter-spacing.

### Color palette (HSL; use in CSS as `hsl(var(--name))` or equivalent)

| Token | HSL | Usage |
|-------|-----|--------|
| **Primary** | `2 82% 54%` (vibrant red, ~#E8302C) | CTAs, active states, key highlights, brand |
| **Primary foreground** | `0 0% 100%` | Text on primary buttons |
| **Primary light / Coral** | `4 89% 66%` (~#F25F5C) | Hover, accents, secondary highlights |
| **Background** | `30 20% 98%` | Page and section backgrounds (warm off-white) |
| **Foreground** | `0 0% 12%` (~#1F1F1F) | Primary text |
| **Card** | `0 0% 100%` | Cards, modals, floating panels |
| **Secondary** | `30 15% 95%` | Secondary surfaces, nav hover |
| **Muted** | `30 10% 94%` | Subtle backgrounds |
| **Muted foreground** | `0 0% 40%` (~#666) | Secondary text, captions |
| **Border** | `30 10% 90%` | Borders, dividers |
| **Destructive** | `0 84% 60%` | Errors, delete actions |
| **Status online** | `142 71% 45%` | Success / live |
| **Status warning** | `43 96% 56%` | Warning |
| **Status offline** | `0 84% 60%` | Offline / error |

Use **primary (red/coral)** for all important CTAs and for in-scene “highlight” elements in the 3D section (e.g. first aid kit glow, message bubbles).

### Border radius
- **Base radius:** `0.75rem` (12px). Use for buttons, inputs, small cards.
- **Medium:** `rounded-xl` (1rem) for cards and image containers.
- **Large:** `rounded-2xl` (1.25rem) for hero cards, main content blocks, and the 3D scene container.
- **Pills / tabs:** `rounded-full` for nav pills and status pills.

### Shadows (layered)
- **Soft:** `0 2px 8px -2px rgba(0,0,0,0.08)` — subtle lift.
- **Card:** `0 4px 16px -4px rgba(0,0,0,0.1)` — default cards.
- **Elevated:** `0 8px 32px -8px rgba(0,0,0,0.12)` — hover, modals, floating UI.

Use these on cards and on the 3D scene container so it feels consistent with the app.

### Motion
- **Transitions:** `200–300ms`, `ease-out`.
- **Card hover:** Slight lift (`translateY(-4px)`) + elevated shadow.
- **Buttons:** `transition-all duration-200`; primary buttons use `hover:bg-primary/90`.
- **Animations:** Prefer subtle fade-in, slide-up, or scale-in (e.g. opacity 0→1, translateY(8px)→0) for sections and cards.

### UI patterns from the app
- **Cards:** White background, `rounded-2xl`, `border border-border`, `shadow-soft` or `shadow-card`; padding ~1.5rem.
- **Primary buttons:** Primary background, primary-foreground text, `rounded-lg`, medium padding.
- **Tabs:** Underline style; active = primary color + `border-b-2 border-primary`.
- **Nav items:** `rounded-lg`, hover = secondary bg; active = `bg-primary/10 text-primary`.
- **Inputs/textarea:** Secondary or muted background, same radius system, subtle borders.

Apply these to hero CTA, feature cards, pricing, and any UI overlays on the landing page.

---

## 3. GSAP scroll-driven hero / story section

### Concept
A **scroll-driven narrative** that shows a 3D (or high-fidelity 2.5D) model of a short-term rental. As the user scrolls, the scene stays in view (pin or sticky) and different parts of the property are highlighted to demonstrate Airier’s features in context.

### Scene content
- **Environment:** One cohesive property interior (e.g. open-plan living + kitchen, visible bedroom, bathroom, entry).
- **Details to include:** Living area with couch, kitchen (appliances, counter), bedroom (bed, nightstand), bathroom, entry/closet, and specific items that match Airier’s “Where is?” and “Exact answers” features (e.g. first aid kit, extra towels, thermostat, WiFi router, keys/safe).
- **Character:** A guest (person) sitting on the couch, on their **phone** (as if chatting with the AI). Optional: subtle “typing” or message notification on the phone to imply the conversation.

### Scroll sequence (GSAP ScrollTrigger)

1. **Intro (0–20% scroll)**  
   - Scene fades or animates in (e.g. camera move or model fade).  
   - Headline/subline: e.g. “Your property. Your knowledge. Instant answers for every guest.”

2. **First highlight – “Where is?” (e.g. 20–35% scroll)**  
   - **First aid kit** (in closet or bathroom) is **highlighted in primary (orange/red)** (glow, outline, or soft light).  
   - A **message bubble or tooltip** in the same primary color appears with copy like:  
     **“The first aid kit is in the closet next to the door.”**  
   - This demonstrates “Where is?” answers the host configured in Airier.  
   - Optional: small label “Where is?” or “Guest asked” to clarify the feature.

3. **Second highlight (e.g. 35–50% scroll)**  
   - Another item is highlighted (e.g. **WiFi password** on a card, or **thermostat**).  
   - Message in primary: e.g. “WiFi: StayConnected2024” or “Turn the dial to the right for cooling.”  
   - Reinforces exact answers and property-specific knowledge.

4. **Further scroll (50%+)**  
   - One or two more highlights (e.g. **checkout time**, **parking**, or **local recommendation**).  
   - Each with a short, realistic answer in primary-colored UI.  
   - End with a clear CTA: e.g. “Give every guest an AI that knows your property” with a primary button.

### Technical notes for the designer
- Use **GSAP ScrollTrigger** to pin the 3D/viewport section and drive progress (e.g. `scrub: 1` or stepped `toggleActions`).
- Tie highlight states (opacity, outline, glow) and message visibility to scroll progress so the story feels continuous.
- **Highlight color:** Use the app primary (red/coral) for all in-scene highlights and message bubbles so it’s recognizable as “Airier answering.”
- If full 3D is out of scope: a **2.5D illustration** or **layered SVG/PNG** of the same scene with parallax and GSAP-driven opacity/scale for “highlights” is acceptable; the narrative and copy should stay the same.
- Keep the scene **responsive**: scale or crop on small viewports; consider a simplified “focus” crop (e.g. living room + one highlight) on mobile.

---

## 4. Rest of the landing page (aesthetic consistency)

- **Above the fold:** Hero with headline, subline, primary CTA, and either a static key visual or the start of the 3D scene.
- **Sections:** Use the same background (warm off-white), card style (white, rounded-2xl, shadow-card), and primary only for CTAs and key phrases.
- **Feature grid:** Cards with icons (or small illustrations), titles, short body copy; optional subtle fade-in on scroll.
- **Social proof:** Testimonials or logos in cards with the same radius and shadows.
- **Footer:** Muted text, optional primary for links or CTA.

Avoid introducing new colors or fonts; keep radius, shadows, and motion in line with the design system so the landing page feels like part of the same product as the app.

---

## 5. Deliverables to align on

- Responsive landing page (desktop + tablet + mobile) using the design system above.
- One scroll-driven section implementing the 3D (or 2.5D) property + guest on couch + GSAP highlights and message bubbles as described.
- All in-scene highlights and message copy in **primary (red/coral)**.
- Optional: separate design file (Figma/Fig) documenting the landing layout and the scroll sequence frames for the 3D section.

---

## 6. Quick reference: CSS variables (for implementation)

```css
:root {
  --primary: 2 82% 54%;
  --primary-foreground: 0 0% 100%;
  --primary-light: 4 89% 66%;
  --background: 30 20% 98%;
  --foreground: 0 0% 12%;
  --card: 0 0% 100%;
  --secondary: 30 15% 95%;
  --muted: 30 10% 94%;
  --muted-foreground: 0 0% 40%;
  --border: 30 10% 90%;
  --radius: 0.75rem;
  --shadow-soft: 0 2px 8px -2px rgba(0,0,0,0.08);
  --shadow-card: 0 4px 16px -4px rgba(0,0,0,0.1);
  --shadow-elevated: 0 8px 32px -8px rgba(0,0,0,0.12);
}
```

Use `hsl(var(--primary))` etc. in your styles so the landing page stays on-brand with the app.
