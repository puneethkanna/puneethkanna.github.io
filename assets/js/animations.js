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
        if (window.startChronosphere) window.startChronosphere();
        initScrollReveals();
        initHeroParallax();
        initFlashlight();
        initCursorFollower();
        initExperienceTimeline();
        initSkillsAnimation();
        initCardInteractivity();
        initLogoHacker();
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
    gsap.utils.toArray('.reveal-up').forEach((el) => {
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
 * --- Ambient Flashlight Fade ---
 */
function initFlashlight() {
    gsap.to('.brittany-flashlight', {
        opacity: 1, // Full opacity is handled in CSS logic now, this just makes it active
        scrollTrigger: {
            trigger: '#about', // Start revealing outside of hero
            start: 'top 85%',
            end: 'top 30%',
            scrub: true,
            onEnter: () => document.body.classList.add('is-scrolled'),
            onLeaveBack: () => document.body.classList.remove('is-scrolled')
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
    const grid = document.querySelector('.skills-container');
    if (!grid) return;

    const cards = gsap.utils.toArray('.skill-card');

    cards.forEach((card, i) => {
        const pills = card.querySelectorAll('.skill-pill');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=80',
                toggleActions: 'play none none none',
            }
        });

        tl.to(card, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' })
            .fromTo(pills,
                { opacity: 0, scale: 0.8, y: 10 },
                { opacity: 1, scale: 1, y: 0, stagger: 0.02, duration: 0.4, ease: 'back.out(1.2)' },
                '-=0.5'
            );
    });

    // SAFETY FALLBACK
    setTimeout(() => {
        gsap.to('.skill-card', { opacity: 1, y: 0, duration: 0.5, overwrite: 'auto' });
    }, 3000);
}

/**
 * --- Card Interactivity: 3D Tilt & Skew ---
 * High-performance 3D tilt effect for skill and project cards.
 */
function initCardInteractivity() {
    const cards = gsap.utils.toArray('.skill-card, .project-card');

    cards.forEach(card => {
        // Force flat initial state to prevent scroll-reveal tilt from sticking
        gsap.set(card, { rotateX: 0, rotateY: 0, z: 0, scale: 1 });

        // Create an inner glow element if it's a project card
        let glare = card.querySelector('.project-card-glare');
        if (!glare && card.classList.contains('project-card')) {
            glare = document.createElement('div');
            glare.className = 'project-card-glare';
            card.appendChild(glare);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Dynamic rotation mapping (Boosted for better visibility)
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            // Apply 3D transform with depth and slight scale
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                z: 10,
                scale: 1.03,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });

            // Move the glare based on mouse position
            if (glare) {
                const moveX = (x / rect.width) * 100;
                const moveY = (y / rect.height) * 100;
                gsap.to(glare, {
                    background: `radial-gradient(circle at ${moveX}% ${moveY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                    duration: 0.2
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                z: 0,
                scale: 1,
                duration: 0.8,
                ease: 'elastic.out(1, 0.6)',
                overwrite: 'auto'
            });

            if (glare) {
                gsap.to(glare, {
                    background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 60%)`,
                    duration: 0.5
                });
            }
        });
    });
}




/**
 * --- Custom Mouse Follower (Cuberto-inspired) ---
 */
