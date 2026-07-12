// NEWSLETTER FORMS
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    handleNewsletter(email, 'newsletter-section');
});

document.getElementById('footerNewsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    handleNewsletter(email, 'footer');
});

async function handleNewsletter(email, source) {
    try {
        const res = await fetch('/.netlify/functions/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, source }),
        });
        const data = await res.json();
        showNotification(data.message || data.error || 'Something went wrong.');
        if (data.success) {
            document.querySelectorAll('input[type="email"]').forEach(input => input.value = '');
        }
    } catch (_) {
        showNotification('Something went wrong. Please try again.');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #FF6B00;
        color: #000;
        padding: 15px 25px;
        border-radius: 4px;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ANIMATIONS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// SMOOTH SCROLL FOR ANCHOR LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#search' && href !== '#account' && href !== '#all-products' && href !== '#checkout') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// SCROLL-TRIGGERED ANIMATIONS
(function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animateOnScroll = () => {
        const elements = document.querySelectorAll(
            '.payhip-card, .service-card, .book-card, .testimonial-card, .feature-item'
        );

        elements.forEach(el => {
            if (!el.classList.contains('visible')) {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

                if (isVisible) {
                    el.classList.add('visible');

                    // Stagger animation delay based on position
                    const delay = Array.from(elements).indexOf(el) % 4;
                    el.style.animationDelay = (delay * 0.1) + 's';
                }
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll, { passive: true });
    animateOnScroll(); // Run on load
})();

// ANIMATED COUNTERS
(function() {
    const counters = document.querySelectorAll('[data-count]');
    let hasRun = false;

    const runCounters = () => {
        if (hasRun) return;

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top > window.innerHeight) return;

        hasRun = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2500;
            const start = Date.now();

            const animate = () => {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeOutQuad = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(target * easeOutQuad);

                counter.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            animate();
        });
    };

    window.addEventListener('scroll', runCounters, { passive: true });
    runCounters(); // Run on load
})();
