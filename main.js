document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    // Event listeners
    if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', toggleSidebar);
    }

    overlay.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking on a link
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    });

    // Existing down arrow animation code
    const buttonContainer = document.querySelector('.button-container');
    const downArrow = document.querySelector('.down-arrow');
    const discoverButton = document.getElementById('discover-button');
    const aboutSection = document.getElementById('about');
    
    let animationId = null;
    let startTime = null;
    const duration = 1500;
    const distance = 10;
    
    // Show and animate arrow on container hover
    if (buttonContainer && downArrow) {
        buttonContainer.addEventListener('mouseenter', () => {
            downArrow.style.opacity = '1';
            startAnimation();
        });
        
        buttonContainer.addEventListener('mouseleave', () => {
            downArrow.style.opacity = '0';
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            downArrow.style.transform = 'translateY(0)';
        });
    }

    // Smooth scroll to about section when button is clicked
    if (discoverButton && aboutSection) {
        discoverButton.addEventListener('click', (e) => {
            e.preventDefault();
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
        
        if (downArrow) {
            downArrow.addEventListener('click', () => {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            });
            downArrow.style.cursor = 'pointer';
        }
    }

    // Animation function for the down arrow
    function startAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        startTime = null;
        animateArrow();
    }
    
    function animateArrow(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % duration) / duration;
        const yPos = Math.sin(progress * Math.PI * 2) * distance;
        
        if (downArrow) {
            downArrow.style.transform = `translateY(${yPos}px)`;
        }
        
        animationId = requestAnimationFrame(animateArrow);
    }

    // Section snapping on scroll
    const sections = document.querySelectorAll('section');
    let isScrolling = false;
    let scrollTimeout;
    
    // Add smooth scrolling to all section links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Handle wheel events for section snapping
    window.addEventListener('wheel', (e) => {
        // Prevent default scroll behavior
        e.preventDefault();
        
        // If already handling a scroll, ignore new wheel events
        if (isScrolling) return;
        
        // Get scroll direction (1 for down, -1 for up)
        const direction = Math.sign(e.deltaY);
        
        // Find current section
        let currentSectionIndex = -1;
        const currentScroll = window.scrollY + (window.innerHeight / 3);
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = window.scrollY + rect.top;
            const sectionBottom = sectionTop + rect.height;
            
            if (currentScroll >= sectionTop && currentScroll <= sectionBottom) {
                currentSectionIndex = index;
            }
        });
        
        // If we couldn't find the current section, default to first or last
        if (currentSectionIndex === -1) {
            currentSectionIndex = direction > 0 ? 0 : sections.length - 1;
        }
        
        // Determine target section based on scroll direction
        const targetSectionIndex = Math.min(
            Math.max(0, currentSectionIndex + direction),
            sections.length - 1
        );
        
        // Only proceed if we're changing sections
        if (targetSectionIndex !== currentSectionIndex) {
            isScrolling = true;
            const targetSection = sections[targetSectionIndex];
            
            // Smooth scroll to the target section
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
            
            // Re-enable scrolling after animation completes
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    }, { passive: false });
    
    // Handle keyboard navigation (up/down arrows)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            // Find current section
            let currentSectionIndex = -1;
            const currentScroll = window.scrollY + (window.innerHeight / 3);
            
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const sectionTop = window.scrollY + rect.top;
                const sectionBottom = sectionTop + rect.height;
                
                if (currentScroll >= sectionTop && currentScroll <= sectionBottom) {
                    currentSectionIndex = index;
                }
            });
            
            // If we couldn't find the current section, default to first or last
            if (currentSectionIndex === -1) {
                currentSectionIndex = e.key === 'ArrowDown' ? 0 : sections.length - 1;
            }
            
            // Determine target section based on key pressed
            const targetSectionIndex = Math.min(
                Math.max(0, currentSectionIndex + (e.key === 'ArrowDown' ? 1 : -1)),
                sections.length - 1
            );
            
            // Only proceed if we're changing sections
            if (targetSectionIndex !== currentSectionIndex) {
                const targetSection = sections[targetSectionIndex];
                
                // Smooth scroll to the target section
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});