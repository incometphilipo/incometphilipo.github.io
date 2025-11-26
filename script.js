document.addEventListener('DOMContentLoaded', function () {
    
    // Function to handle the overlay menu for mobile devices
    const initializeOverlayMenu = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navOverlay = document.getElementById('nav-overlay');
        const closeBtn = document.querySelector('.close-btn');
        
        if (menuToggle && navOverlay && closeBtn) {
            menuToggle.addEventListener('click', () => { 
                navOverlay.style.width = '100%'; 
            });
            
            closeBtn.addEventListener('click', () => { 
                navOverlay.style.width = '0'; 
            });
        }

        // Handle dropdowns within the overlay (on click)
        const dropdownBtns = document.querySelectorAll('.dropbtn-overlay');
        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                const dropdownContent = btn.nextElementSibling;
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown-content-overlay').forEach(content => {
                    if (content !== dropdownContent) {
                        content.classList.remove('show');
                    }
                });
                
                // Toggle current dropdown
                dropdownContent.classList.toggle('show');
            });
        });

        // Close overlay when a main link is clicked
        const overlayLinks = document.querySelectorAll('.nav-links-overlay > li > a:not(.dropbtn-overlay)');
        overlayLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navOverlay) {
                    navOverlay.style.width = '0';
                }
            });
        });
    };

    // Function to hide header on scroll down, show on scroll up
    const initializeScrollEffect = () => {
        let lastScrollTop = 0;
        const header = document.querySelector('.site-header');

        if (!header) {
            console.warn('Site header not found');
            return;
        }

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            // Add 'scrolled' class for shrinking effect
            document.body.classList.toggle('scrolled', currentScroll > 50);

            if (currentScroll > lastScrollTop && currentScroll > 50) {
                // Scrolling down - hide header
                header.classList.add('hide');
            } else {
                // Scrolling up - show header
                header.classList.remove('hide');
            }

            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        });
    };

    // Function to initialize form tabs
    const initializeFormTabs = () => {
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const formType = btn.dataset.formType || (index === 0 ? 'long' : 'short');
                showForm(formType);
            });
        });
    };

    // Function to show specific form
    window.showForm = function(type) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const formSections = document.querySelectorAll('.form-section');
        const longCourse = document.getElementById('long-course');
        const shortCourse = document.getElementById('short-course');
        
        // Safety check
        if (!tabBtns.length || !formSections.length) {
            console.warn('Form elements not found. Make sure the HTML is loaded.');
            return;
        }
        
        // Remove all active states
        tabBtns.forEach(btn => btn.classList.remove('active'));
        formSections.forEach(sec => sec.classList.remove('active'));

        // Add active states based on type
        if (type === 'long') {
            if (tabBtns[0]) tabBtns[0].classList.add('active');
            if (longCourse) longCourse.classList.add('active');
        } else if (type === 'short') {
            if (tabBtns[1]) tabBtns[1].classList.add('active');
            if (shortCourse) shortCourse.classList.add('active');
        } else {
            console.warn(`Unknown form type: ${type}`);
        }
    };

    // Main function to load templates and then initialize scripts
    const loadTemplatesAndInit = async () => {
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        try {
            // Load header template
            if (headerPlaceholder) {
                const headerResponse = await fetch('header.html');
                if (headerResponse.ok) {
                    headerPlaceholder.innerHTML = await headerResponse.text();
                } else {
                    console.error('Failed to load header:', headerResponse.status);
                }
            }
            
            // Load footer template
            if (footerPlaceholder) {
                const footerResponse = await fetch('footer.html');
                if (footerResponse.ok) {
                    footerPlaceholder.innerHTML = await footerResponse.text();
                } else {
                    console.error('Failed to load footer:', footerResponse.status);
                }
            }
            
            // Small delay to ensure DOM is fully updated
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Initialize all functionalities after templates are loaded
            initializeOverlayMenu();
            initializeScrollEffect();
            initializeFormTabs();
            
            // Show default form if forms exist on page
            const longCourse = document.getElementById('long-course');
            if (longCourse) {
                showForm('long');
            }
            
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    };

    // Start the initialization process
    loadTemplatesAndInit();
});