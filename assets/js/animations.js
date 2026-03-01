// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Animations
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initTitleAnimations();
});

function initScrollReveals() {
    // Fade up reveal for sections
    const reveals = gsap.utils.toArray('.section');
    reveals.forEach(section => {
        gsap.from(section.querySelectorAll('h2, p, .about-content, .experience-item, .project-card, .skills-grid > div'), {
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
            start: "top 85%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
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
