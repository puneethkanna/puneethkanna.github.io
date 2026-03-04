---
phase: 6
plan: 1
wave: 1
milestone: v2.0
---

# Plan 6.1: Global Design Tokens + Perlin Noise Hero Background

## Objective
Establish the global CSS token system (colors, timings, easing) that all future interactivity hooks into. Then layer an animated Perlin noise background on the hero section that breathes independently — no cursor dependency. Implements SPEC Goals #9 and #10.

## Context
- `.gsd/SPEC.md` — Goals #9 (Design Tokens), #10 (Noise Background), color palette table
- `assets/css/main.css` — Add `:root` tokens here at the very top of the file
- `index.html` — Hero section `<header id="home">` receives the SVG noise layer
- `assets/js/animations.js` — GSAP animation for noise evolution

## Tasks

<task type="auto">
  <name>Inject global CSS design tokens into main.css</name>
  <files>assets/css/main.css</files>
  <action>
    At the very TOP of `assets/css/main.css` (before any existing rules), prepend a new `:root` block:

    ```css
    /* ============================================================
       GLOBAL DESIGN TOKEN SYSTEM — v2.0 Phase 6.1
       One place to control the entire portfolio palette + timings.
       ============================================================ */
    :root {
      /* --- Developer Identity Color Palette --- */
      --color-java:      hsl(150, 60%, 45%);   /* Java / Spring Boot green */
      --color-reactive:  hsl(190, 100%, 55%);  /* Kafka / WebFlux cyan */
      --color-security:  hsl(38,  100%, 55%);  /* Keycloak / Auth amber */
      --color-devops:    hsl(215,  60%, 60%);  /* DevOps / Docker steel blue */
      --color-language:  hsl(265,  60%, 65%);  /* Programming languages violet */
      --color-database:  hsl(0,    60%, 60%);  /* Database ruby-red */

      /* --- Blob / Noise Variants (see TODO.md for A/B/C verification) --- */
      /* Switch between: 0.04 (A-subtle) | 0.12 (C-section-aware) | 0.15 (B-ambient) */
      --blob-intensity: 0.12;
      --blob-speed: 20s;   /* Controls CSS keyframe duration for blob pulse */

      /* --- Animation Timings --- */
      --dur-instant: 0.1s;
      --dur-fast:    0.2s;
      --dur-normal:  0.4s;
      --dur-slow:    0.8s;
      --dur-xslow:   1.4s;

      /* --- Easing Curves --- */
      --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
      --ease-smooth:   cubic-bezier(0.4, 0, 0.2, 1);
      --ease-enter:    cubic-bezier(0, 0, 0.2, 1);
      --ease-exit:     cubic-bezier(0.4, 0, 1, 1);
    }
    ```

    Rules:
    - Place BEFORE all existing CSS. The existing `:root` block (if any) lists `--bg-color`, `--text-color`, `--accent-color` etc. — DO NOT remove those. These new tokens AUGMENT, never replace.
    - Do not alter any existing rule.
  </action>
  <verify>grep -n "color-java\|color-reactive\|blob-intensity\|ease-spring" assets/css/main.css | head -20</verify>
  <done>All 6 color tokens, 3 blob vars, 5 timing vars, and 4 easing vars present at top of main.css</done>
</task>

<task type="auto">
  <name>Add Perlin noise SVG layer to hero section in index.html</name>
  <files>index.html</files>
  <action>
    Inside the `<header id="home" class="hero section">` element, add the following as the VERY FIRST child (before the `<h4>` tag):

    ```html
    <!-- Perlin Noise Animated Background — Phase 6.1 -->
    <div class="hero-noise-layer" aria-hidden="true">
      <svg class="noise-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <filter id="noise-filter" x="0%" y="0%" width="100%" height="100%"
                  color-interpolation-filters="sRGB">
            <feTurbulence
              id="noise-turbulence"
              type="fractalNoise"
              baseFrequency="0.0035 0.0045"
              numOctaves="4"
              seed="2"
              stitchTiles="stitch"
              result="noise"/>
            <feColorMatrix
              type="saturate"
              values="2.5"
              in="noise"
              result="colored-noise"/>
            <feBlend
              in="SourceGraphic"
              in2="colored-noise"
              mode="screen"
              result="blended"/>
            <feComponentTransfer in="blended">
              <feFuncA type="linear" slope="var(--blob-intensity, 0.12)"/>
            </feComponentTransfer>
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter="url(#noise-filter)"
          class="noise-rect"/>
      </svg>
    </div>
    ```

    Rules:
    - This goes INSIDE `<header id="home">`, as the first child, before any existing content.
    - Do NOT alter any other HTML.
    - The SVG is `aria-hidden="true"` — purely decorative.
  </action>
  <verify>grep -n "hero-noise-layer\|noise-filter\|feTurbulence" index.html | head -15</verify>
  <done>SVG noise layer is first child of hero header; feTurbulence with correct attributes is present</done>
