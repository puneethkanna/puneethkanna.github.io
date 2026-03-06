import re

with open('assets/js/animations.js', 'r') as f:
    content = f.read()

new_engine = """// ==============================================================================
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
        
        // CONFIGURABLE LABELS - ADD ANY NAME HERE
        const nodeLabels = [
            "Kafka", "Reactive", "Spring Boot", "JDK 21", 
            "Publisher", "Consumer", "PostgreSQL", "Docker", 
            "Kubernetes", "WebFlux", "Event-Driven", "Microservices",
            "Redis", "TMF Open API", "API Gateway", "OAuth2",
            "CI/CD", "AWS", "gRPC"
        ];

        let width, height;
        let animationFrameId;

        const TOTAL_PARTICLES = 130; // Dense enough for a good network
        const particles = [];

        const mouse = { x: -1000, y: -1000, radius: 180, isActive: false };
        let isScrollingDown = false;
        let systemState = 'loading'; 

        const loadTimeline = gsap.timeline();

        class Particle {
            constructor(index) {
                this.index = index;
                this.label = (index < nodeLabels.length) ? nodeLabels[index] : null;
                if (!this.label && Math.random() < 0.1) {
                    this.label = nodeLabels[Math.floor(Math.random() * nodeLabels.length)];
                }
                this.reset();
            }

            reset() {
                this.pos = { x: width ? width / 2 : 0, y: height ? height / 2 : 0 };
                this.target = {
                    x: Math.random() * (width || 1000),
                    y: Math.random() * (height || 1000)
                };
                
                // For scroll outro
                this.offsetY = 0;

                this.vel = {
                    x: (Math.random() - 0.5) * 0.8,
                    y: (Math.random() - 0.5) * 0.8
                };
                
                this.baseRadius = this.label ? Math.random() * 2 + 3 : Math.random() * 1.5 + 1;
                this.radius = 0; 
                
                // Cyan and Coral palette
                const isCyan = Math.random() > 0.4;
                this.color = isCyan ? { r: 77, g: 214, b: 229 } : { r: 255, g: 77, b: 90 };
                
                this.alpha = 0;
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

            draw() {
                if (this.currentAlpha <= 0.01) return;
                
                const drawY = this.pos.y + this.offsetY;

                ctx.beginPath();
                ctx.arc(this.pos.x, drawY, this.currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.currentAlpha})`;
                ctx.fill();

                if (this.label && this.currentAlpha > 0.2) {
                    ctx.font = `500 ${this.currentRadius * 2 + 8}px 'Inter', sans-serif`;
                    ctx.fillStyle = `rgba(226, 232, 240, ${this.currentAlpha * 0.9})`; 
                    ctx.fillText(this.label, this.pos.x + this.currentRadius + 6, drawY + 4);
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

        window.startChronosphere = function() {
            startLoop();
            
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
                    alpha: (i) => particles[i].label ? Math.random() * 0.4 + 0.4 : Math.random() * 0.3 + 0.1,
                    radius: (i) => particles[i].baseRadius,
                    stagger: { each: 0.005, from: "center" },
                    ease: "power3.out",
                    onUpdate: function() {
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
            const lineBaseColor = theme === 'dark' ? '148, 163, 184' : '15, 23, 42';

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

                    if (dist < 130) {
                        const opacity = (1 - dist / 130) * Math.min(p1.currentAlpha, p2.currentAlpha);
                        if (opacity > 0.01) {
                            
                            let lineGlow = 0;
                            if (mouse.isActive) {
                                const dot = (((mouse.x-p1.pos.x)*(p2.pos.x-p1.pos.x)) + ((mouse.y-drawY1)*(drawY2-drawY1))) / Math.pow(dist, 2);
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
                                ctx.strokeStyle = `rgba(${predominantColor.r}, ${predominantColor.g}, ${predominantColor.b}, ${Math.max(opacity, lineGlow * 0.8)})`;
                                ctx.lineWidth = 1.6;
                            } else {
                                ctx.strokeStyle = `rgba(${lineBaseColor}, ${opacity * 0.4})`;
                                ctx.lineWidth = 0.7;
                            }
                            
                            ctx.beginPath();
                            ctx.moveTo(p1.pos.x, drawY1);
                            ctx.lineTo(p2.pos.x, drawY2);
                            ctx.stroke();
                        }
                    }
                }
            }

            particles.forEach(p => p.draw());
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
                    if(p.pos.x > width) p.pos.x = width;
                    if(p.pos.y > height) p.pos.y = height;
                });
            });
        }

        initSystem();
        initInteractionListeners();
        initScrollTriggers();

    });
})();"""

pattern = r"// ==============================================================================\n//  THE CODE-FLUID CHRONOSPHERE ENGINE.*?\}\)\(\);"
updated_content = re.sub(pattern, new_engine, content, flags=re.DOTALL)

with open('assets/js/animations.js', 'w') as f:
    f.write(updated_content)

print("Animations updated!")
