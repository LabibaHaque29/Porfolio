document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const welcomeText = document.getElementById('welcome-text');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const sections = document.querySelectorAll('.content-section, .welcome-section');
    
    // 1. Typing effect
    function typeText() {
        const text = welcomeText.textContent;
        welcomeText.textContent = '';
        let i = 0;
        
        const typingEffect = setInterval(function() {
            if (i < text.length) {
                welcomeText.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 100);
    }
    
    // 2. Smooth scrolling
    function setupNavigation() {
    // Get all navigation links, including the logo link
    const allNavLinks = document.querySelectorAll('.nav-links a, .logo-container a');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Update active class for nav links only
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            if (this.parentElement.tagName === 'LI') {
                this.classList.add('active');
            }
            // Scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            // Close mobile menu if needed
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}
    
    // 3. Toggle sidebar on mobile
    function setupMobileMenu() {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
    
    // 4. Highlight active section while scrolling
    // Cache section positions to avoid forced reflow on every scroll event
    let sectionPositions = [];
    function updateSectionPositions() {
        sectionPositions = Array.from(sections).map(section => ({
            el: section,
            top: section.offsetTop,
            height: section.offsetHeight,
            id: section.getAttribute('id')
        }));
    }
    updateSectionPositions();

    function handleScroll() {
        const scrollPosition = window.scrollY;

        sectionPositions.forEach(({ top, height, id }) => {
            if (scrollPosition >= top - 100 &&
                scrollPosition < top + height - 100) {

                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                navLinks.forEach(link => link.classList.remove('active'));
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }
    
    // 5. Blur-in animation for about section
    function setupAboutAnimation() {
        const aboutElements = document.querySelectorAll('.about-text, .about-highlights');
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('blur-in');
                } else {
                    entry.target.classList.remove('blur-in');
                }
            });
        }, { threshold: 0.2 });

        aboutElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // 6. Slide-in animation for experience items
    function setupExperienceAnimation() {
        const experienceItems = Array.from(document.querySelectorAll('.experience-item'));
        const pendingTimeouts = new Map();

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const i = experienceItems.indexOf(entry.target);
                    const id = setTimeout(function() {
                        entry.target.classList.add('slide-in');
                        pendingTimeouts.delete(entry.target);
                    }, i * 150);
                    pendingTimeouts.set(entry.target, id);
                } else {
                    const pending = pendingTimeouts.get(entry.target);
                    if (pending !== undefined) {
                        clearTimeout(pending);
                        pendingTimeouts.delete(entry.target);
                    }
                    entry.target.classList.remove('slide-in');
                }
            });
        }, { threshold: 0.15 });

        experienceItems.forEach(function(item) {
            observer.observe(item);
        });
    }

    // 7. Project card carousel with zoom-in spring animation
    function setupProjectCardAnimation() {
        const track = document.querySelector('.projects-grid');
        const cards = Array.from(document.querySelectorAll('.project-card'));
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const progressFill = document.querySelector('.carousel-progress-fill');
        const counter = document.querySelector('.carousel-counter');
        if (!track || !cards.length) return;

        const total = cards.length;

        // IntersectionObserver for springy zoom — root is the scrollable track
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { root: track, threshold: 0.3 });

        cards.forEach(function(card) { observer.observe(card); });

        // Compute per-card scroll step from card offsets (accounts for gap + padding)
        function cardStep() {
            return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
        }

        // Update progress bar and counter on scroll
        function updateUI() {
            const maxScroll = track.scrollWidth - track.clientWidth;
            const pct = maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0;
            progressFill.style.width = pct + '%';
            const step = cardStep();
            const index = step > 0 ? Math.min(Math.round(track.scrollLeft / step), total - 1) : 0;
            counter.textContent = (index + 1) + ' / ' + total;
        }

        track.addEventListener('scroll', updateUI, { passive: true });
        updateUI();

        // Arrow buttons — scroll exactly one card width
        prevBtn.addEventListener('click', function() {
            track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', function() {
            track.scrollBy({ left: cardStep(), behavior: 'smooth' });
        });

        // Click-and-drag to scroll freely
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;

        track.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.pageX - track.getBoundingClientRect().left;
            startScrollLeft = track.scrollLeft;
            track.style.cursor = 'grabbing';
            track.style.userSelect = 'none';
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;
            isDragging = false;
            track.style.cursor = '';
            track.style.userSelect = '';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - track.getBoundingClientRect().left;
            track.scrollLeft = startScrollLeft - (x - startX);
        });
    }

    // Initialize
    typeText();
    setupNavigation();
    setupMobileMenu();
    setupAboutAnimation();
    setupExperienceAnimation();
    setupProjectCardAnimation();
    
    // Event listeners
    // Throttle scroll with requestAnimationFrame so it never runs more than once per frame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { handleScroll(); ticking = false; });
            ticking = true;
        }
    });

    // Debounce resize — only act after the user stops resizing for 150ms
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
            }
            // Re-cache positions because layout may have changed
            updateSectionPositions();
        }, 150);
    });
});