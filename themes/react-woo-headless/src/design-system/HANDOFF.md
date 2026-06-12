# Premium Theme Migration — Design Tokens

> This is the design team's migration handoff. The **Implementation status** section below shows what's shipped vs. deferred. The body (§1–§8) is the original spec, preserved for reasoning + reference.

---

## Implementation status (premium-pages-bundle branch · [PR #8](https://github.com/UrumiAI/urumi.ai/pull/8))

| # | Spec section | Status | Where it lives |
|---|---|---|---|
| 1 | Why this PR exists (§1) | ✅ Shipped | rationale |
| 2 | Font swap — Switzer + Gambarino + JetBrains Mono (§2) | ✅ Shipped | [`tokens.css:1-4`](./tokens.css) (Fontshare `@import`) + [`tokens.css:80-83`](./tokens.css) (`--font-*` vars) |
| 3 | Color migration — warm paper, warm graphite, burnt-sienna + deep teal, warmer shadows (§3) | ✅ Shipped | [`tokens.css:31-130`](./tokens.css) (`:root`) + [`tokens.css:161-202`](./tokens.css) (dark theme) |
| 4 | Type rhythm — `.ds-h1/h2/h3` weight 500, tighter tracking, body 18/1.65, mono 0.14em, OpenType `ss01`/`ss02`/`cv11`, `::selection` (§4) | ✅ Shipped | [`utilities.css`](./utilities.css) (`.ds-h1/h2/h3`, `.ds-body`, `.ds-mono`, body chrome) |
| 5 | Paper grain — 2% SVG noise overlay, multiply blend (§5) | ✅ Shipped | [`utilities.css`](./utilities.css) (`body::before`) |
| 6 | Signature mark — `.premium-mark` utility (§6) | 🟡 Available, not mounted | [`utilities.css`](./utilities.css) (`.premium-mark`) — utility class ships, not currently dropped on any page. Add `<span className="premium-mark">no. 0001</span>` to opt in. |
| 7 | Rollout (§7) | ✅ Step 1–2 done. Step 3 (regression sweep) ongoing in visual QA. | branch `premium-pages-bundle` |
| 8 | Open questions (§8) | ⏳ Pending review | see "Still open" below |

### File-organization deltas (proposed → shipped)

The intent shipped exactly as specified. Three file-layout choices differ from the original proposal — flagged so this doc and the codebase don't drift:

1. **No `premium-tokens.css` file.** The proposed drop-in override was merged directly into [`tokens.css`](./tokens.css). Same variable names, same values — one file instead of two. Revert path is `git revert`, not "remove the import line."

2. **No `ui_kits/` companion previews.** The bundle's standalone HTML mockups (Vision + WooCommerce against new tokens) were extracted as `premium-pages-bundle/` for review and removed after sign-off. Visual QA target: the live theme on the `premium-pages-bundle` branch.

3. **Treatment rules merged into `utilities.css`.** The proposed separate `premium.css` (paper grain, italic `.ds-accent`, ink-on-paper pill, embossed `.ds-card`, `.premium-mark`) lives alongside the rest of the `.ds-*` class layer. The whole design system is **two files**: [`tokens.css`](./tokens.css) (variables) + [`utilities.css`](./utilities.css) (everything else). See [`README.md`](./README.md) for the runtime class inventory.

### Still open

- **Font license budget** (§8.1) — Switzer + Gambarino ship free via Fontshare. Söhne (~$1.5k web) + Tiempos Headline (~$1k) upgrade path is a token-string swap when budget exists, no layout reflow.
- **Signature mark adoption** (§8.2) — utility is in `utilities.css`; not currently mounted. Decision: ship visibly on the marketing pages, or keep as opt-in for editorial/case-study moments only?
- **Where else does `--color-deep` get applied?** (§8.3) — currently in `.ds-pill-solid:hover` halo + footer band. Open: pricing tiers, hero alt-state, additional reversed surfaces.

---

## Original handoff document

**Scope:** Colors, fonts, and type rhythm only. No artwork, copy, or component-structure changes in this pass.

**Reversibility:** `git revert` the design-system commits on this branch.

---

## 1 · Why this PR exists  ✅ Shipped

The current tokens read "competent indie SaaS." The buyer for Urumi is a store that does seven-figure GMV and treats a botched checkout as a board-level event. The page needs to feel like the product the buyer is being asked to wire money to. This PR upgrades the *foundation* — colors, fonts, type — without touching layout, copy, or illustration. Every visual change downstream of these tokens propagates automatically.

Expected lift: every screenshot looks materially more expensive. No JSX touched. Reversible by reverting one file.

---

## 2 · Font swap  ✅ Shipped

| Role | Current | New | Source | License |
|---|---|---|---|---|
| Sans (UI + display) | Inter | **Switzer** | Fontshare | OFL (free, commercial OK) |
| Editorial accent | — | **Gambarino** | Fontshare | OFL (free, commercial OK) |
| Mono | JetBrains Mono | JetBrains Mono *(unchanged)* | Google Fonts | OFL |

