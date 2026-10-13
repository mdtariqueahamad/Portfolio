/* ============================================
   PORTFOLIO — script.js
   MD Tarique Ahamad
   Pure vanilla JS — particles, cursor, scroll
   animations, typing, tilt, magnetic buttons,
   counters, loading screen, mobile menu, navbar.
   ============================================ */

(function () {
    'use strict';

    /* ----------------------------------------
       0. LOADING SCREEN
       ---------------------------------------- */
    const loadingScreen = document.getElementById('loadingScreen');
    const loaderBarFill = document.getElementById('loaderBarFill');
    let loadProgress = 0;

    function advanceLoader() {
        loadProgress += Math.random() * 25 + 10;
        if (loadProgress > 100) loadProgress = 100;
        loaderBarFill.style.width = loadProgress + '%';
        if (loadProgress < 100) {
            setTimeout(advanceLoader, 200 + Math.random() * 300);
        } else {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                document.body.style.overflow = 'auto';
                initParticles();
                triggerHeroAnimations();
            }, 400);
        }
    }

    document.body.style.overflow = 'hidden';
    setTimeout(advanceLoader, 300);

    /* ----------------------------------------
       1. CUSTOM CURSOR
       ---------------------------------------- */
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursorRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateCursorRing);
        }
        animateCursorRing();

        const hoverTargets = 'a, button, .btn, .magnetic-btn, .hamburger, .project-link, .social-link, .nav-link, input, textarea';
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest(hoverTargets)) {
                cursorDot.classList.add('cursor-hover');
                cursorRing.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest(hoverTargets)) {
                cursorDot.classList.remove('cursor-hover');
                cursorRing.classList.remove('cursor-hover');
            }
        });
    }

    /* ----------------------------------------
       2. PARTICLE SYSTEM (Canvas)
       ---------------------------------------- */
    let particlesArray = [];
    let canvas, ctx;

    function initParticles() {
        canvas = document.getElementById('particlesCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resizeCanvas();
        createParticles();
        animateParticles();
        window.addEventListener('resize', function () {
            resizeCanvas();
            createParticles();
        });
    }

    function resizeCanvas() {
        const hero = canvas.parentElement;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function createParticles() {
        particlesArray = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particlesArray.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            const p = particlesArray[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(230, 235, 245, ' + (p.opacity * 0.75) + ')';
            ctx.fill();

            for (let j = i + 1; j < particlesArray.length; j++) {
                const p2 = particlesArray[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const lineOpacity = (1 - dist / 140) * 0.25;
                    ctx.strokeStyle = 'rgba(215, 225, 240, ' + lineOpacity + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    /* ----------------------------------------
       3. TYPING EFFECT
       ---------------------------------------- */
    const typingElement = document.getElementById('typingText');
    const phrases = [
        'Software Engineer',
        'Data Structures & Algorithms',
        'Full-Stack Developer',
        'Problem Solver'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    function triggerHeroAnimations() {
        const greeting = document.querySelector('.hero-greeting');
        if (greeting) {
            setTimeout(() => greeting.classList.add('revealed'), 200);
        }
        setTimeout(typeEffect, 800);
        startGlitchEffect();
    }

    /* ----------------------------------------
       4. GLITCH EFFECT
       ---------------------------------------- */
    function startGlitchEffect() {
        const glitchName = document.querySelector('.hero-name.glitch');
        if (!glitchName || glitchName.dataset.glitchInit) return;
        glitchName.dataset.glitchInit = 'true';

        const glitchTexts = glitchName.querySelectorAll('.glitch-text');
        glitchTexts.forEach(function (el) {
            el.setAttribute('data-text', el.textContent.trim());
        });

        function doGlitch() {
            glitchName.classList.add('glitch-active');
            setTimeout(function () {
                glitchName.classList.remove('glitch-active');
            }, 350);
            setTimeout(doGlitch, 2500 + Math.random() * 3000);
        }
        setTimeout(doGlitch, 1000);

        glitchName.addEventListener('mouseenter', function () {
            glitchName.classList.add('glitch-active');
        });
        glitchName.addEventListener('mouseleave', function () {
            glitchName.classList.remove('glitch-active');
        });
    }
    startGlitchEffect();

    /* ----------------------------------------
       5. NAVBAR SCROLL EFFECT
       ---------------------------------------- */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinksAll = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / docHeight) * 100;
        document.getElementById('scrollProgress').style.width = progress + '%';

        // Active nav link
        let currentSection = '';
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinksAll.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });

    /* ----------------------------------------
       6. HAMBURGER MENU
       ---------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* ----------------------------------------
       7. SCROLL REVEAL (IntersectionObserver)
       Reversible on scroll up and down
       ---------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(function () {
                    entry.target.classList.add('revealed');
                }, delay);
            } else {
                // Re-trigger animation when scrolling out and back in
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el, i) {
        // Stagger siblings slightly
        const parent = el.parentElement;
        const siblings = parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        const idx = Array.from(siblings).indexOf(el);
        if (idx > 0) {
            el.dataset.delay = idx * 100;
        }
        revealObserver.observe(el);
    });

    /* ----------------------------------------
       8. SKILL BAR ANIMATION (Fallback)
       ---------------------------------------- */
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.width;
                bar.style.setProperty('--target-width', width + '%');
                bar.classList.add('animated');
            } else {
                entry.target.classList.remove('animated');
            }
        });
    }, {
        threshold: 0.3
    });

    skillBars.forEach(function (bar) {
        skillObserver.observe(bar);
    });

    /* ----------------------------------------
       9. COUNTER ANIMATION (Reversible)
       ---------------------------------------- */
    const counters = document.querySelectorAll('.stat-number, .dsa-stat-number');

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            } else {
                // Reset counter when out of view so it counts up again on re-entry
                entry.target.textContent = '0';
                entry.target.dataset.isCounting = 'false';
            }
        });
    }, {
        threshold: 0.25
    });

    counters.forEach(function (counter) {
        counterObserver.observe(counter);
    });

    function animateCounter(el) {
        if (el.dataset.isCounting === 'true') return;
        el.dataset.isCounting = 'true';

        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const currentVal = eased * target;

            if (decimals > 0) {
                el.textContent = currentVal.toFixed(decimals) + suffix;
            } else {
                el.textContent = Math.floor(currentVal) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
                el.dataset.isCounting = 'false';
            }
        }
        requestAnimationFrame(updateCounter);
    }

    /* ----------------------------------------
       10. 3D TILT EFFECT ON CARDS
       ---------------------------------------- */
    if (window.innerWidth > 768) {
        const tiltCards = document.querySelectorAll('.tilt-card');

        tiltCards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    /* ----------------------------------------
       11. MAGNETIC BUTTON EFFECT
       ---------------------------------------- */
    if (window.innerWidth > 768) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
            });

            btn.addEventListener('mouseleave', function () {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    /* ----------------------------------------
       12. SMOOTH SCROLL FOR NAV LINKS
       ---------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offset = 80;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ----------------------------------------
       13. CONTACT FORM HANDLING
       ---------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.form-submit span');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.color = '#34c759';
            contactForm.reset();
            setTimeout(function () {
                submitBtn.textContent = originalText;
                submitBtn.style.color = '';
            }, 3000);
        });
    }

    /* ----------------------------------------
       14. BACK TO TOP
       ---------------------------------------- */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ----------------------------------------
       15. HERO IMAGE CARD (Still & Flip Toggle)
       ---------------------------------------- */
    const heroCard = document.querySelector('.hero-image-container');
    if (heroCard) {
        heroCard.addEventListener('click', function () {
            this.classList.toggle('flipped');
        });
    }

})();
