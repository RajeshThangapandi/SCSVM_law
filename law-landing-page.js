// ===================================
// KANCHI UNIVERSITY LAW DEPARTMENT
// Interactive Features & Form Handling
// ===================================

// Smooth scroll to form
function scrollToForm() {
    const form = document.getElementById('application-form');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Smooth scroll to programs
function scrollToPrograms() {
    const programs = document.getElementById('programs');
    if (programs) {
        programs.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Animated counter for stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Intersection Observer for stats animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(num => {
                if (num.textContent === '0') {
                    animateCounter(num);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe stats section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Add scroll animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card, .program-card, .testimonial-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });

    // Header scroll effect
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
});

// Form validation and submission
const enquiryForm = document.getElementById('enquiryForm');

if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            program: document.getElementById('program').value,
            qualification: document.getElementById('qualification').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        const submitButton = enquiryForm.querySelector('.form-submit');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
            Submitting...
        `;
        submitButton.disabled = true;

        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Simulate form submission (replace with actual API call)
        try {
            await simulateFormSubmission(formData);

            // Show success modal
            showSuccessModal();

            // Reset form
            enquiryForm.reset();

        } catch (error) {
            alert('There was an error submitting your application. Please try again or contact us directly.');
            console.error('Form submission error:', error);
        } finally {
            // Restore button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Form validation
function validateForm(data) {
    // Name validation
    if (data.fullName.trim().length < 3) {
        alert('Please enter your full name (at least 3 characters)');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Phone validation (Indian format)
    const phoneRegex = /^[\+]?[0-9]{10,13}$/;
    const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        alert('Please enter a valid phone number');
        return false;
    }

    // Program selection
    if (!data.program) {
        alert('Please select a program of interest');
        return false;
    }

    return true;
}

// Simulate form submission (replace with actual API endpoint)
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        // Log to console (in production, send to server)
        console.log('Form submission:', data);

        // Store in localStorage as backup
        const submissions = JSON.parse(localStorage.getItem('lawApplications') || '[]');
        submissions.push(data);
        localStorage.setItem('lawApplications', JSON.stringify(submissions));

        // Simulate network delay
        setTimeout(() => {
            resolve({ success: true });
        }, 1500);
    });
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');

        // Auto-close after 5 seconds
        setTimeout(() => {
            closeModal();
        }, 5000);
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        // Auto-add +91 for Indian numbers
        if (value.length > 0 && !e.target.value.startsWith('+')) {
            if (value.length === 10) {
                e.target.value = '+91 ' + value;
            }
        }
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add entrance animations to sections
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.8s ease';
    sectionObserver.observe(section);
});

// Lazy loading for images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add ripple effect to buttons
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            left: ${x}px;
            top: ${y}px;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Track user interactions for analytics (optional)
function trackEvent(category, action, label) {
    console.log('Event tracked:', { category, action, label });

    // In production, send to analytics service
    // Example: gtag('event', action, { event_category: category, event_label: label });
}

// Track CTA clicks
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        trackEvent('CTA', 'click', buttonText);
    });
});

// Track program card interactions
document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const programTitle = card.querySelector('.program-title').textContent;
        trackEvent('Program', 'hover', programTitle);
    });
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Close modal on Escape key
    if (e.key === 'Escape') {
        closeModal();
    }

    // Navigate to form on Enter when focused on CTA
    if (e.key === 'Enter' && e.target.classList.contains('cta-button')) {
        e.target.click();
    }
});

// Add focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add keyboard navigation styles
const keyboardNavStyle = document.createElement('style');
keyboardNavStyle.textContent = `
    body.keyboard-nav *:focus {
        outline: 3px solid #ffc107;
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardNavStyle);

console.log('🎓 ANVIKSHIKI Law Department Landing Page Loaded');
console.log('📧 For inquiries: admissions@kanchiuniv.ac.in');
console.log('📞 Phone: +91 44 2747 2005');

// ===================================
// ADVERTISEMENT POPUP MODAL
// ===================================

// Show advertisement popup after page load
document.addEventListener('DOMContentLoaded', () => {
    // Show popup after 2 seconds
    setTimeout(() => {
        showAdModal();
    }, 2000);
});

// Show advertisement modal
function showAdModal() {
    const adModal = document.getElementById('adModal');
    if (adModal) {
        adModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        console.log('Advertisement popup shown');
    } else {
        console.error('Ad modal element not found');
    }
}

// Close advertisement modal
function closeAdModal() {
    const adModal = document.getElementById('adModal');
    if (adModal) {
        adModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close ad modal and scroll to form
function closeAdModalAndScroll() {
    closeAdModal();
    setTimeout(() => {
        scrollToForm();
    }, 300);
}

// Close ad modal on outside click
document.addEventListener('click', (e) => {
    const adModal = document.getElementById('adModal');
    if (e.target === adModal) {
        closeAdModal();
    }
});

// Update the existing Escape key handler to include ad modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAdModal();
        closeModal();
    }
});
