# TODO.md

- [x] Locate `assets/sections` if possible, otherwise extract from `index.html`.
- [x] Initialize CSS Design System with fluid layout foundations (SPEC Goal 7).
- [x] Implement Light/Dark mode.
- [x] Establish performance baseline (SPEC Goal 8).

---

## Deferred — Future Plans

- [ ] **Hero tagline copy improvement**: Current: *"I build scalable enterprise systems."* → Explore a shorter, punchier alternative once core interactivity is stable. Good candidates: *"I architect systems that scale."* / *"I turn events into products."*. The elastic word-spring animation will land better with 3–5 words max. *(Deferred from v2.0 Phase 6 planning, 2026-03-04)*

- [ ] **Noise blob intensity A/B verification**: Phase 6 implements 3 variants controllable via CSS token `--blob-intensity`:
  - **Variant A (`subtle`)**: Opacity `0.04`, small amplitude — textural depth, barely conscious
  - **Variant B (`ambient`)**: Opacity `0.15`, slower/wider blobs — expressive, closer to Satya's feel
  - **Variant C (`section-aware`)**: Opacity `0.12`, blobs shift hue based on the active section's color token
  - Task: After execution, visually verify all 3 variants and decide which to keep. *(Noted 2026-03-04)*

- [ ] **Card tilt interaction**: After CTA ink-splash (Phase 6) ships and feels good, revisit adding `rotateX/rotateY` tilt to project cards on hover. Implement in Phase 7 or later.
