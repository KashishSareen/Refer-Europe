// Initialize AOS (assumes AOS script loaded before this file)
document.addEventListener('DOMContentLoaded', function () {
  if (window.AOS) {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80 });
  }

  // ===== Navbar: hide on scroll down, show on scroll up =====
  (function () {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    var lastScrollY = window.scrollY;
    var ticking = false;

    function onScroll() {
      var currentScrollY = window.scrollY;
      // Close mobile menu on any scroll
      closeMobileMenu();

      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY) {
          navbar.classList.remove('nav-visible');
          navbar.classList.add('nav-hidden');
        } else {
          navbar.classList.remove('nav-hidden');
          navbar.classList.add('nav-visible');
        }
      } else {
        navbar.classList.remove('nav-hidden');
        navbar.classList.add('nav-visible');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    });
  })();

  // ===== Hamburger menu toggle =====
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuOpen = false;

  function closeMobileMenu() {
    if (menuOpen && mobileMenu && hamburgerBtn) {
      mobileMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      var icon = hamburgerBtn.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
      menuOpen = false;
    }
  }

  function openMobileMenu() {
    if (!mobileMenu || !hamburgerBtn) return;
    mobileMenu.classList.add('open');
    hamburgerBtn.classList.add('active');
    var icon = hamburgerBtn.querySelector('i');
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
    menuOpen = true;
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menuOpen) closeMobileMenu(); else openMobileMenu();
    });
  }

  // Close on scroll
  window.addEventListener('scroll', function () { closeMobileMenu(); }, { passive: true });

  // Close when a link is clicked
  var mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(function (link) { link.addEventListener('click', function () { closeMobileMenu(); }); });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (menuOpen && mobileMenu && hamburgerBtn && !mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ===== FAQ toggle =====
  document.querySelectorAll('.faq-trigger').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';

      // Close all items (optional)
      document.querySelectorAll('.faq-trigger').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        if (btn.nextElementSibling) btn.nextElementSibling.style.maxHeight = null;
      });

      // Toggle current
      if (!expanded) {
        button.setAttribute('aria-expanded', 'true');
        const content = button.nextElementSibling;
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ===== Debug: detect horizontal overflow elements =====
  function reportOverflow() {
    try {
      var w = window.innerWidth || document.documentElement.clientWidth;
      var els = Array.from(document.querySelectorAll('body *'));
      var offenders = els.filter(function (el) {
        var rect = el.getBoundingClientRect();
        return rect.right > w + 1; // slight tolerance
      });
      if (offenders.length) {
        console.warn('Overflowing elements (right > viewport):', offenders);
        offenders.forEach(function (el) { el.style.outline = '2px solid rgba(255,0,0,0.6)'; });
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Run on load and resize to help find cause of horizontal scroll
  reportOverflow();
  window.addEventListener('resize', function () { reportOverflow(); });

});
