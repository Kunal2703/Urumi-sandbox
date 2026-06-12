# Artwork system — hand-drawn pen-line vignettes

> The artwork system is the **character layer** of the design system.
> Where `tokens.css` defines color/spacing/typography and the `components/`
> directory holds reusable UI parts, the artwork system defines the
> hand-drawn pen-line vignettes that sit in the background of every
> major marketing section. They give the pages their voice — alive,
> handmade, slightly imperfect — and signal that real humans built
> this product.

There are currently **two panoramas** built on this system:

| Panorama | Pages | Panels | Theme |
|---|---|---|---|
| **Storefront Panorama** | Vision (`/`) | 8 | Front-of-house: shop, customers, AI helpers |
| **Operations Panorama** | WooCommerce (`/woocommerce`) | 5 | Back-of-house: ops floor, monitors, operators |

The two panoramas are intentional counterparts: Vision shows what
customers experience; Woo shows what keeps it running.

---

## Aesthetic principles

Every vignette in the system follows the same five rules. Break one
and the panel will look out of place next to the others.

1. **Pen-line, not filled.** All shapes are `fill="none"`,
   `stroke="currentColor"`. Filled fills are reserved for very small
   accents (eyes, LEDs, the URUMI mark).
2. **Varied stroke widths.** Major architecture lines use `1.0–1.4`,
   secondary structure uses `0.8–1.0`, decoration and detail use
   `0.5–0.7`. Variety prevents the drawing from feeling mechanical.
3. **Round caps + joins.** `strokeLinecap="round"` and
   `strokeLinejoin="round"` on the root `<svg>` — gives every line a
   soft, hand-pressed feel.
4. **Slight imperfection.** Don't draw straight lines via `M x y H x'`;
   use `C` / `Q` curves with subtle deviation. Example ground line:
   `M 12 218 C 80 220, 220 219, 308 220` — the curve drifts a pixel
   or two on the ends so it doesn't look CAD-perfect.
5. **Currentcolor everywhere.** Never hardcode a color. The vignette's
   tint comes from the host element's CSS `color`, set per page (see
   "Tinting + opacity" below).

---

## Tinting + opacity

Each vignette is positioned by a CSS class and tinted via `color-mix`
so it reads as ink-on-paper rather than as a foreground graphic.
Pattern:

```css
.vision-v2-hero-shop,
.woo-v2-hero-vignette {
    position: absolute;
    bottom: 6%;
    left: 4%;
    width: clamp(260px, 26vw, 380px);
    height: auto;
    pointer-events: none;
    z-index: 0;
    color: color-mix(in srgb, var(--color-fg) 22%, transparent);
}
```

That `color: color-mix(...)` is what makes everything inside the SVG
render at ~22% opacity in the page's foreground color — automatically
theme-aware (works on light + dark) because the source is the design
token, not a literal hex.

The host section needs `position: relative; overflow: hidden;` so the
absolutely-positioned vignette anchors and clips correctly.

---

## ViewBox conventions

Two standard viewBoxes:

| ViewBox | Use |
|---|---|
| `0 0 320 240` | Hero panels (more vertical headroom for sky) |
| `0 0 380 220` | Wider story panels (3+ characters, more lateral space) |

Don't invent new viewBoxes per panel — pick one of the two so the
sketches read at the same visual scale across the page.

---

## File + class naming

```
src/components/{Page}Panel{N}{Name}.jsx     // the React component
src/styles/{Page}-v2.css                    // the positioning CSS
```

| Page | Component prefix | CSS class |
|---|---|---|
| Vision | `VisionPanel{N}{Name}` | `.vision-v2-{name}-sketch` or `.vision-v2-{name}-shop` |
| Woo | `WooPanel{N}{Name}` | `.woo-v2-{name}-vignette` |

Component default-export name **must** match the file name. Panel
number reflects narrative order in the page (Panel 1 is what the
visitor sees first).

---

## Animation system (framer-motion)

Every vignette uses `framer-motion` for animation. Two flavors of
motion live side by side in most panels:

### A. Continuous ambient loops (the default)

Most motion is independent loops with their own duration, easing, and
optional stagger. They run forever (`repeat: Infinity`), never sync
into a single beat. Example — a hanging shop sign sway:

```jsx
import { motion, useReducedMotion } from 'framer-motion';

const reduced = useReducedMotion();