**Why Switzer:** Inter ships on ~40% of the internet. Premium brands don't use it for headlines. Switzer is the closest free-tier analogue to Söhne (Klim) — same geometric-humanist feel, distinctive uppercase G and tighter counter-forms. Free to use at any scale; no licensing line item.

**Why Gambarino:** A single editorial display face reserved for blockquotes (currently the grüum testimonial only). Adds one moment of contrast where the design needs a "voice change" — gives the quote weight without a layout change.

**Upgrade path when budget exists:** Switzer → Söhne (~$1.5k for web); Gambarino → Tiempos Headline (~$1k). Same metrics class — no layout reflow required. Flag stays as a future enhancement, not a blocker.

**Loader change:**
```html
<!-- remove -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap" rel="stylesheet">

<!-- add -->
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700&f[]=gambarino@400&f[]=jetbrains-mono@400,500,600&display=swap">
```

**`tokens.css` variable change:**
```css
/* before */
--font-sans:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: 'Inter', -apple-system, sans-serif;

/* after */
--font-sans:    'Switzer', -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: 'Switzer', -apple-system, sans-serif;
--font-edit:    'Gambarino', Georgia, serif;   /* NEW — editorial accent */
```

---

## 3 · Color migration  ✅ Shipped

The current palette is cream + orange. The new palette adds **deep teal as a co-equal accent** so orange becomes the *moment of energy* inside an otherwise sophisticated system, rather than the system itself. The cream warms up by ~3°; the ink shifts from cool gray to warm graphite so it stops feeling like a Tailwind default.

### Old → New (drop-in: same variable names)

| Token | Before | After | Note |
|---|---|---|---|
| `--color-bg` | `#F5EFE6` | `#F4EEE2` | warmer, more "paper" |
| `--color-surface-1` | `#F0E9DC` | `#EFE8DA` | matches warmer base |
| `--color-surface-2` | `#EBE2D0` | `#EBE3D2` | — |
| `--color-surface-3` | `#E5DAC5` | `#E6DCC7` | — |
| `--color-border` | `#DBCEB3` | `#D9CDB3` | — |
| `--color-border-strong` | `#B8A682` | `#B5A380` | — |
| `--color-fg` | `#1F1B16` | `#1C1814` | warm graphite, not pure black |
| `--color-fg-muted` | `rgba(31, 27, 22, 0.62)` | `rgba(28, 24, 20, 0.62)` | tracks new fg |
| `--color-fg-dim` | `rgba(31, 27, 22, 0.42)` | `rgba(28, 24, 20, 0.42)` | tracks new fg |
| `--color-accent` | `#D06530` | `#C85A2E` | slightly muted, more burnt-sienna |
| `--color-accent-hover` | `#B5521F` | `#A8431F` | — |
| `--color-deep` | *(new)* | `#0F3D3E` | **deep teal — co-equal accent** |
| `--color-deep-hover` | *(new)* | `#0A2D2E` | — |
| `--color-success` | `#5A8C66` | `#4A7C59` | warmer |
| `--color-warning` | `#C8823A` | `#B8732B` | warmer |
| `--color-danger` | `#B7453A` | `#A8392E` | warmer |

### Where to use deep teal

Deep teal is **not** a replacement for orange — it's a third anchor. Use it for:
1. **Large reversed surfaces** (metric strip background, footer bands) — replaces black/very-dark-gray
2. **Primary CTA hover state** (the button shifts from ink → teal on hover instead of staying ink)
3. **Section accent borders** where the page needs a non-orange divider
4. **Vignette stroke color** at low alpha (the bottom-left illustrations)

Orange stays reserved for: numerical highlights, accent words inside H1/H2, signature dot in eyebrows, the one moment of color in the CTA. Roughly an 80/20 split between deep teal as structural accent and orange as a punctuation accent.

### Shadow system (warmer)

Shadows currently use neutral gray. Premium shadows are warmer — they pick up the cream substrate.

```css
/* before */
--shadow-md: 0 4px 14px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);

/* after */
--shadow-sm: 0 1px 2px rgba(28, 20, 12, 0.05),
             0 1px 1px rgba(28, 20, 12, 0.03);
--shadow-md: 0 4px 14px rgba(28, 20, 12, 0.08),
             0 1px 3px rgba(28, 20, 12, 0.04);
--shadow-lg: 0 24px 60px rgba(28, 20, 12, 0.14),
             0 6px 18px rgba(28, 20, 12, 0.06),
             0 1px 1px rgba(28, 20, 12, 0.04);
```

---

## 4 · Type rhythm  ✅ Shipped

The single biggest free upgrade. Current type uses one register — display headlines and body copy feel like the same designer's voice. Premium type has **higher contrast between scales**: tighter display, looser body, different letter-spacing per role.

### Display headings (H1, H2)

```css
/* before */
font-weight: 700;
letter-spacing: -0.030em;
line-height: 1.05;

/* after */
font-weight: 500;          /* heavy = cheap. drop to 500. */
letter-spacing: -0.045em;  /* tighter — premium display tracks tight */
line-height: 0.94;         /* tighter — display sets close */
```

