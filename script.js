// =============================================
// MONO—01 - Subtle Interactions
// Motion with Purpose / Restraint in Code
// =============================================

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for fade-in
window.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(`
        .feature-block,
        .spec-item,
        .detail-container,
        .closing-text
    `);

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Manifesto lines animation
const manifestoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const lines = entry.target.querySelectorAll('.manifesto-line');
            lines.forEach(line => line.classList.add('visible'));
        }
    });
}, { threshold: 0.3 });

const manifestoSection = document.querySelector('.manifesto');
if (manifestoSection) {
    manifestoObserver.observe(manifestoSection);
}

// Product object parallax on scroll
const productObject = document.querySelector('.object-shell');
if (productObject) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const objectPosition = productObject.getBoundingClientRect().top + window.pageYOffset;
        const windowHeight = window.innerHeight;

        if (scrolled > objectPosition - windowHeight && scrolled < objectPosition + 500) {
            const offset = (scrolled - (objectPosition - windowHeight)) * 0.1;
            productObject.style.transform = `translateY(${offset}px)`;
        }
    });
}

// 3D tilt effect on product object
if (productObject) {
    const container = productObject.closest('.product-image');

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        productObject.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        productObject.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// Navbar background on scroll
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 1px 0 rgba(0, 0, 0, 0.05)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.8)';
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Smooth button interactions
const buttons = document.querySelectorAll('.btn-primary');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
    });
});

// Stagger feature blocks
const staggerElements = (selector, delay = 100) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * delay}ms`;
    });
};

staggerElements('.feature-block', 150);
staggerElements('.spec-item', 80);

// Console message
console.log('%c MONO—01', 'font-size: 32px; font-weight: 200; letter-spacing: 0.1em;');
console.log('%c "What remains when everything unnecessary is removed."', 'font-size: 14px; color: #666;');
console.log('%c © 2024 MONO', 'font-size: 11px; color: #999; margin-top: 10px;');

// Page load optimization
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.querySelectorAll('.fade-in, .manifesto-line').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

// Subtle cursor effect (desktop only)
if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: black;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: difference;
        transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1);
        display: none;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.display = 'block';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Enlarge cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .object-shell');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(3)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Keyboard shortcuts (Easter egg)
let keys = [];
document.addEventListener('keydown', (e) => {
    keys.push(e.key);
    keys = keys.slice(-4);

    // Type "mono" for easter egg
    if (keys.join('') === 'mono') {
        console.log('%c 🎯 EASTER EGG FOUND', 'font-size: 16px; font-weight: 600;');
        console.log('%c You appreciate the details. We like that.', 'font-size: 12px; color: #666;');
        keys = [];
    }
});
