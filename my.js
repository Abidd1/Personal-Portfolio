// Consolidate all JS functionality here.
// Remove or integrate functionality from my.js if it's different.

document.addEventListener('DOMContentLoaded', function() {
  
  // --- Navigation and Mobile Menu ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      // Update ARIA attribute for accessibility
      this.setAttribute('aria-expanded', this.classList.contains('active'));
    });
  }
  
  // Close mobile menu when a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      // Prevent default anchor click behavior
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      // Ensure it's not just '#'
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate the header height to offset the scroll position
        const headerHeight = document.querySelector('header').offsetHeight;
        // Get the target element's position relative to the viewport
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth' // Smooth scroll animation
        });
        
        // Update the URL in the browser history without a full page reload
        history.pushState(null, null, targetId);
      }
    });
  });

  // --- Back to Top Button Visibility and Functionality ---
  const backToTopBtn = document.querySelector('.back-to-top');
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    // Show button after scrolling down 300px
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top when button is clicked
  backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- Portfolio Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove 'active' class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add 'active' class to the clicked button
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Show or hide portfolio items based on category
        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block'; // Show the item
          } else {
            item.style.display = 'none'; // Hide the item
          }
        });
      });
    });
  }

  // --- Dynamic Year in Footer ---
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Form Submission Handling (using web3forms) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent default form submission
      
      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      
      // Disable button and change text during submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Use fetch API to send data to web3forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          submitBtn.textContent = 'Message Sent!';
          this.reset(); // Clear the form
          // Optionally show a success message to the user
          alert('Message sent successfully!'); 
        } else {
          submitBtn.textContent = 'Failed to Send';
          // Optionally log the error or show it to the user
          console.error('Form submission error:', data.message);
          alert('Failed to send message. Please try again.');
        }
      })
      .catch(error => {
        submitBtn.textContent = 'Failed to Send';
        console.error('Network error:', error);
        alert('Failed to send message due to a network error.');
      })
      .finally(() => {
        // Re-enable button after a short delay
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }, 3000); // Keep button disabled for 3 seconds
      });
    });
  }

  // --- Lazy Loading for Images ---
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    // Select all images with the 'loading="lazy"' attribute
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Create an observer instance
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // If the image is in the viewport
        if (entry.isIntersecting) {
          const img = entry.target;
          // Set the src attribute from the dataset attribute
          img.src = img.dataset.src || img.src;
          // Remove data-src to avoid re-processing
          if (img.dataset.src) {
            img.removeAttribute('data-src');
          }
          // Unobserve the image once it's loaded
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '0px 0px 200px 0px' // Load images when they are 200px from the bottom of the viewport
    });
    
    // Observe each lazy image
    lazyImages.forEach(img => {
      // Ensure the image has a src or data-src attribute before observing
      if (img.src || img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }

  // --- Sticky Header Effect ---
  const header = document.querySelector('header');
  let lastScrollTop = 0; // To track scroll direction

  // Add classes to header based on scroll
  window.addEventListener('scroll', function() {
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // If scrolling down and header is not already scrolled down, add scroll-down class
    if (currentScrollTop > lastScrollTop && currentScrollTop > 80) { // Added a threshold of 80px to avoid hiding header on initial small scrolls
      header.classList.add('scroll-down');
      header.classList.remove('scroll-up');
    } else if (currentScrollTop < lastScrollTop) { // If scrolling up, add scroll-up class
      header.classList.add('scroll-up');
      header.classList.remove('scroll-down');
    }
    // If at the top, remove both classes
    if (currentScrollTop === 0) {
      header.classList.remove('scroll-down');
      header.classList.remove('scroll-up');
    }
    
    lastScrollTop = currentScrollTop;
  });
  
  // --- Accessibility: Add focus styling for keyboard navigation ---
  // Add a class to the html element when keyboard navigation is detected
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') { // Check if the pressed key is Tab
      document.documentElement.classList.add('keyboard-nav');
    }
  });

  // Remove the class when mouse is used to prevent styles interfering with mouse users
  document.addEventListener('mousedown', function() {
    document.documentElement.classList.remove('keyboard-nav');
  });
});

const hamburger = document.querySelector('.navbar-hamburger');
const menu = document.querySelector('.navbar-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
});
