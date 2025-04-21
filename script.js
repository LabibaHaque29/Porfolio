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
    function handleScroll() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - 100 && 
                scrollPosition < sectionTop + sectionHeight - 100) {
                
                const currentId = section.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[href="#${currentId}"]`);
                
                navLinks.forEach(link => link.classList.remove('active'));
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }
    
    // Initialize
    typeText();
    setupNavigation();
    setupMobileMenu();
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });
});