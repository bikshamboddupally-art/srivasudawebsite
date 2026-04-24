gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Accessibility check: Reduced Motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // 1. Lenis Smooth Scroll Setup - Extreme luxury pacing
        const lenis = new Lenis({
            duration: 2.5, // Even slower for highly cinematic feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Integrate Lenis with ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time)=>{
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0, 0);

        // 2. Custom Cursor
        const cursor = document.querySelector('.custom-cursor');
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: "power2.out"
            });
        });

        const hoverElements = document.querySelectorAll('[data-cursor="hover"], .project-item, .glass-card, .port-img');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // 3. Preloader & Hero Entry
        const tl = gsap.timeline();
        
        // Split preloader text
        const splitPreloader = new SplitType('.preloader-text', { types: 'chars' });
        
        tl.from(splitPreloader.chars, {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 1.5,
            ease: "power3.out"
        })
        .to(".preloader", {
            opacity: 0, 
            duration: 1.5,
            ease: "power2.inOut",
            delay: 0.5,
            onComplete: () => { document.querySelector('.preloader').style.display = 'none'; }
        })
        .to(".hero-bg-wrapper", {
            clipPath: "inset(0% 0 0 0)",
            duration: 2.0,
            ease: "power3.inOut"
        }, "-=1")
        .from(".hero-title .char", {
            y: 40,
            opacity: 0,
            duration: 2.0,
            stagger: 0.05,
            ease: "power3.out"
        }, "-=1.5")
        .from(".hero-subtitle", {
            opacity: 0,
            y: 20,
            duration: 1.5
        }, "-=1.0")
        .from(".navbar", {
            y: -20,
            opacity: 0,
            duration: 1.5
        }, "-=1.2");

        // SplitText for all section titles
        document.querySelectorAll('.section-title').forEach(title => {
            if(!title.classList.contains('hero-title') && !title.classList.contains('footer-brand')) {
                const splitTitle = new SplitType(title, { types: 'lines, words' });
                gsap.from(splitTitle.words, {
                    scrollTrigger: {
                        trigger: title,
                        start: "top 85%",
                    },
                    y: 30,
                    opacity: 0,
                    duration: 1.5,
                    stagger: 0.08,
                    ease: "power3.out"
                });
            }
        });

        // 4. Fade Up Elements (Staggered for narrative flow)
        const fadeUpElements = gsap.utils.toArray('.fade-up');
        fadeUpElements.forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                },
                y: 40, 
                opacity: 0,
                duration: 1.5,
                ease: "power3.out"
            });
        });

        // 5. Image Reveals - Extreme cinematic
        const revealImages = document.querySelectorAll('.reveal-img-container');
        revealImages.forEach(container => {
            if(!container.classList.contains('hero-bg-wrapper') && !container.classList.contains('services-bg')) {
                const img = container.querySelector('img');
                const tlImg = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                    }
                });
                
                tlImg.to(container, {
                    clipPath: "inset(0% 0 0 0)",
                    duration: 2.0,
                    ease: "power3.inOut"
                })
                .to(img, {
                    scale: 1, 
                    duration: 2.0,
                    ease: "power3.inOut"
                }, "-=2.0");
            }
        });

        // Services Background Reveal
        const servicesBg = document.querySelector('.services-bg');
        if(servicesBg) {
            gsap.to(servicesBg, {
                clipPath: "inset(0% 0 0 0)",
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: ".services-section",
                    start: "top 80%",
                    end: "bottom top",
                    scrub: 1
                }
            });
            // Parallax the img inside
            gsap.to(".services-bg img", {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: ".services-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Full width parallax image (newly added section)
        const fullImg = document.querySelector('.full-img img');
        if(fullImg) {
            gsap.to(fullImg, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: ".full-image-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Image Parallax in About Section
        gsap.to(".img-1 img", {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-images",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(".img-2 img", {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-images",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // 6. Horizontal Scroll Section
        const horizontalSection = document.querySelector('.horizontal-container');
        if (horizontalSection) {
            let scrollTween = gsap.to(horizontalSection, {
                x: () => -(horizontalSection.scrollWidth - window.innerWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: ".horizontal-section",
                    pin: true,
                    scrub: 1.5,
                    end: () => "+=" + horizontalSection.scrollWidth,
                    invalidateOnRefresh: true
                }
            });

            // Internal Parallax for Horizontal Scroll images
            const horizontalItems = gsap.utils.toArray('.horizontal-item img');
            horizontalItems.forEach(img => {
                gsap.to(img, {
                    xPercent: -15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.parentElement.parentElement,
                        containerAnimation: scrollTween,
                        start: "left right",
                        end: "right left",
                        scrub: true
                    }
                });
            });
        }

        // 7. Magnetic Button
        const magnetButtons = document.querySelectorAll('.btn-primary');
        magnetButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.9,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });

        // Footer Parallax
        const splitFooter = new SplitType('.footer-brand', { types: 'chars' });
        gsap.from(splitFooter.chars, {
            scrollTrigger: {
                trigger: ".footer",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 2.0,
            stagger: 0.05,
            ease: "power3.out"
        });

    } else {
        // Fallback for reduced motion
        document.querySelector('.preloader').style.display = 'none';
        document.querySelector('.hero-bg-wrapper').style.clipPath = 'inset(0% 0 0 0)';
        document.querySelectorAll('.reveal-img-container').forEach(c => c.style.clipPath = 'inset(0% 0 0 0)');
        document.querySelectorAll('.horizontal-section').forEach(s => s.style.height = 'auto');
        document.querySelectorAll('.horizontal-container').forEach(s => {
            s.style.display = 'grid';
            s.style.gridTemplateColumns = '1fr 1fr';
            s.style.height = 'auto';
            s.style.flexWrap = 'wrap';
        });
        document.body.style.cursor = 'auto';
        document.querySelector('.custom-cursor').style.display = 'none';
    }

    // Number Counter Animation
    const stats = document.querySelectorAll(".stat-number");
    stats.forEach(stat => {
        const target = parseFloat(stat.getAttribute("data-target"));
        ScrollTrigger.create({
            trigger: stat,
            start: "top 85%",
            onEnter: () => {
                gsap.to(stat, {
                    innerHTML: target,
                    duration: 3, 
                    snap: { innerHTML: target % 1 === 0 ? 1 : 0.1 },
                    ease: "power2.out",
                    onUpdate: function() {
                        stat.innerHTML = Number(this.targets()[0].innerHTML).toFixed(target % 1 === 0 ? 0 : 1);
                    }
                });
            },
            once: true
        });
    });

    // Form Submission
    document.getElementById('booking-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for reaching out to Srivasuda Group! We will contact you shortly.');
        e.target.reset();
    });
});