</task>

<task type="auto">
  <name>Style the noise layer and animate it with GSAP</name>
  <files>assets/css/main.css, assets/js/animations.js</files>
  <action>
    **In `assets/css/main.css`** — append at the END:

    ```css
    /* ============================================================
       PERLIN NOISE HERO BACKGROUND — Phase 6.1
       ============================================================ */
    .hero-noise-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
      border-radius: inherit;
    }

    .noise-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: var(--blob-intensity, 0.12);
      mix-blend-mode: screen;
    }

    /* Hero must be positioned so the absolute child works */
    .hero {
      position: relative;
    }

    /* All hero content sits above the noise layer */
    .hero > *:not(.hero-noise-layer) {
      position: relative;
      z-index: 1;
    }

    /* Slow color-shift animation on the noise rect */
    @keyframes noise-color-drift {
      0%   { fill: var(--color-reactive); }
      25%  { fill: var(--color-java); }
      50%  { fill: var(--color-security); }
      75%  { fill: var(--color-devops); }
      100% { fill: var(--color-reactive); }
    }

    .noise-rect {
      animation: noise-color-drift var(--blob-speed, 20s) ease-in-out infinite;
      will-change: fill;
    }
    ```

    **In `assets/js/animations.js`** — append at the END:

    ```js
    /* ============================================================
       PERLIN NOISE EVOLUTION — Phase 6.1
       Slowly shifts the turbulence baseFrequency to make the noise
       field evolve organically over time.
       ============================================================ */
    (function initNoiseAnimation() {
      const turbulence = document.getElementById('noise-turbulence');
      if (!turbulence) return;

      // Two oscillating values for X and Y frequency give organic movement
      gsap.to({ freqX: 0.0035, freqY: 0.0045 }, {
        freqX: 0.0055,
        freqY: 0.003,
        duration: 14,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        onUpdate: function() {
          turbulence.setAttribute(
            'baseFrequency',
            `${this.targets()[0].freqX.toFixed(5)} ${this.targets()[0].freqY.toFixed(5)}`
          );
        }
      });
    })();
    ```

    Rules:
    - Only APPEND to both files. Do not modify existing code.
    - The CSS `@keyframes noise-color-drift` uses the design tokens — automatically picks up any token changes.
    - GSAP `repeat: -1, yoyo: true` gives a smooth pendulum-like noise evolution without jarring resets.
    - `will-change: fill` is the only promotion hint needed; transform is not used here.
  </action>
  <verify>grep -n "hero-noise-layer\|noise-color-drift\|initNoiseAnimation" assets/css/main.css assets/js/animations.js</verify>
  <done>Noise layer styled; CSS keyframe drift animates fill through developer color palette; GSAP morphs baseFrequency for organic noise evolution</done>
</task>

## Success Criteria
- [ ] All design tokens present in `:root` at top of `main.css`; existing tokens untouched
- [ ] Hero section shows subtle animated noise texture at 60fps
- [ ] Noise color slowly drifts through the developer palette (green → cyan → amber → blue)
- [ ] `--blob-intensity` token switch instantly changes opacity across the board
- [ ] Hero content (text, buttons) sits above noise layer visually
- [ ] No layout shifts — hero height/structure identical to v1.0

## Notes
- After this plan executes, test the 3 blob variants by setting `--blob-intensity` to `0.04`, `0.12`, `0.15` and compare visually (see TODO.md for verification task)
- The noise SVG uses `mix-blend-mode: screen` — on light theme it will be less visible, which is correct behavior
