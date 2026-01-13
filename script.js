// Demo execution function
function runDemo() {
    const output = document.getElementById('output');
    const button = document.querySelector('.run-button');

    // Disable button during execution
    button.disabled = true;
    button.textContent = '⏳ Running...';

    // Simulate code execution with typing effect
    const lines = [
        '$ node demo.js',
        '',
        '✓ Code Analysis',
        '✓ File Operations',
        '✓ Git Management',
        '✓ Build Automation',
        '✓ Web Research',
        '✓ Task Planning',
        '',
        '> Ready to assist!',
        '',
        '✅ Demo completed successfully!'
    ];

    output.textContent = '';
    let lineIndex = 0;

    const typeNextLine = () => {
        if (lineIndex < lines.length) {
            output.textContent += lines[lineIndex] + '\n';
            lineIndex++;
            setTimeout(typeNextLine, 300);
        } else {
            button.disabled = false;
            button.textContent = '▶ Run Demo';
        }
    };

    setTimeout(typeNextLine, 500);
}

// Animated counter for stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.parentElement.querySelector('.stat-label').textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.parentElement.querySelector('.stat-label').textContent.includes('%') ? '%' : '+');
        }
    }, 16);
}

// Intersection Observer for stats animation
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (!stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat);
                }
            });
        }
    });
}, observerOptions);

// Observe stats section
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Add hover effects to capability cards
    const cards = document.querySelectorAll('.capability-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color');
        });

        card.addEventListener('mouseleave', function() {
            this.style.borderColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--border-color');
        });
    });

    // Add sparkle effect on card click
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.position = 'absolute';
            sparkle.style.left = e.clientX + 'px';
            sparkle.style.top = e.clientY + 'px';
            sparkle.style.width = '5px';
            sparkle.style.height = '5px';
            sparkle.style.background = 'white';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = 'sparkle 0.6s ease-out forwards';

            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 600);
        });
    });

    // Add typing indicator to console
    const codeContent = document.querySelector('.code-content code');
    if (codeContent) {
        const text = codeContent.textContent;
        codeContent.textContent = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                codeContent.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 10);
            }
        };

        setTimeout(typeWriter, 500);
    }
});

// Add sparkle animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c✨ Claude Code Demo Site', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cThis entire site was built by Claude Code to demonstrate capabilities!', 'font-size: 14px; color: #8b5cf6;');
console.log('%cCapabilities demonstrated:', 'font-size: 14px; font-weight: bold; margin-top: 10px;');
console.log('  • File creation and organization');
console.log('  • HTML/CSS/JavaScript development');
console.log('  • Responsive design');
console.log('  • Interactive animations');
console.log('  • Git operations');
console.log('%cTry interacting with the page! 🚀', 'font-size: 14px; color: #ec4899; margin-top: 10px;');
