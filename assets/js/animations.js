/**
 * GSAP ANIMATIONS — High Performance, Modular, Pluggable
 * - Preloader
 * - Hero Canvas Dot-Grid Background
 * - ScrollReveals (Sections, Titles, Cards)
 * - Experience Timeline Integration
 * - Skills Stagger
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Hide
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.8,
                ease: 'power3.inOut',
                onComplete: () => {
                    preloader.classList.add('is-hidden');
                    initAllAnimations();
                }
            });
        });
    } else {
        initAllAnimations();
    }
});

function initAllAnimations() {
    // Use matchMedia to respect prefers-reduced-motion
    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
        initHeroCanvas();
        initHeroTypewriter();
        initScrollReveals();
        initHeroParallax();
        initSectionTitles();
        initExperienceTimeline();
        initSkillsAnimation();
        initCardInteractivity();
        initLogoHacker();
        initMagneticButtons();

        // Refresh ScrollTrigger to ensure all positions are calculated correctly
        ScrollTrigger.refresh();

        // Final catch-all refresh after a small delay to handle slow-loading fonts/layout
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    });

    // Refresh one more time on full window load for safety
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    });

    // Simple reveal for low-motion users
    mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set('.reveal-text, .reveal-up, .section, .skill-card, .project-card', { opacity: 1, y: 0 });
    });
}

/**
 * --- Hero Canvas: Animated Dot-Grid ---
 * High-performance canvas-based background for the hero section.
 */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let dots = [];
    let mouseX = 0, mouseY = 0;
    const spacing = 40;
    const maxDistance = 150;

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initDots();
    };

    const initDots = () => {
        dots = [];
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                dots.push({ x, y, baseSize: 1, size: 1 });
            }
        }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        ctx.fillStyle = theme === 'dark' ? 'rgba(255, 77, 90, 0.4)' : 'rgba(230, 57, 70, 0.2)';

        dots.forEach(dot => {
            const dx = mouseX - dot.x;
            const dy = mouseY - dot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
                const scale = 1 + (1 - dist / maxDistance) * 3;
                dot.size = gsap.utils.interpolate(dot.size, scale, 0.1);
            } else {
                dot.size = gsap.utils.interpolate(dot.size, dot.baseSize, 0.1);
            }

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    };

    resize();
    animate();
}

/**
 * --- Hero Typewriter ---
 */
function initHeroTypewriter() {
    const tagline = document.querySelector('.hero__tagline');
    if (!tagline) return;

    const text = tagline.innerText;
    tagline.innerHTML = '';

    const chars = text.split('').map(char => {
        const span = document.createElement('span');
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        tagline.appendChild(span);
        return span;
    });

    gsap.to(chars, {
        opacity: 1,
        stagger: 0.03,
        duration: 0.1,
        ease: 'none',
        delay: 0.5
    });
}

/**
 * --- Scroll Reveals ---
 */
function initScrollReveals() {
    gsap.utils.toArray('.reveal-text, .reveal-up').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 50, scale: 0.98 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 92%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Specific Stagger for Project Cards
    gsap.from('.project-card', {
        opacity: 0,
        y: 60,
        scale: 0.95,
        rotationX: -5,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 85%',
        }
    });
}

/**
 * --- Hero Parallax ---
 */
function initHeroParallax() {
    gsap.to('.hero__content', {
        yPercent: 30,
        opacity: 0,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.hero__canvas', {
        yPercent: 15,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

/**
 * --- Section Title Line Reveal ---
 */
function initSectionTitles() {
    gsap.utils.toArray('.section__title').forEach((title) => {
        const line = gsap.from(title, {
            '--title-scale': 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 90%'
            }
        });
    });
}

/**
 * --- Experience Timeline Integration ---
 */
function initExperienceTimeline() {
    gsap.utils.toArray('.timeline__item').forEach((item) => {
        const marker = item.querySelector('.timeline__marker');
        const content = item.querySelector('.timeline__content');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
            }
        });

        tl.from(marker, { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
            .from(content, { opacity: 0, x: -30, duration: 1, ease: 'expo.out' }, '-=0.6');
    });

    // Education cards stagger
    gsap.from('.education__item', {
        opacity: 0,
        y: 40,
        scale: 0.95,
        stagger: 0.15,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.education__grid',
            start: 'top 85%'
        }
    });
}

