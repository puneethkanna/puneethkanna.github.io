---
phase: 6
plan: 2
wave: 2
milestone: v2.0
---

# Plan 6.2: Elastic Word-Spring Headline + Ink-Splash CTA Button

## Objective
Make the hero feel dimensionally alive on page load. Each word in the hero `<h1>` springs in from an alternating direction with GSAP elastic easing. The primary CTA button ("About My Expertise") gets an ink-splash hover — a liquid fill expanding from the exact mouse entry point. Implements SPEC Goals #11 and #12.

## Context
- `.gsd/SPEC.md` — Goals #11 (Elastic Headline), #12 (Ink-Splash CTA)
- `index.html` — Hero `<h1>` elements (lines 73–74); CTA button (line 78)
- `assets/css/main.css` — Ink-splash clip-path + word-wrap styles
- `assets/js/animations.js` — GSAP entrance and ink-splash logic
- `assets/css/main.css` already has `--ease-spring`, `--color-accent` tokens from Plan 6.1

## Tasks

<task type="auto">
  <name>Wrap hero h1 words in span elements for individual animation</name>
  <files>index.html</files>
  <action>
    Find the two hero `<h1>` lines (currently around lines 73–74):
    ```html
    <h1>Puneeth.</h1>
    <h1 class="text-muted">I build scalable enterprise systems.</h1>
    ```

    Replace them with word-wrapped versions:
    ```html
    <h1 class="hero-headline" aria-label="Puneeth.">
      <span class="word" style="display:inline-block; overflow:hidden;">
        <span class="word-inner">Puneeth.</span>
      </span>
    </h1>
    <h1 class="hero-headline text-muted" aria-label="I build scalable enterprise systems.">
      <span class="word" style="display:inline-block; overflow:hidden;">
        <span class="word-inner">I</span>
      </span>
      <span class="word" style="display:inline-block; overflow:hidden; margin-left: 0.25em;">
        <span class="word-inner">build</span>
      </span>
      <span class="word" style="display:inline-block; overflow:hidden; margin-left: 0.25em;">
        <span class="word-inner">scalable</span>
      </span>
      <span class="word" style="display:inline-block; overflow:hidden; margin-left: 0.25em;">
        <span class="word-inner">enterprise</span>
      </span>
      <span class="word" style="display:inline-block; overflow:hidden; margin-left: 0.25em;">
        <span class="word-inner">systems.</span>
      </span>
    </h1>
    ```

    Also, add the ink-splash class to the primary CTA button (around line 78):
    Find: `<a href="#about" class="btn btn-primary">About My Expertise</a>`
    Replace with: `<a href="#about" class="btn btn-primary btn-ink-splash" id="cta-primary">About My Expertise</a>`

    Rules:
    - The outer `.word` has `overflow:hidden` — this clips the animation
    - The inner `.word-inner` is what GSAP animates (translateY)
    - `aria-label` on the h1 preserves screen reader semantics
    - Only change these specific lines; nothing else
  </action>
  <verify>grep -n "word-inner\|btn-ink-splash\|hero-headline" index.html | head -20</verify>
  <done>Both h1 elements have word/word-inner structure; CTA button has btn-ink-splash class and id="cta-primary"</done>
</task>

<task type="auto">
  <name>Add ink-splash CSS styles to main.css</name>
  <files>assets/css/main.css</files>
  <action>
    Append at the END of `assets/css/main.css`:

    ```css
    /* ============================================================
       INK-SPLASH CTA BUTTON — Phase 6.2
       ============================================================ */
    .btn-ink-splash {
      position: relative;
      overflow: hidden;
      isolation: isolate; /* Creates new stacking context for the pseudo-element */
    }

    /* The ink circle that expands from cursor entry point */
    .btn-ink-splash::before {
      content: '';
      position: absolute;
      /* JS sets --ink-x and --ink-y as percentages of button dimensions */
      left: var(--ink-x, 50%);
      top: var(--ink-y, 50%);
      transform: translate(-50%, -50%) scale(0);
      width: 300%;   /* Must be large enough to cover the button fully when scaled */
      aspect-ratio: 1;
      background: var(--text-color);
      border-radius: 50%;
      clip-path: circle(0% at 50% 50%);
      transition: clip-path 0.5s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1));
      z-index: -1;
      mix-blend-mode: difference;
      pointer-events: none;
    }

    .btn-ink-splash:hover::before,
    .btn-ink-splash:focus-visible::before {
      clip-path: circle(75% at 50% 50%);
    }

    /* Subtle tilt is handled by JS/GSAP — no CSS needed for it */
    ```

    Rules:
    - Only append, no modifications
    - `mix-blend-mode: difference` inverts colors at the overlap region — gives a striking contrast without needing to know the exact bg/text colors
    - `clip-path: circle()` is GPU-composited, zero layout cost
  </action>
  <verify>grep -n "btn-ink-splash\|ink-x\|ink-y" assets/css/main.css | tail -20</verify>
  <done>ink-splash CSS present; pseudo-element uses CSS custom properties --ink-x/--ink-y; mix-blend-mode: difference applied</done>
