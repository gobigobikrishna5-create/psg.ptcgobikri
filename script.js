/* ============================================
   NAVIGATION FUNCTIONS
   ============================================ */

// Navigate to a specific page with fade-out effect
function navigateTo(page) {
    const container = document.querySelector('.container');
    
    // Add fade-out animation
    container.style.animation = 'fadeOut 0.5s ease forwards';
    
    // Navigate after animation completes
    setTimeout(() => {
        window.location.href = page;
    }, 500);
}

// Go back to previous page or home
function goBack() {
    // Check if there's a previous page in history
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        // If no previous page, go to home
        navigateTo('index.html');
    }
}

/* ============================================
   PASSWORD MODAL FUNCTIONS
   ============================================ */

let currentLoginData = {
    type: '',
    password: '',
    redirectPage: ''
};

function showPasswordModal(loginType, correctPassword, redirectPage) {
    currentLoginData = {
        type: loginType,
        password: correctPassword,
        redirectPage: redirectPage
    };
    
    const modal = document.getElementById('passwordModal');
    const modalTitle = document.getElementById('modalTitle');
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    
    // Set title based on login type
    const title = loginType === 'admin' ? '🔐 Admin Password' : '🔐 Student Password';
    modalTitle.textContent = title;
    
    // Clear previous input and error
    passwordInput.value = '';
    passwordError.classList.add('hidden');
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Focus on input
    setTimeout(() => passwordInput.focus(), 100);
}

function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    
    modal.classList.add('hidden');
    passwordInput.value = '';
    passwordError.classList.add('hidden');
}

function submitPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === currentLoginData.password) {
        // Password correct - close modal and navigate
        closePasswordModal();
        navigateTo(currentLoginData.redirectPage);
    } else {
        // Password incorrect - show error
        passwordError.classList.remove('hidden');
        passwordInput.value = '';
        passwordInput.focus();
        
        // Shake animation on input
        passwordInput.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 300);
    }
}

function handlePasswordKeypress(event) {
    if (event.key === 'Enter') {
        submitPassword();
    } else if (event.key === 'Escape') {
        closePasswordModal();
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('passwordModal');
    if (modal && !modal.classList.contains('hidden')) {
        if (e.target === modal) {
            closePasswordModal();
        }
    }
});

/* ============================================
   PAGE ANIMATIONS ON LOAD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Trigger fade-in animations
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach((element, index) => {
        element.style.animation = 'fadeIn 0.8s ease forwards';
        element.style.animationDelay = `${index * 0.1}s`;
    });

    // Add stagger animation to cards
    const cards = document.querySelectorAll('.login-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${0.8 + index * 0.15}s`;
    });

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add keyboard navigation
    addKeyboardNavigation();

    // Add interactive button feedback
    addButtonFeedback();

    // Observer for scroll animations
    observeScrollAnimations();
});

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */

function addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Home key - go to index page
        if (e.key === 'Home') {
            navigateTo('index.html');
        }
        // Page Down or Right arrow - navigate forward
        if ((e.key === 'PageDown' || e.key === 'ArrowRight') && window.location.pathname.includes('page')) {
            const currentPage = parseInt(window.location.pathname.match(/page(\d)/)?.[1]) || 1;
            const nextPage = `page${currentPage + 1}.html`;
            navigateTo(nextPage);
        }
        // Page Up or Left arrow - navigate backward
        if ((e.key === 'PageUp' || e.key === 'ArrowLeft') && window.location.pathname.includes('page')) {
            navigateTo('index.html');
        }
    });
}

/* ============================================
   BUTTON FEEDBACK & INTERACTIONS
   ============================================ */

function addButtonFeedback() {
    const buttons = document.querySelectorAll('.nav-btn, .link-button, .card-btn, .feature-item, .info-card, .back-btn');

    buttons.forEach((button) => {
        // Add ripple effect on click
        button.addEventListener('click', (e) => {
            // Don't add ripple for navigation buttons with href
            if (button.tagName === 'A') return;

            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Add focus styles for accessibility
        button.addEventListener('focus', () => {
            button.style.outline = `2px solid var(--primary-color)`;
            button.style.outlineOffset = '2px';
        });

        button.addEventListener('blur', () => {
            button.style.outline = 'none';
        });
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function observeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.link-section, .feature-grid, .info-section, .security-notice').forEach((el) => {
        observer.observe(el);
    });
}

/* ============================================
   MOUSE TRACKING EFFECT (Optional Enhancement)
   ============================================ */

document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.login-card');
    
    cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const angle = Math.atan2(mouseY - cardCenterY, mouseX - cardCenterX);
        const distance = Math.hypot(mouseX - cardCenterX, mouseY - cardCenterY);

        // Only apply effect when mouse is reasonably close
        if (distance < 300) {
            const tiltX = (Math.sin(angle) * 5);
            const tiltY = (-Math.cos(angle) * 5);
            
            card.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
    });
});

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll/mouse events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/* ============================================
   DYNAMIC FADEOUT ANIMATION
   ============================================ */

// Add dynamic fadeOut keyframe animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ============================================
   ACCESSIBILITY FEATURES
   ============================================ */

// Detect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    const animations = document.querySelectorAll('[style*="animation"]');
    animations.forEach((el) => {
        el.style.animation = 'none';
    });
}

// Listen for changes in motion preference
prefersReducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
        document.documentElement.style.scrollBehavior = 'auto';
    } else {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
});

/* ============================================
   PAGE LOAD PERFORMANCE
   ============================================ */

// Optimize images with lazy loading (if applicable)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach((img) => {
        imageObserver.observe(img);
    });
}

/* ============================================
   CONSOLE MESSAGE
   ============================================ */

console.log('%cWelcome to PSG Polytechnic Portal!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cVersion 1.0', 'color: #ec4899; font-size: 12px;');
