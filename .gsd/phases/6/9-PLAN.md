---
phase: 6
plan: 4
wave: 3
milestone: v2.0
---

# Plan 6.4: Scroll Progress Indicator + Section Underline Draw

## Objective
Two polish interactions that reward attention: (1) A thin vertical progress bar on the left edge of the viewport that fills as you scroll — each section's anchor lights up when active. (2) Section `<h2>` title underlines that "draw" from left to right when entering the viewport, reinforcing the sense of things being written in real time. Implements SPEC Goals #14 and #15.

## Context
- `.gsd/SPEC.md` — Goals #14 (Scroll Progress), #15 (Section Underline Draw)
- `index.html` — Sections: `#about`, `#experience`, `#projects`, `#contact`; `<h2 class="section-title">` in each
- `assets/css/main.css` — Progress bar + underline draw styles
- `assets/js/animations.js` — ScrollTrigger for both interactions

## Tasks

<task type="auto">
  <name>Add scroll progress indicator markup to index.html</name>
  <files>index.html</files>
  <action>
    Inside `<body id="page-top">`, as the VERY FIRST child (before `<nav>`), add:

    ```html
    <!-- Scroll Progress Indicator — Phase 6.4 -->
    <div class="scroll-progress-track" aria-hidden="true">
      <div class="scroll-progress-bar" id="scroll-progress-bar"></div>
      <!-- Section anchor dots — one per main section -->
      <div class="scroll-anchor" data-section="#about"    style="top: 25%"></div>
      <div class="scroll-anchor" data-section="#experience" style="top: 50%"></div>
      <div class="scroll-anchor" data-section="#projects"  style="top: 75%"></div>
      <div class="scroll-anchor" data-section="#contact"   style="top: 93%"></div>
    </div>
    ```

    Rules:
    - Must be the first child of `<body>` — before `<nav>`.
    - The `top` percentages are approximate section positions; they are visual only.
    - `aria-hidden="true"` — purely decorative, no interaction.
  </action>
  <verify>grep -n "scroll-progress-track\|scroll-anchor" index.html | head -10</verify>
  <done>scroll-progress-track with 4 anchor dots present as first child of body</done>
</task>

<task type="auto">
  <name>Style progress indicator and underline draw in main.css; animate both in animations.js</name>
  <files>assets/css/main.css, assets/js/animations.js</files>
  <action>
    **In `assets/css/main.css`** — append at the END:

    ```css
    /* ============================================================
       SCROLL PROGRESS INDICATOR — Phase 6.4
       ============================================================ */
    .scroll-progress-track {
      position: fixed;
      left: 1.2rem;
      top: 15%;
      height: 70%;
      width: 2px;
      background: var(--border-color);
      z-index: 900;
      border-radius: 2px;
      display: none; /* shown only on large screens */
    }

    @media (min-width: 1024px) {
      .scroll-progress-track {
        display: block;
      }
    }

    .scroll-progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0%;     /* JS updates this */
      background: var(--accent-color);
      border-radius: 2px;
      transition: height 0.1s linear;
      will-change: height;
    }

    .scroll-anchor {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 7px;
      height: 7px;
      border-radius: 50%;
      border: 1.5px solid var(--border-color);
      background: var(--bg-color);
      transition: border-color var(--dur-fast, 0.2s) ease,
                  background   var(--dur-fast, 0.2s) ease,
                  transform    var(--dur-fast, 0.2s) var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1));
    }

    .scroll-anchor.is-active {
      border-color: var(--accent-color);
      background: var(--accent-color);
      transform: translate(-50%, -50%) scale(1.4);
    }

    /* ============================================================
       SECTION TITLE UNDERLINE DRAW — Phase 6.4
       ============================================================ */
    .section-title {
      position: relative;
    }

    .section-title > span {
      position: relative;
      display: inline-block;
    }

    /* The decorative underline is the ::after pseudo-element */
    .section-title > span::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      height: 2px;
      width: 100%;
      background: var(--accent-color);
      border-radius: 1px;
      /* Start fully clipped (invisible) — JS triggers expand */
      clip-path: inset(0 100% 0 0);
      transition: clip-path 0.6s var(--ease-smooth, cubic-bezier(0.4,0,0.2,1));
    }

    /* JS adds this class on scroll-in */
    .section-title.underline-drawn > span::after {
      clip-path: inset(0 0% 0 0);
    }
    ```

    **In `assets/js/animations.js`** — append at the END:

    ```js
    /* ============================================================
       SCROLL PROGRESS INDICATOR — Phase 6.4
       ============================================================ */
    (function initScrollProgress() {
      const bar = document.getElementById('scroll-progress-bar');
      const anchors = document.querySelectorAll('.scroll-anchor');
      if (!bar) return;

      // Update bar height on scroll
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          bar.style.height = (self.progress * 100) + '%';
        }
      });

      // Activate anchor dots per section
      const sections = ['#about', '#experience', '#projects', '#contact'];
      sections.forEach((sel) => {
        const el = document.querySelector(sel);
        const dot = document.querySelector(`.scroll-anchor[data-section="${sel}"]`);
        if (!el || !dot) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter:      () => dot.classList.add('is-active'),
          onLeave:      () => dot.classList.remove('is-active'),
          onEnterBack:  () => dot.classList.add('is-active'),
          onLeaveBack:  () => dot.classList.remove('is-active')
        });
      });
    })();

    /* ============================================================
       SECTION TITLE UNDERLINE DRAW — Phase 6.4
       ============================================================ */
    (function initUnderlineDraw() {
      const titles = document.querySelectorAll('.section-title');
      if (!titles.length) return;

      titles.forEach((title) => {
        ScrollTrigger.create({
          trigger: title,
          start: 'top 85%',
          once: true,
          onEnter: () => title.classList.add('underline-drawn')
        });
      });
    })();
    ```

    Rules:
    - ONLY append to both files; no modifications to existing code.
    - Progress bar uses `height` (not `scaleY`) to avoid transform conflicts with positioning.
    - Scroll progress track only shows on `min-width: 1024px` — not cluttering mobile.
    - `once: true` on underline — draws in once, stays.
    - The CSS `transition` on `clip-path` handles the animation — no GSAP needed for the underline itself, keeping it lightweight.
  </action>
  <verify>grep -n "initScrollProgress\|initUnderlineDraw\|underline-drawn\|scroll-progress" assets/css/main.css assets/js/animations.js | tail -20</verify>
  <done>Scroll progress bar fills on scroll; section dots activate when section is in viewport center; section title underlines draw left-to-right on scroll-in</done>
</task>

## Success Criteria
- [ ] On desktop (≥ 1024px): vertical progress track visible on left edge
- [ ] Progress bar fills from top as page scrolls — height reflects position accurately
- [ ] Section anchor dots light up (accent color + scale) when their section is active center-screen
- [ ] Dot deactivates when scrolling away from section
- [ ] Each section `<h2>` underline draws from left to right on scroll-into-view
- [ ] Underline stays drawn (no reverse animation on scroll-up)
- [ ] Progress track hidden on mobile/tablet (< 1024px) — no layout interference

## Notes
- The anchor dot `top` percentages in HTML are visual approximations — they don't need to exactly match section scroll position (the JS handles the real activation based on actual section positions)
- If a section is too short and the dot never activates, adjust `start: 'top center'` to `start: 'top 70%'` for that section
