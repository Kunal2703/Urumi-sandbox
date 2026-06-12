# Urumi Design System

Two files own the entire visual register of urumi.ai. Anything that reads a CSS variable or uses a `.ds-*` class inherits the foundation — no per-component edits required to move the whole site at once.

```
src/design-system/
├── tokens.css        ← :root variables  (the vocabulary)
├── utilities.css     ← .ds-* classes + global treatments  (the grammar)
├── ARTWORK.md        ← hand-drawn vignette panorama system  (specialist doc)
├── components/       ← shared DS React components (DSReveal, DSFinalCTA, etc.)
└── hooks/            ← shared DS React hooks  (useSectionScroll, etc.)
```

Logos, favicons, OG images live in **`themes/react-woo-headless/public/`** — single source of truth for static assets.

---

## The voice

**Editorial-engineering on warm paper.** Switzer for type, Gambarino for one italic word per headline, JetBrains Mono for technical labels. Warm graphite ink on a paper background lifted just out of cream into a hand-treated warmth. Burnt-sienna accent (the Urumi orange, restrained) as the moment of energy; deep teal as the co-equal tonal partner for surfaces that need to break the page rhythm.

Premium reads as **less weight, more size, more space** — display headlines run at `font-weight: 500`, not 700; tighter letter-spacing; bigger sizes on the upper bound. The page breathes.

The whole canvas wears a 2% paper-grain SVG overlay — invisible singly, transformative collectively.

---

## tokens.css — the vocabulary

`:root` variables. Reference these and theme/palette changes flow through without touching components.

### Color

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#F4EEE2` (warm paper) | `#14110D` |
| `--color-surface` / `-2` / `-3` / `-4` | layered tinted cards on paper | layered tones above bg |
| `--color-fg` | `#1C1814` (warm graphite, *not* black) | `#FFEDD7` |
| `--color-fg-muted` / `-dim` | foreground at 62% / 42% — text hierarchy through opacity, not separate hexes | |
| `--color-accent` | `#C85A2E` (muted burnt-sienna) | same |
| `--color-accent-hover` / `-soft` / `-fg` | hover state, 10% halo tint, cream text on accent | |
| `--color-deep` | `#0F3D3E` (deep teal, co-equal accent for tonal-pair surfaces) | `#1A5E60` |
| `--color-border` / `-strong` | `#D9CDB3` / `#B5A380` (warm tan, *not* gray) | translucent fg |
| `--color-glow` | accent at 8% (hero gradient washes) | |
| `--color-success` / `-warning` / `-danger` | warmer status family | |
| `--color-score-red` / `-amber` / `-green` | **theme-invariant** — data colors, never chrome | |

### Type

```css
--font-sans:    'Switzer', 'Söhne', -apple-system, sans-serif;   /* body + most UI */
--font-display: 'Switzer', 'Söhne', -apple-system, sans-serif;   /* headlines */
--font-edit:    'Gambarino', Georgia, serif;                     /* .ds-accent italic moments */
--font-mono:    'JetBrains Mono', ui-monospace, monospace;       /* labels, code, data */
```

Loaded from Fontshare via `<link rel="stylesheet">` in `themes/react-woo-headless/index.php` — not `@import`-ed from `tokens.css`, because `@import` would chain main-CSS → Fontshare-CSS → woff2 into a 3-step waterfall. The link in HTML lets the Fontshare CSS download in parallel with the main theme CSS. No font sizes in tokens — semantic classes in `utilities.css` own the type ramp.

### Spacing (4-pt grid, Tailwind-aligned)

```
--space-1  4px      --space-8   32px       --space-20  80px
--space-2  8px      --space-10  40px       --space-24  96px
--space-3 12px      --space-12  48px       --space-32 128px
--space-4 16px      --space-16  64px
--space-5 20px
--space-6 24px
```

### Radius, motion, shadow, layout

`--radius-{sm|md|lg|pill}`, `--duration-{fast|base|slow}`, `--ease-out`, `--ease-in-out`, `--shadow-{sm|md|lg}` (warm rgba drops), `--max-w` (page wrapper cap).

---

## utilities.css — the grammar

### Global treatments (apply to everything)

- **Body chrome** — OpenType `ss01`/`ss02`/`cv11` + lining tabular nums site-wide.
- **Paper grain** — SVG noise overlay on `body::before` at 2% opacity, multiply blend, fixed. Reduced-motion users get a slightly dimmer overlay.
- **::selection** — accent on accent-fg (the kind of detail 95% miss, 5% notice).

### Class layer (the `.ds-*` family)

