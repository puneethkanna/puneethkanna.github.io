// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Animations
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initTitleAnimations();
    initElasticText();
    initInkSplash();
    initSkillsAnimation();
});

function initScrollReveals() {
    // Fade up reveal for sections
    const reveals = gsap.utils.toArray('.section');
    reveals.forEach(section => {
        gsap.from(section.querySelectorAll('h2, p, .about-content, .experience-item, .skills-grid > div'), {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        });
    });

    // Specific staggering for project cards
    gsap.from(".project-card", {
        scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 88%",
            once: true
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "all"
    });
}

function initTitleAnimations() {
    const titles = gsap.utils.toArray('.section-title');
    titles.forEach(title => {
        gsap.fromTo(title,
            { "--title-width": "0px" },
            {
                "--title-width": "300px",
                scrollTrigger: {
                    trigger: title,
                    start: "top 90%",
                },
                duration: 1.2,
                ease: "power2.inOut"
            }
        );
    });
}

/* ============================================================
   PERLIN NOISE EVOLUTION — Phase 6.1 (Optimized)
   ============================================================ */
(function initNoiseAnimation() {
    const turbulence = document.getElementById('noise-turbulence');
    if (!turbulence) return;

    // Only animate when the hero is in view to save CPU
    const anim = gsap.to({ freqX: 0.0035, freqY: 0.0045 }, {
        freqX: 0.0055,
        freqY: 0.003,
        duration: 10,
        ease: 'none',
        repeat: -1,
        yoyo: true,
        paused: true,
        lazy: true,
        onUpdate: function () {
            // Significant optimization: only update the attribute
            turbulence.setAttribute(
                'baseFrequency',
                `${this.targets()[0].freqX.toFixed(4)} ${this.targets()[0].freqY.toFixed(4)}`
            );
        }
    });

    ScrollTrigger.create({
        trigger: "#home",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => anim.play(),
        onLeave: () => anim.pause(),
        onEnterBack: () => anim.play(),
        onLeaveBack: () => anim.pause()
    });
})();

/* ============================================================
   ELASTIC WORD-SPRING HEADLINE — Phase 6.2
   Springs words in on load and disperses them on scroll.
   ============================================================ */
function initElasticText() {
    const words = gsap.utils.toArray('.elastic-text span');
    if (!words.length) return;

    // First, set the hidden state explicitly (optional but safer)
    gsap.set(words, { opacity: 0, y: 50, rotateX: -90 });

    // 1. Entrance Animation
    const entranceTl = gsap.timeline({
        delay: 0.5,
        onComplete: () => {
            // 2. Initialize Scroll Trigger only AFTER entrance
            initScrollDispersion(words);
        }
    });

    entranceTl.to(words, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.04,
        duration: 1.0,
        ease: "elastic.out(1, 0.75)"
    });
}

function initScrollDispersion(words) {
    words.forEach((word, i) => {
        gsap.to(word, {
            scrollTrigger: {
                trigger: "#home",
                start: "top top",
                end: "50% top",
                scrub: 1,
                invalidateOnRefresh: true,
                fastScrollEnd: true // Performance boost
            },
            x: (i % 2 === 0 ? -80 : 80) * (Math.random() + 0.5),
            y: -100 * Math.random(),
            rotation: (Math.random() - 0.5) * 30,
            opacity: 0,
            force3D: true, // Use hardware acceleration
            ease: "power1.inOut"
        });
    });
}

/* ============================================================
   INK-SPLASH LIQUID CTA — Phase 6.2
   Cursor-aware splash effect using CSS variables + GSAP.
   ============================================================ */
function initInkSplash() {
    const btn = document.querySelector('.ink-btn');
    if (!btn) return;

    const pool = btn.querySelector('.ink-pool');

    btn.addEventListener('mouseenter', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set splash origin
        btn.style.setProperty('--x', `${x}px`);
        btn.style.setProperty('--y', `${y}px`);

        gsap.to(pool, {
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(pool, {
            scale: 0,
            duration: 0.4,
            ease: "power2.in"
        });
    });

    // Subtle 3D Tilt
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const dx = x - xc;
        const dy = y - yc;

        gsap.to(btn, {
            rotateY: dx / 10,
            rotateX: -dy / 5,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
}

/* ============================================================
   SKILLS CATEGORY BOXES — Scroll-in animation — Phase 6.3
   ============================================================ */
function initSkillsAnimation() {
    const categories = document.querySelectorAll('.skill-category');
    if (!categories.length) return;

    categories.forEach((cat) => {
        // Apply category color as CSS custom property on the element
        const color = cat.dataset.categoryColor;
        if (color) cat.style.setProperty('--category-color', color);

        const pills = cat.querySelectorAll('.skill-pill');

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
}

