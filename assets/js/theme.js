/**
 * THEME & UI INTERACTIONS
 * - Theme toggle (Dark/Light)
 * - Mobile Menu (Hamburger)
 * - Navbar Scroll Effects
 * - Lenis Smooth Scroll Initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initNavbarScroll();
});

/**
 * --- Theme Toggle Logic ---
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }
}

/**
 * --- Mobile Menu (Hamburger) ---
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    const links = document.querySelectorAll('.mobile-menu__link');

    if (!hamburger || !mobileMenu) return;

    const toggleMenu = () => {
        const isOpen = hamburger.classList.toggle('is-open');
        mobileMenu.classList.toggle('is-open');

        hamburger.setAttribute('aria-expanded', isOpen);
        // Prevent body scroll when menu is open
        body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

/**
 * --- Navbar Scroll Effects ---
 */
function initNavbarScroll() {
    const nav = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // 1. Hide/Show Nav on scroll (optional, but good for focus)
        if (currentScroll > 100) {
            if (currentScroll > lastScroll) {
                nav.classList.add('is-hidden');
            } else {
                nav.classList.remove('is-hidden');
            }
        } else {
            nav.classList.remove('is-hidden');
        }

        // 2. Update Scroll Progress CSS Variable
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? winScroll / height : 0;

        document.documentElement.style.setProperty('--scroll-progress', scrolled);

        lastScroll = currentScroll;
    }, { passive: true });

    // Active Link Highlight on Scroll using IntersectionObserver
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav__link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * --- Native Smooth Scroll Anchors ---
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = document.getElementById('navbar').offsetHeight || 80;
            window.scrollTo({
                top: target.offsetTop - navHeight,
                behavior: 'smooth'
            });
        }
    });
});