| Class | What it is |
|---|---|
| `.ds-page` | Page wrapper — sets bg, fg, font, `min-height: 100vh`. Per-page modifiers add layout (`.ds-page-careers`, `.ds-page-blogpost`, etc.). |
| `.ds-wrap` | Bounds content to `--max-w` with `--space-6` side padding. |
| `.ds-section` | Standard section padding (24/24 desktop, 16/16 mobile). |
| `.ds-eyebrow` | Small mono pill with accent dot — section eyebrows + meta labels. No-wrap, tight padding. |
| `.ds-h1` / `.ds-h2` / `.ds-h3` | Display type — Switzer at weight 500, tightened letter-spacing, larger sizes. |
| `.ds-sub` / `.ds-body` | Reading copy — looser line-height (1.65), letter-spacing -0.003em (premium breathing). |
| `.ds-mono` | 12px mono — technical labels, timestamps, axis ticks. |
| `.ds-num-label` | Numbered section eyebrow (`01 / The platform`). Accent color, 0.14em tracking. |
| `.ds-accent` | **The italic moment** — Gambarino italic span inside a headline. Used as `<span className="ds-accent">autopilot.</span>`. Lighter weight than the rest of the headline, accent color. |
| `.ds-pill` | Outline button — accent-bordered on hover. |
| `.ds-pill-solid` | **Ink-on-paper button** — fg bg, paper text, hover swaps to deep teal with a radial accent halo. The primary CTA across the site. |
| `.ds-card` | **Embossed card** — inset top highlight catches the canvas, soft long shadow drops the card. |
| `.ds-prose` | Reading-typography wrapper for WP-rendered post content + editorial sections (blog post body, case study). Don't mix with `.ds-h1`/etc. in the same scope. |
| `.ds-stat-callout` | Pull-quote block — Gambarino italic on the quote, mono attribution, accent border-left. |
| `.premium-mark` | Opt-in fixed letterpress badge bottom-right. Drop in as `<span className="premium-mark">no. 0001</span>`. |

### Reduced-motion

Every continuous animation honors `prefers-reduced-motion: reduce`. Transitions collapse to `0.001ms`; paper grain dims to 0.5 opacity. Components must additionally suppress their own framer-motion loops — see ARTWORK.md for the panel pattern.

---

## Adopting the system on a new page

1. Wrap the page in `<div className="ds-page ds-page-yourname">`.
2. Use `.ds-h1` / `.ds-h2` / `.ds-h3` for display headings. Drop `.ds-accent` italic spans inside them: `<h1 className="ds-h1">eCommerce, on <span className="ds-accent">autopilot.</span></h1>`.
3. Body copy → `.ds-sub` or `.ds-body`. Long-form prose → `.ds-prose`.
4. Section eyebrows → `.ds-num-label` or `.ds-eyebrow`.
5. CTAs → `.ds-pill-solid` (primary) + `.ds-pill` (outline). Use the site-wide single-CTA contract: solid pill = audit / demo; outline pill = soft secondary (read case study, etc.).
6. Cards → `.ds-card`.
7. Page-specific styling lives in `src/styles/{Page}-v2.css` and references the tokens. Don't hardcode colors / fonts.

---

## When to extend the system vs work around it

**Extend the system** (token, utility, or DS component) when something will appear on 2+ pages. Adding `--color-deep` and `.ds-pill-solid` were both this case.

**Work around with page-specific CSS** when something is genuinely single-use (e.g. `.woo-v2-different-grid` for the WC differentiators section). Page-specific styles still reference the tokens.

When extending, update **both** `tokens.css` / `utilities.css` AND this README's tables in the same commit. Drift between code and doc is the start of a system that nobody trusts.

---

## See also

- **`HANDOFF.md`** — the **why** behind the v2 migration: font philosophy + Söhne/Tiempos upgrade path, color rationale, where to use deep teal vs orange (80/20 split), type-rhythm reasoning, "5%-who-notice" details, open questions for review. Read this when extending the palette or making a "should we add X?" decision.
- `ARTWORK.md` — the hand-drawn vignette panorama system (Storefront + Operations panoramas). Covers viewBox conventions, pen-line aesthetics, framer-motion patterns, and per-panel choreography. Sibling system, separate concern.
- `components/` — shared DS React components (`DSReveal`, `DSFinalCTA`, `DSCountUp`, `DSMetricStrip`, etc.). Each documents its prop API at the top of the file.
- `hooks/useSectionScroll.js` — scroll-tied progress hook used by every parallax / breathing-scale animation in the system.