<motion.g
    animate={!reduced ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
    transition={!reduced
        ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
        : {}}
    style={{
        transformBox: 'fill-box',
        transformOrigin: 'top center',
    }}
>
    {/* sign paths */}
</motion.g>
```

### B. Phase-machine choreography (for arrival sequences)

When a panel needs a clear narrative beat (URUMI mark fires beams →
bots slide down → merchant nods), use a `useState` + `useEffect`
phase machine driven by an array of durations:

```jsx
const PHASE_DURATIONS_MS = [800, 800, 1200, 500, 600, 2000];
const [phase, setPhase] = useState(0);

useEffect(() => {
    if (reduced) { setPhase(/* end-state phase */); return; }
    let idx = 0, timer;
    const tick = () => {
        const next = (idx + 1) % PHASE_DURATIONS_MS.length;
        setPhase(next);
        timer = setTimeout(tick, PHASE_DURATIONS_MS[next]);
        idx = next;
    };
    timer = setTimeout(tick, PHASE_DURATIONS_MS[0]);
    return () => clearTimeout(timer);
}, [reduced]);

const beamsVisible = phase >= 1 && phase < 4;  // etc.
```

Continuous ambient loops should keep running **alongside** the phase
machine — even during the choreographed beats — so the scene is never
fully frozen.

---

## SVG-specific gotchas

### `transform-box: fill-box` is required for SVG rotations

Framer-motion writes the rotation as CSS. On SVG `<g>` the default
`transform-box` is the SVG viewport, so a `transformOrigin: '158px 100px'`
pivots from a near-zero point and the visible motion collapses to
almost nothing.

**Always** pair an SVG rotation with:

```jsx
style={{
    transformBox: 'fill-box',
    transformOrigin: 'top center',  // or 'bottom center', 'center', etc.
}}
```

`transformOrigin` is then relative to the **bounding box of the
element being rotated**, which is what you actually want.

### Use `motion.path`, not `<path>`, when animating

`motion.path`, `motion.circle`, `motion.g`, `motion.line` etc. accept
the `animate` / `transition` props. Plain SVG elements don't.

### `pathLength` for "drawing" animations

Lines that should appear to draw on (chart lines, sun rays
extending) animate via `pathLength`:

```jsx
<motion.path
    d="..."
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.6 }}
/>
```

### `aria-hidden="true"` on every vignette

Vignettes are decorative. They must not be in the accessibility tree.

---

## The pattern library

These motion patterns recur across many panels. Reuse them rather
than reinventing.

### 1. Sun + rays pulse

A circle pulses opacity, a `<g>` of ray paths animates `pathLength`
so rays visibly extend and retract.

```jsx
<motion.circle
    cx="32" cy="32" r="6" strokeWidth="0.9"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
/>
<motion.g
    strokeWidth="0.7"
    initial={{ pathLength: 1 }}
    animate={{ pathLength: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
>
    {/* 8 ray paths emanating from the sun centre */}
</motion.g>
```

### 2. Swallow / bird drift across the sky

A small `Q`-curve V-shape translates across the viewBox with a fade
in/out at the edges so it doesn't pop.

```jsx
<motion.g
    animate={{ x: [-20, 280], opacity: [0, 1, 1, 0] }}
    transition={{
        duration: 6, repeat: Infinity, ease: 'linear',
        times: [0, 0.12, 0.88, 1],
        repeatDelay: 1,
    }}
>
    <path d="M 0 50 Q 4 46, 8 50 Q 12 46, 16 50" strokeWidth="0.7" />
</motion.g>
```

### 3. Sequential ripple (LED row, awning scallops, etc.)

Map an array of element configs to a small sub-component, pass each
element's index, derive `delay` from `(idx / count) * cycleDuration`.

```jsx
{SCALLOPS.map((d, i) => (
    <motion.path
        key={i}
        d={d}
        animate={{ opacity: [1, 0.25, 1] }}
        transition={{
            duration: 1.8, repeat: Infinity, ease: 'easeInOut',
            delay: (i / SCALLOPS.length) * 1.8,
        }}
    />
))}
```

### 4. Sign sway (rotate from a pivot point)

See "Sign sway" above under SVG gotchas. Always set
`transform-box: fill-box` + a meaningful `transformOrigin` like
`'top center'` (sign hanging from a hook) or `'bottom center'`
(flowers in a pot).

### 5. Idle bob (breathing, typing, walking gait)

Tiny vertical translate, short cycle:

```jsx
<motion.g
    animate={{ y: [0, -2.5, 0] }}
    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
>
    {/* character */}
</motion.g>
```

For walking gait, **nest** a fast small bob inside a slower large
translate — outer translate moves the character across the panel,
inner bob gives the gait.

### 6. Eye blink (squash to a slit)

```jsx
<motion.circle
    cx="5" cy="0" r="1.2"
    fill="currentColor" stroke="none"
    animate={{ scaleY: [1, 0.1, 1] }}
    transition={{
        duration: 0.25, repeat: Infinity, ease: 'easeInOut',
        repeatDelay: 4,  // long, irregular
    }}
    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
/>
```

### 7. Terminal cursor blink (square wave)

```jsx
<motion.rect
    x="158" y="115" width="4" height="6"
    fill="currentColor" stroke="none"
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 1, repeat: Infinity, ease: 'steps(2)' }}
/>
```

Use `ease: 'steps(2)'` for a hard on/off, not a fade.

### 8. "+1" / counter-tick float

A text element rises + fades to communicate something happened
(order shipped, counter incremented).

```jsx
<motion.g
    animate={{ y: [0, -22, -22], opacity: [0, 1, 0] }}
    transition={{
        duration: 1.4, repeat: Infinity, ease: 'easeOut',
        times: [0, 0.5, 1], delay, repeatDelay: 1.2,
    }}
