# STATE.md — Project Memory

> **Plan 1 Status**: `CLOSED` ✅ (Milestone v1.0)
> **Plan 2 Status**: `PLANNING COMPLETE` 🗂️ (Milestone v2.0 — Ready for Execution)
> **Current Focus**: Refining Scrolling and Skills UX — ready to /execute

## Current Position
- **Phase**: 6 — Interactivity Layer (Advanced Polish)
- **Task**: Premium Animation Overhaul (Magnetic Buttons, Liquid Fill, 3D Cards)
- **Status**: Paused at 2026-03-05 00:45

## Last Session Summary
Implemented high-end, award-winning interactivity inspired by reference portfolios (Cuberto, Satya K). Focused on the "clubbed" button experience combining magnetic movement, liquid ink-fill reveals, and 3D perspective tilts.

## In-Progress Work
- Implemented **3D Tilt & Skew** for Skill and Project cards via GSAP `rotateX/Y` tracking.
- Added **Hacker Logo Interaction**: Character randomizer for the brand "puneeth." on hover.
- Overhauled **Magnetic Buttons**:
    - **Movement**: Satya-style magnetic pull (moves toward cursor).
    - **Fill**: Cuberto-style liquid radial fill (expands from mouse entry point).
    - **Polish**: Fixed text-wrapping and sizing bugs causing distorted button shapes.
    - **Visuals**: Added glossy "glint" shimmer effect.

## Blockers
None. Sizing issues resolved via `white-space: nowrap` and absolute positioning of the fill layer.

## Context Dump
### Decisions Made
- **Isolation Mode**: Used `isolation: isolate` on buttons to allow the background liquid fill to expand without needing complex `z-index` layering on every child element.
- **Pill Shape**: Changed button borders to `100px` for a modern, circular Cuberto feel.
- **Toned Down Physics**: Reduced magnetic factor from 0.45 to 0.3 after user feedback that buttons felt "very large" or distorted during movement.

### Approaches Tried
- **clip-path vs scale**: Initially used CSS `clip-path` for the liquid fill, but switched to a GSAP-tracked radial `scale` div. This is more robust for "following" the mouse entry point precisely.
- **Fixing Sizing**: Identified that the `btn__fill` was previously taking up physical space. Moved to `position: absolute !important` to fix the "messed up" sizing report.

### Current Hypothesis
The current combination of magnetic pull + subtle 3D tilt + radial fill is the optimal "premium" balance. Performance is stable at 60fps.

### Files of Interest
- `assets/js/animations.js`: Contains `initMagneticButtons` and `initLogoHacker`.
- `assets/css/main.css`: Contains the refined `.btn` and `.btn__fill` declarations.

## Next Steps
1. Verify Mobile Navigation (Phase 7) — Ensure the new button logic doesn't interfere with small-touch targets.
2. Review Horizontal Scroll potential for the Projects section.
3. Review global performance with high-end animations active.
