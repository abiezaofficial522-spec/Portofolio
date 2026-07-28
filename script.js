// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

/* ============================================================
   3D Tilt Effect
   Rotates an element in 3D based on where the cursor is inside
   it, giving a "physical card" feel. Skipped on touch devices
   and when the user prefers reduced motion.
   ============================================================ */
function initTilt(elements, options = {}) {
    if (prefersReducedMotion || !hasFinePointer || isMobile) return;

    const {
        max = 12,        // max rotation in degrees
        scale = 1.03,     // scale on hover
        liftY = -8,       // px to lift on hover
        perspectiveVal = 900
    } = options;

    elements.forEach(el => {
        let rect = null;

        el.addEventListener('mouseenter', () => {
            rect = el.getBoundingClientRect();
        });

        el.addEventListener('mousemove', (e) => {
            if (!rect) rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * max * 2;
            const rotateX = ((y / rect.height) - 0.5) * -max * 2;

            el.style.transform =
                `perspective(${perspectiveVal}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${liftY}px) scale3d(${scale}, ${scale}, ${scale})`;
        });

        el.addEventListener('mouseleave', () => {
            rect = null;
            el.style.transform = '';
        });
    });
}

// Apply tilt to the hero photo (gentle, no lift/scale so the layered
// shapes behind it reveal depth instead of the whole thing jumping)
const heroImageWrapper = document.querySelector('.hero-image .tilt-element');
if (heroImageWrapper) {
    initTilt([heroImageWrapper], { max: 10, scale: 1, liftY: 0, perspectiveVal: 700 });
}

// Apply tilt to the about photo
const aboutImageWrapper = document.querySelector('.about-image.tilt-element');
if (aboutImageWrapper) {
    initTilt([aboutImageWrapper], { max: 8, scale: 1.02, liftY: 0, perspectiveVal: 900 });
}

// Apply tilt to skill cards and project cards
initTilt(document.querySelectorAll('.skill-card.tilt-element'), { max: 10, scale: 1.03, liftY: -10 });
initTilt(document.querySelectorAll('.project-card.tilt-element'), { max: 8, scale: 1.02, liftY: -10 });

/* ============================================================
   3D Hero Background (Three.js)
   A field of slow-spinning wireframe shapes that drifts gently
   with the mouse. Purely decorative, so any failure here (no
   WebGL, library blocked, etc.) is caught and just skipped.
   ============================================================ */
function initHeroBackground() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('hero-canvas');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero || typeof THREE === 'undefined') return;

    try {
        let width = hero.clientWidth;
        let height = hero.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);

        const group = new THREE.Group();
        scene.add(group);

        const geometries = [
            new THREE.IcosahedronGeometry(2.2, 0),
            new THREE.TorusGeometry(1.6, 0.5, 8, 16),
            new THREE.OctahedronGeometry(1.8, 0),
            new THREE.TetrahedronGeometry(2, 0)
        ];

        const colors = [0xb50000, 0xcd2626, 0x161516, 0xcd0000];
        const shapeCount = isMobile ? 6 : 14;
        const meshes = [];

        for (let i = 0; i < shapeCount; i++) {
            const geo = geometries[i % geometries.length];
            const mat = new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                wireframe: true,
                transparent: true,
                opacity: 0.35
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 42,
                (Math.random() - 0.5) * 26,
                (Math.random() - 0.5) * 18 - 4
            );
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

            mesh.userData = {
                rotSpeedX: 0.002 + Math.random() * 0.004,
                rotSpeedY: 0.0015 + Math.random() * 0.003,
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.4 + Math.random() * 0.5,
                baseY: mesh.position.y
            };

            group.add(mesh);
            meshes.push(mesh);
        }

        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        });

        const clock = new THREE.Clock();
        let rafId;

        function animate() {
            rafId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            meshes.forEach(mesh => {
                mesh.rotation.x += mesh.userData.rotSpeedX;
                mesh.rotation.y += mesh.userData.rotSpeedY;
                mesh.position.y = mesh.userData.baseY +
                    Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 1.5;
            });

            group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.03;
            group.rotation.x += (-mouseY * 0.2 - group.rotation.x) * 0.03;

            renderer.render(scene, camera);
        }
        animate();

        let resizeTimerBg;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimerBg);
            resizeTimerBg = setTimeout(() => {
                width = hero.clientWidth;
                height = hero.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }, 200);
        });

        // Pause rendering when the hero section is off-screen to save battery/CPU
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!rafId) animate();
                } else {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            });
        }, { threshold: 0.05 });
        heroObserver.observe(hero);

    } catch (err) {
        console.warn('3D hero background disabled:', err);
    }
}

// Three.js is loaded with `defer`, so wait for full page load before using it
window.addEventListener('load', initHeroBackground);

console.log('Portfolio website loaded successfully with 3D effects!');