>
    <text fontSize="6" fontWeight="600">+1</text>
</motion.g>
```

### 9. Steam wisps

Curve-shape paths that translate up + fade. Use multiple wisps with
different `delay`s for natural variation.

---

## prefers-reduced-motion

**Every** animation honours `useReducedMotion()`. The pattern:

```jsx
const reduced = useReducedMotion();

animate={!reduced ? { /* moving */ } : { /* still */ }}
transition={!reduced ? { /* timing */ } : {}}
```

When `reduced` is true the panel must collapse to a **coherent still
frame** — bots already on the roof, beams hidden, terminal cursor
visible (not blinking). Don't show a half-animated state.

For phase-machine panels, the static state is usually achieved by
jumping straight to the end-state phase:

```jsx
useEffect(() => {
    if (reduced) { setPhase(5); return; }  // 5 = "everyone arrived, resting"
    /* ... */
}, [reduced]);
```

---

## Adding a new panel — checklist

1. **Pick a viewBox**: `0 0 320 240` (hero) or `0 0 380 220` (story)
2. **Sketch the architecture first**: ground line, walls, frame,
   structure — all static. Use varied stroke widths (1.0–1.4 major,
   0.5–0.7 detail).
3. **Add ambient loops in layers, back to front**: sky elements,
   architecture details, foreground props.
4. **Each loop should run on its own duration** — never sync more
   than 2-3 elements to the same beat. Aim for 5+ independent loops
   per panel; the Woo and Vision panels run 8–17 each.
5. **Wire `useReducedMotion`** for every animated element.
6. **Set `aria-hidden="true"`** on the root `<svg>`.
7. **Add the CSS positioning class** to `{Page}-v2.css` (extend the
   shared selector list — shared positioning means changes propagate).
8. **Verify the host section** has `position: relative; overflow: hidden;`.
9. **Test reduced-motion** in dev tools — the panel should be a
   coherent still frame, not partial animation.
10. **Visually inspect** at three widths: 1440 (desktop), 1024
    (laptop), 360 (mobile). Vignette opacity should drop to ~0.7 on
    narrow viewports (already handled by the shared media queries).

---

## Continuity tokens

Small details that recur across panels create **narrative continuity**.
Don't introduce panel-unique props if you can reuse one of these:

- **Potted plant** — every panel has at least one. Pot is static, the
  flowers wiggle (`rotate ±6°`, `transformBox: fill-box`,
  `transformOrigin: 'bottom center'`). Symbol of the same shop / same
  ops floor across the whole journey.
- **Stick-figure character** — circle head + 4 line strokes for body,
  arms, legs. Use the same proportions across panels so the same
  "person" reads as the same character.
- **Hand-drawn ground line** — the imperfect `M 12 218 C 80 220, 220
  219, 308 220` curve. Same drift on every panel that has a floor.
- **Awning + scallops** (Storefront Panorama only) — the wide arc +
  14 or 20 scallops along the bottom. Identical across Vision Panels
  2, 3, 7, 8 so it's clearly the same shop.

---

## Files in the system today

```
src/components/
  VisionPanel1Hero.jsx         — 320×240 — open shop, merchant in doorway
  VisionPanel2Scale.jsx        — 380×220 — viral surge, queues at 3 windows
  VisionPanel3Helpers.jsx      — 380×220 — three AI helpers arrive
  VisionPanel4Revenue.jsx      — 380×220 — Revenue AI + alert card
  VisionPanel5Builder.jsx      — 380×220 — Builder AI + speech bubble
  VisionPanel6Analytics.jsx    — 380×220 — Analytics AI + chart board
  VisionPanelByoAI.jsx         — 380×220 — BYO-AI interlude: subscription card
                                            (Claude / ChatGPT / Gemini) plugs
                                            into URUMI's MCP port; active card
                                            cycles every 3s, data dots travel
                                            the cable
  VisionPanel7Bridge.jsx       — 380×220 — ambient continuous scene
  VisionPanel8FinalCTA.jsx     — 380×220 — closing shop scene

  WooPanel1Hero.jsx            — 380×220 — ops floor: monitors, operator, status board
  WooPanel4Gruum.jsx           — 380×220 — peak week, all green, three operators
  WooPanel5FinalCTA.jsx        — 380×220 — single console, blinking cursor, "READY"
```

CSS positioning lives in `src/styles/Vision-v2.css` and `src/styles/Woo-v2.css`.

---

## When NOT to use this system

- **Foreground UI illustrations** (e.g. icons, decorative stamps in
  buttons). Use SVG icons or unicode glyphs — vignettes are background
  scene-setters, not UI elements.
- **Logos / brand marks**. The URUMI mark is its own asset, not a
  vignette.
- **Anything that needs to be focusable, clickable, or labelled for
  screen readers**. Vignettes are `aria-hidden`. If something needs to
  be in the a11y tree, it doesn't belong here.
- **Photographs or rich illustration**. The whole point of the system
  is the loose, hand-drawn pen-line voice. Don't mix in detailed
  raster art alongside vignettes — it'll fight for attention.
