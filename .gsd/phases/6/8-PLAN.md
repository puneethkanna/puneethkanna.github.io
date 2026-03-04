---
phase: 6
plan: 3
wave: 3
milestone: v2.0
---

# Plan 6.3: Skills Section Redesign — Categorized Group Boxes

## Objective
Replace the current flat skill list with a Satya-inspired-but-original grouped category box layout. Each category (Programming Languages, Frameworks & Libraries, etc.) gets a bordered card container with sequential pill-tag reveals on scroll and a category-specific color glow. Implements SPEC Goal #13.

## Context
- `.gsd/SPEC.md` — Goal #13, Skill Categories table (6 categories + their color tokens)
- `index.html` — Current skills grid around lines 147–179; this section will be fully replaced
- `assets/css/main.css` — Category box + pill styles to append
- `assets/js/animations.js` — GSAP stagger scroll-in per category box
- Design tokens from Plan 6.1: `--color-language`, `--color-java`, `--color-reactive`, `--color-security`, `--color-database`, `--color-devops`

## Tasks

<task type="auto">
  <name>Replace skills grid HTML with categorized group boxes</name>
  <files>index.html</files>
  <action>
    Find the existing skills section inside `<section id="experience">`. It looks like:
    ```html
    <div class="skills-list" style="margin-top: 4rem;">
      <h2 class="section-title"><span>Skills & Expertise</span></h2>
      <div class="skills-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
        ... (the three divs: Backend, Architecture, DevOps & Tools) ...
      </div>
    </div>
    ```

    Replace the ENTIRE `.skills-list` div (from `<div class="skills-list"...>` to its closing `</div>`) with:

    ```html
    <div class="skills-list" style="margin-top: 4rem;">
      <h2 class="section-title"><span>Skills & Expertise</span></h2>
      <div class="skills-categories">

        <!-- Programming Languages -->
        <div class="skill-category" data-category-color="var(--color-language)">
          <h4 class="category-label">Programming Languages</h4>
          <div class="skill-pills">
            <span class="skill-pill">Java (JDK 17/21)</span>
            <span class="skill-pill">SQL</span>
            <span class="skill-pill">Shell / Bash</span>
          </div>
        </div>

        <!-- Frameworks & Libraries -->
        <div class="skill-category" data-category-color="var(--color-java)">
          <h4 class="category-label">Frameworks & Libraries</h4>
          <div class="skill-pills">
            <span class="skill-pill">Spring Boot</span>
            <span class="skill-pill">Spring WebFlux</span>
            <span class="skill-pill">Reactive Programming</span>
            <span class="skill-pill">Project Reactor</span>
          </div>
        </div>

        <!-- Architecture & Messaging -->
        <div class="skill-category" data-category-color="var(--color-reactive)">
          <h4 class="category-label">Architecture & Messaging</h4>
          <div class="skill-pills">
            <span class="skill-pill">Apache Kafka</span>
            <span class="skill-pill">Event-Driven Design</span>
            <span class="skill-pill">TMF Open APIs</span>
            <span class="skill-pill">Microservices</span>
          </div>
        </div>

        <!-- Security & Identity -->
        <div class="skill-category" data-category-color="var(--color-security)">
          <h4 class="category-label">Security & Identity</h4>
          <div class="skill-pills">
            <span class="skill-pill">Keycloak</span>
            <span class="skill-pill">OAuth2 / RBAC</span>
            <span class="skill-pill">Multi-Tenant Design</span>
          </div>
        </div>

        <!-- Databases -->
        <div class="skill-category" data-category-color="var(--color-database)">
          <h4 class="category-label">Databases</h4>
          <div class="skill-pills">
            <span class="skill-pill">PostgreSQL</span>
            <span class="skill-pill">Redis</span>
            <span class="skill-pill">CriteriaBuilder / JPQL</span>
          </div>
        </div>

        <!-- DevOps & Tools -->
        <div class="skill-category" data-category-color="var(--color-devops)">
          <h4 class="category-label">DevOps & Tools</h4>
          <div class="skill-pills">
            <span class="skill-pill">Docker</span>
            <span class="skill-pill">CI/CD</span>
            <span class="skill-pill">Linux / Shell</span>
            <span class="skill-pill">Postman</span>
            <span class="skill-pill">Git</span>
          </div>
        </div>

      </div>
    </div>
    ```

    Rules:
    - Replace ONLY the `.skills-list` div; leave everything before and after it untouched.
    - `data-category-color` is used by JS to apply the glow color dynamically.
  </action>
  <verify>grep -n "skill-category\|skill-pill\|category-label" index.html | head -30</verify>
  <done>All 6 category boxes present in HTML; each has data-category-color; skill pills present within each box</done>
