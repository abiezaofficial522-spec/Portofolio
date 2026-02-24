// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const backToTop = document.querySelector('.back-to-top');
const navLinksItems = document.querySelectorAll('.nav-links a');
const skillCards = document.querySelectorAll('.skill-card');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('.contact-form');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Skill Cards Animation on Scroll (respects reduced motion)
if (!prefersReducedMotion) {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    skillCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        skillObserver.observe(card);
    });

    // Project Cards Animation on Scroll
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        projectObserver.observe(card);
    });

    // Progress Bar Animation on Scroll
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressSection = document.querySelector('.skills');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    progressObserver.observe(progressSection);

    // Hero Section Animation on Load
    window.addEventListener('load', () => {
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');
        
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateX(-50px)';
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        
        heroText.style.transition = 'all 1s ease';
        heroImage.style.transition = 'all 1s ease 0.3s';
        
        setTimeout(() => {
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateX(0)';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 100);
    });
}

// Add hover effect to skill cards
skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax Effect on Hero Section (respects reduced motion)
if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.scrollY;
        const rate = scrolled * 0.5;
        
        if (scrolled < hero.offsetHeight) {
            hero.style.backgroundPositionY = `${rate}px`;
        }
    });
}

// Custom Cursor (respects reduced motion and mobile)
const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

if (!prefersReducedMotion && !isMobile) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorInner = document.createElement('div');
    cursorInner.classList.add('cursor-inner');
    document.body.appendChild(cursorInner);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        cursorInner.style.left = `${mouseX}px`;
        cursorInner.style.top = `${mouseY}px`;
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Add hover state for cursor
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorInner.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorInner.classList.remove('hover');
        });
    });
}

// Add CSS for custom cursor
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid #b50000;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease, opacity 0.3s ease;
    }
    
    .cursor-inner {
        position: fixed;
        width: 8px;
        height: 8px;
        background: #b50000;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
    }
    
    .custom-cursor.hover,
    .cursor-inner.hover {
        transform: translate(-50%, -50%) scale(1.5);
    }
    
    @media (max-width: 768px) {
        .custom-cursor,
        .cursor-inner {
            display: none;
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .custom-cursor,
        .cursor-inner {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyle);

// Loading Animation (respects reduced motion)
if (!prefersReducedMotion) {
    window.addEventListener('load', () => {
        const loader = document.createElement('div');
        loader.classList.add('loader');
        loader.innerHTML = '<div class="loader-content"></div>';
        document.body.appendChild(loader);
        
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1500);
    });
}

// Add CSS for loader
const loaderStyle = document.createElement('style');
loaderStyle.textContent = `
    .loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    }
    
    .loader-content {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #b50000;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .loader {
            display: none;
        }
    }
`;
document.head.appendChild(loaderStyle);

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Show success message (in real scenario, you would send this to a server)
    alert(`Terima kasih ${name}! Pesan Anda telah dikirim. Saya akan menghubungi Anda di ${email} segera.`);
    
    contactForm.reset();
});

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate any dynamic elements if needed
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }, 250);
});

// Initialize VH variable for mobile browsers
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

console.log('Portfolio website loaded successfully!');
