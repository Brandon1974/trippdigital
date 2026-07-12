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

// EMBEDDED VIDEO PLAYER CONTROLS
(function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const video = document.getElementById('heroVideo');
    const playOverlay = document.getElementById('playOverlay');
    const playButtonLarge = document.getElementById('playButtonLarge');
    const playBtnEmbed = document.getElementById('playBtnEmbed');
    const progressBar = document.getElementById('progressEmbedBar');
    const progressFill = document.getElementById('progressFillEmbed');
    const timeDisplay = document.getElementById('timeEmbed');
    const fullscreenBtn = document.getElementById('fullscreenEmbed');
    const videoWrapper = document.querySelector('.video-wrapper');

    if (!video) return;

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Play from overlay
    playButtonLarge.addEventListener('click', (e) => {
        e.stopPropagation();
        video.play();
    });

    // Play from controls
    playBtnEmbed.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Hide overlay and show controls when playing
    video.addEventListener('play', () => {
        playOverlay.classList.add('hidden');
    });

    video.addEventListener('pause', () => {
        playOverlay.classList.remove('hidden');
    });

    // Progress updates
    video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = percent + '%';
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    // Seek on progress bar click
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (videoWrapper.requestFullscreen) {
            videoWrapper.requestFullscreen();
        } else if (videoWrapper.webkitRequestFullscreen) {
            videoWrapper.webkitRequestFullscreen();
        }
    });

    // Hide controls on mouse leave
    videoWrapper.addEventListener('mouseleave', () => {
        if (!video.paused) {
            document.querySelector('.video-controls-embed').style.opacity = '0';
        }
    });

    videoWrapper.addEventListener('mouseenter', () => {
        document.querySelector('.video-controls-embed').style.opacity = '1';
    });
})();

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const counters = document.querySelectorAll('.counter[data-count]');
    let hasRun = false;

    const runCounters = () => {
        if (hasRun) return;

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.85) return;

        hasRun = true;

        counters.forEach((counter, index) => {
            const target = parseInt(counter.dataset.count);
            const duration = 2500;
            const start = Date.now();
            const delay = index * 100;

            setTimeout(() => {
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
            }, delay);
        });
    };

    window.addEventListener('scroll', runCounters, { passive: true });
    // Run on load if stats section is visible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runCounters);
    } else {
        runCounters();
    }
})();