</task>

<task type="auto">
  <name>Style skill category boxes and pills in main.css, animate with GSAP</name>
  <files>assets/css/main.css, assets/js/animations.js</files>
  <action>
    **In `assets/css/main.css`** — append at the END:

    ```css
    /* ============================================================
       SKILLS — CATEGORY GROUP BOXES — Phase 6.3
       ============================================================ */
    .skills-categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .skill-category {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      position: relative;
      background: var(--bg-color);
      transition: border-color var(--dur-normal, 0.4s) var(--ease-smooth, ease),
                  box-shadow var(--dur-normal, 0.4s) var(--ease-smooth, ease);
      /* Initial state for GSAP — JS will reset opacity and translateY */
    }

    /* Glow on scroll-reveal — JS adds .is-visible */
    .skill-category.is-visible {
      border-color: var(--category-color, var(--border-color));
      box-shadow: 0 0 18px -4px var(--category-color, transparent);
    }

    .category-label {
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--category-color, var(--text-color));
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .skill-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-pill {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      border: 1px solid var(--border-color);
      border-radius: 999px;
      font-size: 0.82rem;
      font-family: monospace;
      color: var(--text-color);
      background: transparent;
      cursor: default;
      transition: transform var(--dur-fast, 0.2s) var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1)),
                  border-color var(--dur-fast, 0.2s) ease,
                  box-shadow var(--dur-fast, 0.2s) ease;
      /* Initial state for GSAP stagger reveal */
      opacity: 0;
      transform: translateY(10px);
    }

    .skill-pill:hover {
      transform: scale(1.08) translateY(-2px);
      border-color: var(--category-color, var(--accent-color));
      box-shadow: 0 0 10px -2px var(--category-color, var(--accent-color));
    }

    @media (max-width: 600px) {
      .skills-categories {
        grid-template-columns: 1fr;
      }
    }
    ```

    **In `assets/js/animations.js`** — append at the END:

    ```js
    /* ============================================================
       SKILLS CATEGORY BOXES — Scroll-in animation — Phase 6.3
       ============================================================ */
    (function initSkillsAnimation() {
      const categories = document.querySelectorAll('.skill-category');
      if (!categories.length) return;

      categories.forEach((cat) => {
        // Apply category color as CSS custom property on the element
        const color = cat.dataset.categoryColor;
        if (color) cat.style.setProperty('--category-color', color);

        const pills = cat.querySelectorAll('.skill-pill');

        // Initial hidden state for the box itself
        gsap.set(cat, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: cat,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            // 1. Box slides up and fades in
            gsap.to(cat, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              onComplete: () => cat.classList.add('is-visible')
            });
            // 2. Pills inside stagger reveal sequentially
            gsap.to(pills, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
              stagger: 0.055,
              delay: 0.25
            });
          }
        });
      });
    })();
    ```

    Rules:
    - ONLY append to both files. Do not modify any existing code.
    - `--category-color` is set inline per element, so each box's glow/label color is automatic.
    - `once: true` in ScrollTrigger means the animation fires exactly once (no re-trigger on scroll up).
    - Pills start with `opacity: 0; transform: translateY(10px)` in CSS — matches GSAP `set` state.
  </action>
  <verify>grep -n "skill-category\|skill-pill\|initSkillsAnimation\|is-visible" assets/css/main.css assets/js/animations.js | tail -30</verify>
  <done>Category boxes and pills styled; GSAP stagger scroll-in fires once per category; category color token applied dynamically; pill hover scale+glow works</done>
</task>

## Success Criteria
- [ ] 6 category boxes visible in skills section, each in a bordered card
- [ ] Desktop: 2–3 column grid; Mobile: single column
- [ ] Each category label is colored with its token (purple, green, cyan, amber, red, blue)
- [ ] On scroll-into-view: box slides up, then pills stagger in sequentially
- [ ] Box border glows with category color on reveal (`is-visible` class adds glow)
- [ ] Hovering a pill: `scale(1.08)` + category-colored border glow

## Notes
- Old skills grid (3 columns: Backend/Architecture/DevOps) is fully replaced — no orphaned CSS from it will show since grid classes were inline styles
- If any category color feels too bright in dark mode, reduce HSL lightness in the token — one place to change
