// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    // Import i18n client
    const { default: i18n } = await import('../../i18n/client');
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^=\"#\"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href') as string);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Watch demo button functionality
    const watchDemoBtn = document.getElementById('watchDemoBtn');
    if (watchDemoBtn) {
      watchDemoBtn.addEventListener('click', () => {
        // Scroll to demo section
        const demoSection = document.getElementById('demo');
        if (demoSection) {
          demoSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        
        // Add visual feedback
        watchDemoBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          watchDemoBtn.style.transform = '';
        }, 150);
      });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (navbar) {
      let lastScroll = 0;
      
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Change navbar appearance on scroll using CSS classes
        if (currentScroll > 100) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
          navbar.classList.add('navbar-hidden');
        } else {
          navbar.classList.remove('navbar-hidden');
        }
        
        lastScroll = currentScroll;
      });
    }

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('.features, .how-it-works, .demo, .cta');
    sections.forEach(section => {
      observer.observe(section);
    });

    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      const cardElement = card as HTMLElement;
      cardElement.addEventListener('mouseenter', () => {
        cardElement.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      cardElement.addEventListener('mouseleave', () => {
        cardElement.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Stats counter animation with i18n support
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounter = async (element: Element, target: number, suffix: string = '') => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }, 30);
    };

    // Trigger counter animations when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const text = element.textContent || '';
          
          if (text.includes('10K+')) {
            animateCounter(element, 10000, '+');
          } else if (text.includes('500+')) {
            animateCounter(element, 500, '+');
          } else if (text.includes('99%')) {
            animateCounter(element, 99, '%');
          }
          
          statsObserver.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });

    // Mobile menu toggle (if needed in future)
    const createMobileMenu = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar && window.innerWidth <= 768) {
        // Mobile menu logic can be added here
        console.log('Mobile view detected');
      }
    };

    // Initial check and resize listener
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    // Add click tracking for analytics (placeholder)
    const trackClick = (element: string, action: string) => {
      console.log(`Tracked: ${element} - ${action}`);
      // Analytics tracking code would go here
    };

    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.cta-button, .primary-button, .cta-button-large');
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        trackClick('CTA Button', 'Click');
      });
    });

    console.log('Landing page interactions initialized');
  });
}