</task>

<task type="auto">
  <name>Implement elastic word entrance and ink-splash JS in animations.js</name>
  <files>assets/js/animations.js</files>
  <action>
    Append at the END of `assets/js/animations.js`:

    ```js
    /* ============================================================
       ELASTIC WORD-SPRING HERO HEADLINE — Phase 6.2
       Words spring in from alternating vertical directions on load,
       disperse outward on scroll-away via ScrollTrigger.
       ============================================================ */
    (function initElasticHeadline() {
      const wordInners = document.querySelectorAll('.hero-headline .word-inner');
      if (!wordInners.length) return;

      // Set initial state: each word hidden below/above depending on odd/even index
      gsap.set(wordInners, (index) => ({
        yPercent: index % 2 === 0 ? 110 : -110,
        opacity: 0
      }));

      // Spring entrance on page load
      const entranceTl = gsap.timeline({ delay: 0.2 });
      entranceTl.to(wordInners, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'elastic.out(1.1, 0.55)',
        stagger: {
          each: 0.09,
          from: 'start'
        }
      });

      // Scroll-away: words disperse in their entrance direction
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          const pct = self.progress * 120;  // Max 120% translateY
          wordInners.forEach((el, i) => {
            const dir = i % 2 === 0 ? 1 : -1;
            gsap.set(el, { yPercent: pct * dir, opacity: 1 - self.progress * 0.8 });
          });
        }
      });
    })();

    /* ============================================================
       INK-SPLASH CTA BUTTON — Phase 6.2
       Tracks mouse entry position, updates CSS custom properties
       --ink-x / --ink-y for the clip-path pseudo-element origin.
       Adds subtle 3D tilt toward cursor.
       ============================================================ */
    (function initInkSplash() {
      const btn = document.getElementById('cta-primary');
      if (!btn) return;

      function getRelativeCoords(e, el) {
        const rect = el.getBoundingClientRect();
        return {
          x: ((e.clientX - rect.left) / rect.width)  * 100 + '%',
          y: ((e.clientY - rect.top)  / rect.height) * 100 + '%'
        };
      }

      btn.addEventListener('mouseenter', (e) => {
        const { x, y } = getRelativeCoords(e, btn);
        btn.style.setProperty('--ink-x', x);
        btn.style.setProperty('--ink-y', y);
      });

      // Subtle tilt toward cursor
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const rotX =  ((e.clientY - cy) / (rect.height / 2)) * -3; // max 3deg
        const rotY =  ((e.clientX - cx) / (rect.width  / 2)) *  3;
        gsap.to(btn, { rotateX: rotX, rotateY: rotY, duration: 0.3, ease: 'power2.out', transformPerspective: 600 });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    })();
    ```

    Rules:
    - Only APPEND; do not modify existing code
    - Both functions are IIFEs — isolated scope
    - `ScrollTrigger` is already registered by existing animations.js — no need to re-register
    - The `elastic.out(1.1, 0.55)` gives a single overshoot spring — not bouncy, just alive
    - Tilt uses `transformPerspective: 600` inline (no need for CSS perspective property)
  </action>
  <verify>grep -n "initElasticHeadline\|initInkSplash\|word-inner\|cta-primary" assets/js/animations.js | tail -20</verify>
  <done>Elastic word-spring entrance + scroll-away dispersion working; ink-splash updates --ink-x/--ink-y on mouseenter; tilt animation on mousemove with elastic spring-back on mouseleave</done>
</task>

## Success Criteria
- [ ] On page load: hero h1 words spring in from alternating up/down directions with elastic easing
- [ ] Words stagger 90ms apart — fluid, not synchronous
- [ ] On scroll: words drift apart and fade as hero exits viewport
- [ ] Hovering CTA button: ink circle expands from cursor entry point filling button
- [ ] Mouse-leave CTA: ink retreats, tilt spring-backs elastically
- [ ] `aria-label` on h1 preserved — screen readers read full text
- [ ] No layout shift — h1 still occupies same space; word wrapping identical

## Notes
- The `overflow: hidden` on `.word` is critical — without it the pre-entrance position is visible
- If the elastic animation feels too bouncy, reduce amplitude: `elastic.out(0.9, 0.6)` in animations.js
