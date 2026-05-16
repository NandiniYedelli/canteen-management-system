document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Menu Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding menu category
            const category = btn.getAttribute('data-category');
            
            menuCategories.forEach(cat => {
                cat.classList.remove('active');
            });
            
            document.getElementById(category).classList.add('active');
        });
    });

    // Today's Special - Dynamic Content
    const specials = [
        {
            title: "Grilled Chicken Sandwich",
            description: "Grilled chicken breast with avocado, lettuce, tomato on multigrain bread",
            originalPrice: 5.99,
            discountPrice: 4.50,
            availability: 15
        },
        {
            title: "Veggie Pizza",
            description: "Homemade pizza with bell peppers, mushrooms, olives, and cheese",
            originalPrice: 6.99,
            discountPrice: 5.25,
            availability: 10
        },
        {
            title: "Beef Burrito Bowl",
            description: "Rice, seasoned beef, beans, corn, salsa, and sour cream",
            originalPrice: 7.50,
            discountPrice: 5.99,
            availability: 8
        }
    ];

    // Randomly select a special dish
    const randomSpecial = specials[Math.floor(Math.random() * specials.length)];
    
    // Update special dish display
    document.getElementById('special-title').textContent = randomSpecial.title;
    document.getElementById('special-description').textContent = randomSpecial.description;
    document.getElementById('special-original-price').textContent = `$${randomSpecial.originalPrice.toFixed(2)}`;
    document.getElementById('special-discount-price').textContent = `$${randomSpecial.discountPrice.toFixed(2)}`;
    document.getElementById('special-availability').textContent = randomSpecial.availability;

    // Check if canteen is open
    function checkCanteenStatus() {
        const date = new Date();
        const day = date.getDay(); // 0-6, where 0 is Sunday
        const hour = date.getHours();
        const minute = date.getMinutes();
        const currentTime = hour * 60 + minute; // Convert to minutes since midnight
        
        const openStatusElement = document.getElementById('open-status');
        
        // Check if it's a weekend
        if (day === 0 || day === 6) {
            openStatusElement.textContent = 'CLOSED (Weekend)';
            openStatusElement.className = 'closed';
            return;
        }
        
        // Check if within operating hours
        const breakfastStart = 7 * 60 + 30; // 7:30 AM
        const breakfastEnd = 10 * 60 + 30; // 10:30 AM
        
        const lunchStart = 11 * 60 + 30; // 11:30 AM
        const lunchEnd = 14 * 60 + 30; // 2:30 PM
        
        const snacksStart = 15 * 60; // 3:00 PM
        const snacksEnd = 18 * 60; // 6:00 PM
        
        const dinnerStart = 19 * 60; // 7:00 PM
        const dinnerEnd = 21 * 60 + 30; // 9:30 PM
        
        if (
            (currentTime >= breakfastStart && currentTime <= breakfastEnd) || 
            (currentTime >= lunchStart && currentTime <= lunchEnd) || 
            (currentTime >= snacksStart && currentTime <= snacksEnd) || 
            (currentTime >= dinnerStart && currentTime <= dinnerEnd)
        ) {
            openStatusElement.textContent = 'OPEN NOW';
            openStatusElement.className = 'open';
            
            // Determine which meal time
            let mealTime = '';
            if (currentTime >= breakfastStart && currentTime <= breakfastEnd) {
                mealTime = 'Breakfast';
            } else if (currentTime >= lunchStart && currentTime <= lunchEnd) {
                mealTime = 'Lunch';
            } else if (currentTime >= snacksStart && currentTime <= snacksEnd) {
                mealTime = 'Snacks';
            } else {
                mealTime = 'Dinner';
            }
            
            openStatusElement.textContent += ` (${mealTime})`;
        } else {
            openStatusElement.textContent = 'CLOSED';
            openStatusElement.className = 'closed';
            
            // Find next opening time
            let nextOpeningTime = '';
            if (currentTime < breakfastStart) {
                nextOpeningTime = 'Opens at 7:30 AM for Breakfast';
            } else if (currentTime < lunchStart) {
                nextOpeningTime = 'Opens at 11:30 AM for Lunch';
            } else if (currentTime < snacksStart) {
                nextOpeningTime = 'Opens at 3:00 PM for Snacks';
            } else if (currentTime < dinnerStart) {
                nextOpeningTime = 'Opens at 7:00 PM for Dinner';
            } else {
                nextOpeningTime = 'Opens tomorrow at 7:30 AM';
            }
            
            openStatusElement.textContent += ` (${nextOpeningTime})`;
        }
    }
    
    // Check canteen status on page load
    checkCanteenStatus();
    
    // Update status every minute
    setInterval(checkCanteenStatus, 60000);

    // Contact Form Handling
    const feedbackForm = document.getElementById('feedbackForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (name && email && message) {
                // In a real application, you would send this data to a server
                console.log('Form submitted:', { name, email, message });
                
                // Show success message
                feedbackForm.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Reset form
                feedbackForm.reset();
                
                // Hide success message after 5 seconds and show form again
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                    feedbackForm.style.display = 'block';
                }, 5000);
            }
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    
                    navLinks.forEach(link => {
                        link.style.animation = '';
                    });
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-links li a').forEach(link => {
                    link.classList.remove('active');
                });
                
                this.classList.add('active');
            }
        });
    });

    // Update active menu item on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links li a').forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".hidden");

    // Create an Intersection Observer to detect when elements enter the viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal"); // Add class to reveal element
            }
        });
    }, { threshold: 0.3 });

    // Observe each hidden element
    elements.forEach(element => {
        observer.observe(element);
    });
});

// Navigation Functions


function goHome() {
    window.location.href = "index.html"; // Redirects to the home page
}

function goBack() {
    window.location.href = "about.html"; // Goes back to the About page
}

document.addEventListener("DOMContentLoaded", function () {
    // Select the sign-in and sign-up buttons
    const signInButton = document.querySelector(".sign-in button");
    const signUpButton = document.querySelector(".sign-up button");

    // Redirect to second.html when Sign In is clicked
    signInButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default form submission
        window.location.href = "home_page.html"; // Redirect to second.html
    });

    // Redirect to second.html when Sign Up is clicked
    signUpButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default form submission
        window.location.href = "home_page.html"; // Redirect to second.html
    });
});