**Why drop the weight.** 700-weight headlines on cream read like a SaaS landing page from 2020. 500-weight at a larger size reads like editorial design. Same hierarchy, completely different register.

### Body prose

```css
/* before */
font-size: 17px;
line-height: 1.55;
letter-spacing: 0;

/* after */
font-size: 18px;
line-height: 1.65;
letter-spacing: -0.003em;
max-width: 540px;
```

More breathing room. Body prose is where eyes actually live; an extra 0.1 of leading reads as confident, not loose.

### Mono labels (eyebrows, code, metadata)

```css
/* before */
letter-spacing: 0.08em;
font-weight: 400;

/* after */
letter-spacing: 0.14em;    /* premium mono breathes */
font-weight: 500;
```

### Numerals

Three small additions, all invisible to 95% of viewers and devastating to the 5% who care:

```css
body {
  font-feature-settings: "ss01", "ss02", "cv11";
  font-variant-numeric: lining-nums tabular-nums;
}

/* big stats use proportional oldstyle in editorial slots */
.metric-value {
  font-feature-settings: "ss01", "tnum", "lnum";
}
```

Tabular numerals keep stats aligned across rows. Stylistic sets `ss01`/`cv11` in Switzer give you a slashed zero in mono contexts — the kind of detail buyers in our segment (CTOs of high-traffic stores) notice.

### Selection color

One line, instant signal of care:

```css
::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}
```

---

## 5 · Paper grain  ✅ Shipped

A 2% SVG noise overlay at the body level. Subtle enough that nobody points at it; the page just stops looking like flat hex.

```css
body::before {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.78;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11 0 0 0 0 0.09 0 0 0 0 0.08 0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-size: 220px 220px;
}
body > * { position: relative; z-index: 2; }
```

This is the single change that gives Linear / Mercury / Levels / Rauch their "physical" feeling. Inline SVG so it ships at zero asset weight and survives offline.

---

## 6 · Signature mark (optional, recommended)  🟡 Utility available, not mounted

> **Status:** The `.premium-mark` class ships in [`utilities.css`](./utilities.css). It is **not** currently rendered on any page — pure opt-in. Drop `<span className="premium-mark">no. 0001 · run of one</span>` into a page to enable it.

A tiny letterpress-style serial fixed in the bottom-right. Zero functional purpose; pure signal that humans were here.

```html
<span class="premium-mark">no. 0001 · run of one</span>
```

```css
.premium-mark {
  position: fixed; right: 18px; bottom: 18px; z-index: 100;
  font-family: var(--font-mono);
  font-size: 9px; letter-spacing: 0.20em; text-transform: uppercase;
  color: var(--color-fg-dim);
  display: inline-flex; align-items: center; gap: 10px;
  padding: 6px 12px;
  border: 1px solid var(--color-border); border-radius: 999px;
  background: rgba(244, 238, 226, 0.85); backdrop-filter: blur(8px);
  opacity: 0.7;
}
.premium-mark::before {
  content: ""; width: 6px; height: 6px;
  background: var(--color-accent); border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(200, 90, 46, 0.15);
}
```

Mercury does this with card embossing; Stripe with the gradient signature; we do it with a numbered run mark. Optional in this PR — defer if it feels too far.

---

## 7 · Rollout  ✅ Steps 1–2 done · ⏳ Step 3 (regression sweep) in visual QA

1. **Land this PR** — drop `premium-tokens.css` into `src/design-system/`, import it once after the existing `tokens.css`. No JSX touched, no existing file edited.

   ```css
   /* in the root style entry, after tokens.css */
   @import "./design-system/tokens.css";
   @import "./design-system/premium-tokens.css";  /* <- the only new line */
   ```

   Plus the Fontshare `<link>` in the document head (see §2).

2. **Visual QA against `ui_kits/vision/index.html` and `ui_kits/woocommerce/index.html`** in the design-system project — those pages were built verbatim from the repo source against these tokens, so they're the reference renders.
3. **Watch for regressions:** any component that hard-codes `Inter`, hex values matching the old palette, or `font-weight: 700` on headlines. Search for those four signatures across the theme.
4. **Defer to a follow-up:**
   - Söhne / Tiempos licensing decision
   - Artwork, illustration, and copy changes
   - Component structure changes (cards, tables, hero composition)

---

## 8 · Open questions for review  ⏳ Pending

1. **Font license budget.** Switzer ships free; if there's appetite for ~$2.5k one-time on Söhne + Tiempos Headline, we can swap the font-family lines without changing anything else. Yes / no / later?
2. **Signature mark (§6).** Ship in this PR or defer? Falls into the "premium signal" bucket but is the most subjective change here.
3. **Where else does `--color-deep` get applied?** Metric strip is the obvious one. Are there other large surfaces (pricing tiers, footer, hero alt-state) we should reverse to deep teal in a follow-up?

---

*Companion: `colors_and_type.css` (current tokens) and `premium-tokens.css` (proposed) at the root of the design-system project. The full diff is the difference between those two files.*
