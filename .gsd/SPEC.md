# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A "simple, sweet, and stunning" professional portfolio that reflects technical expertise through high-quality animations (GSAP) and a fluid, minimalist design. It draws inspiration from the minimalist structure of Brittany Chiang and the dynamic interaction effects of Satya Lokesh.

## Goals
1. **Minimalist Excellence**: Replicate the clean, high-end editorial look of `v4.brittanychiang.com`.
2. **Dynamic Interactions**: Integrate GSAP-powered "revealing" and scrolling effects inspired by `srisatyalokesh.github.io`.
3. **Theming**: Implement a robust Light/Dark theme system.
4. **Responsiveness**: Ensure a "fluid layout" that adapts seamlessly to Mobile, Tablet, and Desktop.
5. **Performance**: Use Vanilla JS and lightweight libraries to ensure fast page loads.
6. **Resume Access**: Provide prominent PDF Resume download buttons in Header and Hero sections.
7. **Full Responsive Support** — Ensure every section is responsive and works flawlessly on all major breakpoints.
8. **Performance & Navigation** — Maintain good lighthouse score by ensuring or satifying above goals.

## Non-Goals (Out of Scope)
- Multi-page architecture (this is a single-page vertical scroll site).
- Integration with external CMS (content is managed via local files).
- Complex backend features (this is a static-first portfolio).

## Users
- Potential employers and recruiters looking for a clear, professional summary of skills and experience.
- Technical peers interested in project details and technical expertise.

## Constraints
- **Tech Stack**: Vanilla HTML/CSS/JS + GSAP.
- **Animations**: Must be smooth and high-performance.
- **Navigation**: Single-page vertical scroll with smooth-scroll.

## Success Criteria
- [ ] GSAP animations are fluid and respond correctly to scroll/interaction.
- [ ] Theme toggle works instantly with persistent state.
- [ ] High Lighthouse scores (90+) for Performance and Accessibility.
- [ ] Responsive design works flawlessly on all major breakpoints.