/**
 * --- Skills Category Box Stagger ---
 */
function initSkillsAnimation() {
    const grid = document.querySelector('.skills-grid');
    if (!grid) return;

    const cards = gsap.utils.toArray('.skill-card');

    cards.forEach((card, i) => {
        const pills = card.querySelectorAll('.pill');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=80', // Trigger when card enters the bottom of viewport
                toggleActions: 'play none none none',
                // Log for debugging if needed (uncomment in local dev)
                // onEnter: () => console.log(`Card ${i} entered`),
            }
        });

        tl.fromTo(card,
            { opacity: 0, y: 30, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' }
        ).fromTo(pills,
            { opacity: 0, scale: 0.8, x: -10 },
            { opacity: 1, scale: 1, x: 0, stagger: 0.03, duration: 0.5, ease: 'back.out(1.2)' },
            '-=0.4'
        );
    });

    // SAFETY FALLBACK: If elements are still hidden after 3 seconds, show them.
    // This handles any edge cases where ScrollTrigger fails to fire.
    setTimeout(() => {
        gsap.to('.skill-card', { opacity: 1, y: 0, scale: 1, duration: 0.5, overwrite: 'auto' });
    }, 3000);
}

/**
 * --- Card Interactivity: 3D Tilt & Skew ---
 * High-performance 3D tilt effect for skill and project cards.
 */
function initCardInteractivity() {
    const cards = gsap.utils.toArray('.skill-card, .project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Small tilt
            const rotateY = ((x - centerX) / centerX) * 5;
            const skewX = ((x - centerX) / centerX) * -2; // Subtle skew

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                skewX: skewX,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                skewX: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)',
                overwrite: 'auto'
            });
        });
    });
}

/**
 * --- Logo Hacker Effect ---
 * Character randomizer for the brand name on hover.
 */
function initLogoHacker() {
    const logo = document.querySelector('.nav__brand');
    const originalText = "puneeth";
    const letters = "abcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
    let interval = null;

    logo.addEventListener("mouseenter", () => {
        let iteration = 0;
        clearInterval(interval);

        interval = setInterval(() => {
            logo.innerHTML = originalText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("") + '<span class="accent">.</span>';

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);
    });
}

/**
 * --- Cuberto × Satya Pro: Magnetic Liquid Buttons ---
 * Implements smooth magnetic movement and precise radial fill tracking.
 */
function initMagneticButtons() {
    const magnifiers = document.querySelectorAll('.btn-magnetic');

    magnifiers.forEach(mag => {
        const btn = mag.querySelector('.btn');

        mag.addEventListener('mousemove', (e) => {
            const rect = mag.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // 1. Magnetic Movement (move button toward cursor - Satya style)
            // Factor reduced from 0.45 to 0.3 to prevent distortion
            const moveX = (x - centerX) * 0.3;
            const moveY = (y - centerY) * 0.3;

            // 2. Subtle 3D Tilt (Optional polish, toned down significantly)
            const rotateX = (centerY - y) * 0.05;
            const rotateY = (x - centerX) * 0.05;

            gsap.to(btn, {
                x: moveX,
                y: moveY,
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: 'auto'
            });

            // 3. Liquid Fill Tracker (Cuberto Style)
            const btnRect = btn.getBoundingClientRect();
            const fillX = e.clientX - btnRect.left;
            const fillY = e.clientY - btnRect.top;

            btn.style.setProperty('--x', `${fillX}px`);
            btn.style.setProperty('--y', `${fillY}px`);
        });

        mag.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.4)',
                overwrite: 'auto'
            });
        });
    });
}