function initCursorFollower() {
    const follower = document.getElementById('cursor-follower');
    if (!follower) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
    let stickyElement = null;

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Expose mouse variables for the Brittany Chiang flashlight effect
        document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    });

    gsap.ticker.add(() => {
        let tx = mouseX;
        let ty = mouseY;

        // Sticky Snapping Logic
        if (stickyElement) {
            const rect = stickyElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Follower snaps 65% towards the center of the element, but still follows mouse inertia
            tx = centerX + (mouseX - centerX) * 0.35;
            ty = centerY + (mouseY - centerY) * 0.35;
        }

        posX = lerp(posX, tx, 0.15);
        posY = lerp(posY, ty, 0.15);

        gsap.set(follower, {
            x: posX - (follower.offsetWidth / 2),
            y: posY - (follower.offsetHeight / 2)
        });
    });

    const interactive = document.querySelectorAll('a, button, .nav__brand');
    interactive.forEach(el => {
        // Simple scale back for safety, but removing the hovering class logic
        el.addEventListener('mouseleave', () => {
            stickyElement = null; 
            gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
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



/* assets/js/animations.js */

// ==============================================================================
//  REACTIVE NETWORK GRAPH ENGINE
// ==============================================================================
//  Senior Microservices Developer Portfolio (Puneeth)
// ==============================================================================

(function () {
    "use strict";

    window.addEventListener('DOMContentLoaded', () => {
        if (!gsap || !ScrollTrigger) return;

        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // CONFIGURABLE TECH NODES — label + Devicon SVG URL
        // url: null → falls back to text rendering
        const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
        const techNodes = [
            { label: 'Java', url: `${CDN}/java/java-plain.svg` },
            { label: 'Spring Boot', url: `${CDN}/spring/spring-original.svg` },
            { label: 'Kafka', url: `${CDN}/apachekafka/apachekafka-original.svg` },
            { label: 'PostgreSQL', url: `${CDN}/postgresql/postgresql-plain.svg` },
            { label: 'Docker', url: `${CDN}/docker/docker-plain.svg` },
            { label: 'Kubernetes', url: `${CDN}/kubernetes/kubernetes-plain.svg` },
            { label: 'Redis', url: `${CDN}/redis/redis-plain.svg` },
            { label: 'AWS', url: `${CDN}/amazonwebservices/amazonwebservices-plain-wordmark.svg` },
            { label: 'Git', url: `${CDN}/git/git-plain.svg` },
            { label: 'Linux', url: `${CDN}/linux/linux-plain.svg` },
            { label: 'Jenkins', url: `${CDN}/jenkins/jenkins-plain.svg` },
            { label: 'MongoDB', url: `${CDN}/mongodb/mongodb-plain.svg` },
            { label: 'Postman', url: `${CDN}/postman/postman-plain.svg` },
            { label: 'Hibernate', url: `${CDN}/hibernate/hibernate-plain.svg` },
            { label: 'Keycloak', url: `https://svgl.app/library/keycloak.svg` },
            { label: 'WebFlux', url: `${CDN}/spring/spring-original.svg` },
            { label: 'Microservices', url: null },
            { label: 'OAuth2', url: null },
            { label: 'gRPC', url: null },
        ];
        // Pre-attach Image objects for canvas rendering
        techNodes.forEach(node => {
            if (node.url) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = node.url;
                node.img = img;
            } else {
                node.img = null;
            }
        });

        let width, height;
        let animationFrameId;
        let lastTheme = null;

        const TOTAL_PARTICLES = 130; // Dense enough for a good network
        const particles = [];

        const mouse = { x: -1000, y: -1000, radius: 180, isActive: false };
        let isScrollingDown = false;
        let systemState = 'loading';

        class Particle {
            constructor(index) {
                this.index = index;
                this.techNode = (index < techNodes.length) ? techNodes[index] : null;
                this.label = this.techNode ? this.techNode.label : null;
                if (!this.label && Math.random() < 0.1) {
                    const rnd = techNodes[Math.floor(Math.random() * techNodes.length)];
                    this.techNode = rnd;
                    this.label = rnd.label;
                }
                this.reset();
            }

            reset() {
                this.pos = { x: width ? width / 2 : 0, y: height ? height / 2 : 0 };

                // Labeled nodes bias to the right side so they don't overlap hero text
                if (this.label) {
                    this.target = {
                        x: (width || 1000) * (0.5 + Math.random() * 0.45),
                        y: Math.random() * (height || 1000)
                    };
                } else {
                    this.target = {
                        x: Math.random() * (width || 1000),
                        y: Math.random() * (height || 1000)
                    };
                }

                // For scroll outro
                this.offsetY = 0;

                this.vel = {
                    x: (Math.random() - 0.5) * 0.8,
                    y: (Math.random() - 0.5) * 0.8
                };

                this.baseRadius = this.label ? Math.random() * 2 + 4 : Math.random() * 1.5 + 1.2;
                this.radius = 0;

                // Theme-aware color palette
                this.isSky = Math.random() > 0.3;
                const theme = document.documentElement.getAttribute('data-theme') || 'dark';
                this.updateColor(theme === 'dark');

                this.alpha = 0;
                this.pulseOffset = Math.random() * Math.PI * 2;  // Breathing phase offset
            }

            updateColor(isDark) {
                if (isDark) {
                    this.color = this.isSky ? { r: 56, g: 189, b: 248 } : { r: 129, g: 140, b: 248 };
                } else {
                    // Deeper, high-contrast colors for light theme
                    this.color = this.isSky ? { r: 2, g: 132, b: 199 } : { r: 79, g: 70, b: 229 };
                }
            }

            update() {
                if (systemState === 'active') {
                    this.pos.x += this.vel.x;
                    this.pos.y += this.vel.y;

                    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
                    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

                    if (mouse.isActive) {
                        let dx = mouse.x - this.pos.x;
                        let dy = mouse.y - (this.pos.y + this.offsetY);
                        let distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < mouse.radius) {
                            const force = (mouse.radius - distance) / mouse.radius;
                            // Slight repulsion 
                            this.pos.x -= (dx / distance) * force * 1.2;
                            this.pos.y -= (dy / distance) * force * 1.2;

                            this.currentAlpha = Math.min(this.alpha + force * 0.6, 1);
                            this.currentRadius = this.baseRadius + force * 2;
                        } else {
                            this.currentAlpha = this.alpha;
                            this.currentRadius = this.baseRadius;
                        }
                    } else {
                        this.currentAlpha = this.alpha;
                        this.currentRadius = this.baseRadius;
                    }
                } else {
                    this.currentAlpha = this.alpha;
                    this.currentRadius = this.baseRadius;
                }
            }

            draw(time) {
                if (this.currentAlpha <= 0.01) return;

                const drawY = this.pos.y + this.offsetY;

                // Subtle breathing pulse for labeled nodes
                let pulseAlpha = this.currentAlpha;
                let pulseRadius = this.currentRadius;
                if (this.label && systemState === 'active') {
                    const breathe = Math.sin((time || 0) * 0.002 + this.pulseOffset) * 0.15 + 0.85;
                    pulseAlpha = this.currentAlpha * breathe;
                    pulseRadius = this.currentRadius * (breathe * 0.3 + 0.85);
                }

                // Glow halo behind labeled nodes
                if (this.label && pulseAlpha > 0.2) {
                    const gradient = ctx.createRadialGradient(
                        this.pos.x, drawY, pulseRadius,
                        this.pos.x, drawY, pulseRadius * 4
                    );
                    gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${pulseAlpha * 0.25})`);
                    gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
                    ctx.beginPath();
                    ctx.arc(this.pos.x, drawY, pulseRadius * 4, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }

                // Core node dot
                ctx.beginPath();
                ctx.arc(this.pos.x, drawY, pulseRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${pulseAlpha})`;
                ctx.fill();

                // Theme-tinted logo icon (Material You / Pixel Launcher approach)
                // Each icon inherits its parent particle's exact theme color
                if (this.label && pulseAlpha > 0.15) {
                    const tn = this.techNode;
                    if (tn && tn.img && tn.img.complete && tn.img.naturalWidth > 0) {
                        const iconSize = 26;
                        const iconX = this.pos.x + pulseRadius + 8;
                        const iconY = drawY - iconSize / 2;

                        // Filter for monochromatic pixel icons matching the theme
                        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
                        const isDark = theme === 'dark';
                        const isSky = this.color.r < 100 && isDark || (this.color.r === 2 && !isDark);

                        let themeFilter;
                        if (isDark) {
                            // Dark Theme: Bright white base, then tint
                            themeFilter = isSky
                                ? 'brightness(0) invert(1) sepia(100%) saturate(10000%) hue-rotate(150deg) brightness(1.2)'
                                : 'brightness(0) invert(1) sepia(100%) saturate(10000%) hue-rotate(185deg) brightness(1.1)';
                        } else {
                            // Light Theme: Black base, then deep tint for contrast
                            themeFilter = isSky
                                ? 'brightness(0) sepia(100%) saturate(10000%) hue-rotate(170deg) brightness(0.7)'
                                : 'brightness(0) sepia(100%) saturate(10000%) hue-rotate(210deg) brightness(0.6)';
                        }

                        ctx.save();
                        ctx.globalAlpha = pulseAlpha * 0.85;
                        ctx.filter = themeFilter;
                        ctx.drawImage(tn.img, iconX, iconY, iconSize, iconSize);
                        ctx.filter = 'none';
                        ctx.restore();
                    }
                }
            }
        }

        function initSystem() {
            setCanvasSize();
            particles.length = 0;
            for (let i = 0; i < TOTAL_PARTICLES; i++) {
                particles.push(new Particle(i));
            }
            particles.forEach(p => {
                p.pos = { x: width / 2, y: height / 2 };
                p.target = { x: Math.random() * width, y: Math.random() * height };
            });
        }

        function setCanvasSize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }

        function startLoop() {
            if (!animationFrameId) drawLoop();
        }

        window.startChronosphere = function () {
            startLoop();

            const loadTimeline = gsap.timeline();

            // Create dummy objects to tween pos
            const tweenTargets = particles.map(p => ({
                x: p.pos.x,
                y: p.pos.y,
                alpha: 0,
                radius: 0
            }));

            loadTimeline
                .set(canvas, { opacity: 1 })
                .add(() => { systemState = 'loading'; })
                .to(tweenTargets, {
                    duration: 2.5,
                    x: (i) => particles[i].target.x,
                    y: (i) => particles[i].target.y,
                    alpha: (i) => particles[i].label ? Math.random() * 0.3 + 0.7 : Math.random() * 0.4 + 0.3,
                    radius: (i) => particles[i].baseRadius,
                    stagger: { each: 0.005, from: "center" },
                    ease: "power3.out",
                    onUpdate: function () {
                        tweenTargets.forEach((t, i) => {
                            particles[i].pos.x = t.x;
                            particles[i].pos.y = t.y;
                            particles[i].alpha = t.alpha;
                            particles[i].baseRadius = t.radius;
                        });
                    }
                })
                .add(() => {
                    systemState = 'active';
                    gsap.to('.reveal-text', { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power4.out" });
                }, "-=1.0");
        };

        function drawLoop() {
            ctx.clearRect(0, 0, width, height);

            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            const isDark = theme === 'dark';

            // Handle theme change dynamically
            if (theme !== lastTheme) {
                particles.forEach(p => p.updateColor(isDark));
                lastTheme = theme;
            }

            const lineBaseColor = isDark ? '148, 163, 184' : '71, 85, 105';

            particles.forEach(p => p.update());

            ctx.lineWidth = 0.6;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];

                    const drawY1 = p1.pos.y + p1.offsetY;
                    const drawY2 = p2.pos.y + p2.offsetY;

                    const dx = p1.pos.x - p2.pos.x;
                    const dy = drawY1 - drawY2;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 160) {
                        const opacity = (1 - dist / 160) * Math.min(p1.currentAlpha, p2.currentAlpha);
                        if (opacity > 0.01) {

                            let lineGlow = 0;
                            if (mouse.isActive) {
                                const dot = (((mouse.x - p1.pos.x) * (p2.pos.x - p1.pos.x)) + ((mouse.y - drawY1) * (drawY2 - drawY1))) / Math.pow(dist, 2);
                                const closestX = p1.pos.x + (dot * (p2.pos.x - p1.pos.x));
                                const closestY = drawY1 + (dot * (drawY2 - drawY1));

                                const onSegment = dot >= 0 && dot <= 1;
                                if (onSegment) {
                                    const dMouseLine = Math.sqrt(Math.pow(mouse.x - closestX, 2) + Math.pow(mouse.y - closestY, 2));
                                    if (dMouseLine < mouse.radius) {
                                        lineGlow = (mouse.radius - dMouseLine) / mouse.radius;
                                    }
                                }
                            }

                            if (lineGlow > 0.1) {
                                const predominantColor = p1.color.r > p1.color.b ? p1.color : p2.color;
                                ctx.strokeStyle = `rgba(${predominantColor.r}, ${predominantColor.g}, ${predominantColor.b}, ${Math.max(opacity, lineGlow * 0.9)})`;
                                ctx.lineWidth = 1.8;
                            } else {
                                ctx.strokeStyle = `rgba(${lineBaseColor}, ${opacity * 0.7})`;
                                ctx.lineWidth = 0.9;
                            }

                            ctx.beginPath();
                            ctx.moveTo(p1.pos.x, drawY1);
                            ctx.lineTo(p2.pos.x, drawY2);
                            ctx.stroke();
                        }
                    }
                }
            }

            particles.forEach(p => p.draw(performance.now()));
            animationFrameId = requestAnimationFrame(drawLoop);
        }

        function initScrollTriggers() {
            ScrollTrigger.create({
                trigger: '#about',
                start: 'top 80%',
                end: 'top top',
                scrub: true,
                onUpdate: (self) => {
                    if (self.progress > 0.1 && !isScrollingDown) {
                        isScrollingDown = true;
                        systemState = 'transitioning';
                        gsap.to(particles, {
                            duration: 1,
                            offsetY: height,
                            alpha: 0,
                            stagger: { each: 0.002, from: "bottom" },
                            ease: "power2.in"
                        });
                        gsap.to(canvas, { opacity: 0, duration: 0.8 });
                    } else if (self.progress < 0.1 && isScrollingDown) {
                        isScrollingDown = false;
                        systemState = 'active';
                        gsap.killTweensOf(particles);
                        gsap.to(particles, {
                            duration: 0.8,
                            offsetY: 0,
                            alpha: (i) => particles[i].label ? Math.random() * 0.4 + 0.4 : Math.random() * 0.3 + 0.1,
                            stagger: { each: 0.002, from: "top" },
                            ease: "power2.out"
                        });
                        gsap.to(canvas, { opacity: 1, duration: 0.8 });
                    }
                }
            });
        }

        function initInteractionListeners() {
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                mouse.isActive = true;
            });
            window.addEventListener('mouseleave', () => {
                mouse.isActive = false;
            });

            window.addEventListener('resize', () => {
                setCanvasSize();
                particles.forEach(p => {
                    if (p.pos.x > width) p.pos.x = width;
                    if (p.pos.y > height) p.pos.y = height;
                });
            });
        }

        initSystem();
        initInteractionListeners();
        initScrollTriggers();

    });
})();

/* assets/js/init.js (or top of theme.js) */

// Preloader Intro (Visuals that happen *instantly* upon load)
document.addEventListener('DOMContentLoaded', () => {
    // Reveal preloader elements
    gsap.set('.preloader-inner span, .preloader-line', { opacity: 1 });
    gsap.from('.preloader-inner span', { y: 20, stagger: 0.05, duration: 0.8, ease: "power3.out" });
    gsap.from('.preloader-line', { scaleX: 0, duration: 1.2, ease: "circ.inOut", delay: 0.2 });
});
