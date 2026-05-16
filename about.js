document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

// Profile dropdown toggle
const profile = document.querySelector('.profile');
const dropdown = document.querySelector('.profile-dropdown');

profile.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!profile.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

    // Scroll reveal animation
    const hiddenElements = document.querySelectorAll('.hidden');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    hiddenElements.forEach(el => observer.observe(el));
});