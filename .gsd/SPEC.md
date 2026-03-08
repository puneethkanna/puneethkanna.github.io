# SPEC.md — Project Specification

> **Status**: `FINALIZED` (v2.0 — Interactivity, Blog & Expansion)

## Vision
A "simple, sweet, and stunning" professional portfolio that reflects technical expertise through high-quality animations (GSAP), fluid minimalist design, and subtle interactivity that feels alive without being distracting.
**v2.0 focus**: Interactive enhancement layer, Markdown-driven blog engine, mobile navigation.

## Tech Stack (Locked)
- **HTML/CSS/Vanilla JS** — No build tools, no frameworks
- **GSAP + ScrollTrigger** — All animations and scroll-driven interactions
- **Lenis** — Smooth scroll
- **Marked.js** — Client-side Markdown parsing (blog engine)
- **Prism.js** — Syntax highlighting for code blocks in blog posts
- **GitHub Pages** — Hosting (static files only)

## Goals (v1.0 — Complete ✅)
1. Personal branding — clean, dark portfolio
2. GSAP scroll animations
3. Light/Dark theme toggle
4. Sections: Hero, About, Experience, Projects, Contact
5. Accessible, semantic HTML (WCAG)
6. 90+ Lighthouse performance score
7. Open Graph / Twitter meta tags
8. Resume PDF download

## Goals (v2.0 — Interactivity Layer)

### 9. Global Design Token System
All colors, animation timings, and easing curves as CSS custom properties in `:root`. One file controls the entire palette. New `--color-*` tokens reflect the backend developer tech identity.

**Developer Color Palette**:
| Token | Value | Represents |
|-------|-------|-----------|
| `--color-java` | `hsl(150, 60%, 45%)` | Java / Spring Boot |
| `--color-reactive` | `hsl(190, 100%, 55%)` | Kafka / WebFlux |
| `--color-security` | `hsl(38, 100%, 55%)` | Keycloak / Auth |
| `--color-devops` | `hsl(215, 60%, 60%)` | DevOps / Docker |
| `--color-accent` | `hsl(160, 100%, 70%)` | Primary teal — retained |
| `--blob-intensity` | `0.04 / 0.12 / 0.15` | Noise blob opacity — A/B/C variant |

### 10. Perlin Noise Animated Hero Background
An SVG `feTurbulence`-based animated noise field as the hero section background layer. Evolves continuously. Variant controlled by `--blob-intensity` token. Three intensity variants (A: subtle, B: ambient, C: section-aware hue shift) — to be A/B tested post-implementation.

### 11. Elastic Word-Spring Hero Headline
Hero `<h1>` words animate in with alternating-direction elastic spring entrance (GSAP `elastic.out`) on page load. On scroll-away, words disperse outward. No scramble/glitch.

### 12. Ink-Splash Hover on Primary CTA Button
On mouse-enter the "About My Expertise" button, a liquid ink-fill radiates from cursor entry point via GSAP `clip-path: circle()` expansion. On mouse-leave, reverses. Subtle tilt (2–3°) on hover. Single magnetic element — expand to others only if this feels right.

### 13. Skills Section — Categorized Group Boxes
Skills regrouped into categories matching Puneeth's tech identity, displayed as bordered category boxes with pill-shaped tags + skill icons. Category-level color token applied as border/glow on scroll-in.

**Skill Categories** (inspired by Satya's grouping, but Puneeth's identity):
| Category | Skills |
|----------|--------|
| Programming Languages | Java (JDK 17/21), SQL |
| Frameworks & Libraries | Spring Boot, Spring WebFlux, Reactive Programming |
| Architecture & Messaging | Apache Kafka, Event-Driven Design, TMF Open APIs |
| Security & Identity | Keycloak, RBAC, OAuth2 |
| Databases | PostgreSQL, Redis |
| DevOps & Tools | Docker, Linux, CI/CD, Postman, Git |

Each category box: GSAP stagger fade-in on scroll. Skill pills: sequential reveal. Hover: `scale(1.08)` + border-glow pulse using category color token.

### 14. Scroll Progress Indicator
Thin vertical line on the left of the viewport that fills as user scrolls. Active section anchor highlights on the line. CSS custom property `--scroll-progress` driven by ScrollTrigger.

### 15. Section Underline Draw-on-Scroll
Section `<h2>` decorative underlines animate from `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` when section enters viewport. GSAP ScrollTrigger, no JS on hot path.

## Goals (v2.0 — Blog Engine)
16. **Blog Engine**: Static-file based blog using Marked.js client-side rendering. Posts in `/blog/posts/*.md`. Post index at `/blog/posts/index.json`.
17. **Syntax Highlighting**: Prism.js in blog post reader.
18. **Filtering/Tagging**: Client-side tag filter on blog listing.

## Goals (v2.0 — Mobile Navigation)
19. **Mobile Menu**: Hamburger + GSAP overlay for screens < 768px. *(Phase 6.1 plan already written)*

## Non-Goals (Out of Scope)
- Database-backed CMS
- Comment system, E-commerce
- Generic cursor follower ring *(explicitly dropped — too common)*
- Text scramble/glitch *(explicitly dropped — overused pattern)*
- Server-side rendering

## Success Criteria (v2.0)
- [ ] Design tokens in `:root` — changing one variable cascades everywhere
- [ ] Noise blob hero background running at 60fps, no jank
- [ ] Hero headline elastic entrance on load, disperses on scroll-away
- [ ] CTA button ink-splash animates from cursor entry point
- [ ] Skills grouped in category boxes, each with correct color token applied
- [ ] Scroll progress indicator tracks active section
- [ ] Section h2 underlines draw on scroll-in
- [ ] Blog posts render from `.md` files
- [ ] Mobile nav works on all breakpoints < 768px
- [ ] 90+ Lighthouse score maintained throughout
