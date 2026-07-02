// ========================================
// TEAM ZERO - ADVANCED ANIMATIONS
// ========================================

(function() {
    'use strict';

    // ========================================
    // TYPEWRITER EFFECT
    // ========================================
    class Typewriter {
        constructor(element, texts, speed = 100, delay = 2000) {
            this.element = element;
            this.texts = texts;
            this.speed = speed;
            this.delay = delay;
            this.currentIndex = 0;
            this.charIndex = 0;
            this.isDeleting = false;
            this.init();
        }

        init() {
            this.type();
        }

        type() {
            const current = this.texts[this.currentIndex];
            
            if (!this.isDeleting) {
                // Typing
                this.element.textContent = current.substring(0, this.charIndex + 1);
                this.charIndex++;
                
                if (this.charIndex === current.length) {
                    this.isDeleting = true;
                    setTimeout(() => this.type(), this.delay);
                    return;
                }
                
                setTimeout(() => this.type(), this.speed);
            } else {
                // Deleting
                this.element.textContent = current.substring(0, this.charIndex - 1);
                this.charIndex--;
                
                if (this.charIndex === 0) {
                    this.isDeleting = false;
                    this.currentIndex = (this.currentIndex + 1) % this.texts.length;
                    setTimeout(() => this.type(), this.speed);
                    return;
                }
                
                setTimeout(() => this.type(), this.speed / 2);
            }
        }
    }

    // ========================================
    // PARTICLES BACKGROUND
    // ========================================
    class ParticlesBackground {
        constructor(container, count = 50) {
            this.container = container;
            this.count = count;
            this.particles = [];
            this.init();
        }

        init() {
            for (let i = 0; i < this.count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 2}px;
                    height: ${Math.random() * 4 + 2}px;
                    background: ${this.randomColor()};
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    opacity: ${Math.random() * 0.5 + 0.1};
                    pointer-events: none;
                    animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
                `;
                
                this.container.appendChild(particle);
                this.particles.push({
                    element: particle,
                    x: parseFloat(particle.style.left),
                    y: parseFloat(particle.style.top),
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5
                });
            }

            this.animate();
        }

        randomColor() {
            const colors = ['#6C3CE1', '#4A9EFF', '#8B6FE8', '#7C5CFC', '#FFFFFF'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        animate() {
            this.particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                
                if (p.x > 100 || p.x < 0) p.speedX *= -1;
                if (p.y > 100 || p.y < 0) p.speedY *= -1;
                
                p.element.style.left = p.x + '%';
                p.element.style.top = p.y + '%';
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // ========================================
    // COUNTDOWN TIMER
    // ========================================
    class CountdownTimer {
        constructor(element, targetDate) {
            this.element = element;
            this.targetDate = new Date(targetDate).getTime();
            this.init();
        }

        init() {
            this.update();
            setInterval(() => this.update(), 1000);
        }

        update() {
            const now = new Date().getTime();
            const distance = this.targetDate - now;
            
            if (distance < 0) {
                this.element.innerHTML = '🎉 تم!';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            this.element.innerHTML = `
                <span>${this.pad(days)}<small>يوم</small></span>
                <span>${this.pad(hours)}<small>ساعة</small></span>
                <span>${this.pad(minutes)}<small>دقيقة</small></span>
                <span>${this.pad(seconds)}<small>ثانية</small></span>
            `;
        }

        pad(num) {
            return num.toString().padStart(2, '0');
        }
    }

    // ========================================
    // PROGRESS BAR
    // ========================================
    class ProgressBar {
        constructor(element, target, duration = 2000) {
            this.element = element;
            this.target = target;
            this.duration = duration;
            this.current = 0;
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate();
                        observer.unobserve(this.element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(this.element);
        }

        animate() {
            const startTime = performance.now();
            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.duration, 1);
                const value = this.target * this.easeOutCubic(progress);
                
                this.element.style.width = value + '%';
                this.element.textContent = Math.round(value) + '%';
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            
            requestAnimationFrame(update);
        }

        easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
    }

    // ========================================
    // SCROLL REVEAL
    // ========================================
    class ScrollReveal {
        constructor(selector = '.reveal', options = {}) {
            this.elements = document.querySelectorAll(selector);
            this.options = {
                delay: 100,
                distance: '50px',
                duration: 800,
                easing: 'ease-out',
                ...options
            };
            
            this.init();
        }

        init() {
            this.elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = `translateY(${this.options.distance})`;
                el.style.transition = `all ${this.options.duration}ms ${this.options.easing} ${index * this.options.delay}ms`;
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ========================================
    // ANIMATE ON SCROLL (Custom)
    // ========================================
    class AnimateOnScroll {
        constructor(selector = '[data-animate]') {
            this.elements = document.querySelectorAll(selector);
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const animation = el.dataset.animate || 'fadeUp';
                        const delay = parseInt(el.dataset.delay) || 0;
                        
                        setTimeout(() => {
                            el.classList.add('animated', animation);
                        }, delay);
                        
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.1 });

            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ========================================
    // INITIALIZE
    // ========================================
    document.addEventListener('DOMContentLoaded', () => {
        // Typewriter
        const typewriterEl = document.querySelector('.typewriter');
        if (typewriterEl) {
            const texts = typewriterEl.dataset.texts ? 
                JSON.parse(typewriterEl.dataset.texts) : 
                ['تصميم احترافي', 'تطوير متقدم', 'إبداع لا محدود'];
            new Typewriter(typewriterEl, texts);
        }

        // Particles
        const particlesContainer = document.querySelector('.particles-container');
        if (particlesContainer) {
            new ParticlesBackground(particlesContainer);
        }

        // Countdown
        const countdownEl = document.querySelector('.countdown');
        if (countdownEl && countdownEl.dataset.target) {
            new CountdownTimer(countdownEl, countdownEl.dataset.target);
        }

        // Progress Bars
        document.querySelectorAll('.progress-bar').forEach(el => {
            if (el.dataset.target) {
                new ProgressBar(el, parseInt(el.dataset.target));
            }
        });

        // Scroll Reveal
        new ScrollReveal('.reveal');
        new AnimateOnScroll('[data-animate]');

        console.log('✨ Advanced Animations Initialized');
    });

})();