/**
 * GSM Pay — Navbar JavaScript
 * Handles: scroll-triggered glass effect, active link, smooth toggler
 */

(function () {
  "use strict";

  /* ── Scroll Glass Effect ─────────────────────────────────────── */
  const nav = document.getElementById("mainNav");
  const SCROLL_THRESHOLD = 30; // px before effect kicks in

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  // Throttle scroll for performance
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, {
    passive: true
  });

  // Run once on load (handles page refresh mid-scroll)
  onScroll();


  /* ── Active Nav Link ─────────────────────────────────────────── */
  const navLinks = document.querySelectorAll(".nav-pill");

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      navLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });


  /* ── Close mobile menu on link click ────────────────────────── */
  const navMenu = document.getElementById("navMenu");
  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navMenu, {
    toggle: false
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && navMenu.classList.contains("show")) {
        bsCollapse.hide();
      }
    });
  });


  /* ── Staggered entrance animation for nav items ─────────────── */
  function animateNavIn() {
    const items = document.querySelectorAll(".nav-item, .nav-cta");
    items.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(-8px)";
      el.style.transition = `opacity 0.45s ease ${i * 60}ms, transform 0.45s ease ${i * 60}ms`;
      // Trigger reflow then animate
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      });
    });
  }

  // Wait for fonts / DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", animateNavIn);
  } else {
    animateNavIn();
  }

  const typingTextElement = document.getElementById("typing-text");
  const phrases = ["Fast.", " Secure.", " Easy.", " Convenient."];
  let currentPhraseIndex = 0;
  let charIndex = 0;
  let isTyping = true;

  function type() {
    const currentPhrase = phrases[currentPhraseIndex];

    if (isTyping) {
      if (charIndex < currentPhrase.length) {
        typingTextElement.textContent += currentPhrase.charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
      } else {
        isTyping = false;
        setTimeout(type, 800); // Pause after typing a phrase
      }
    } else {
      // Logic to move to the next phrase and clear the text
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      charIndex = 0;
      isTyping = true;
      typingTextElement.textContent = "";
      setTimeout(type, 50); // Small delay before typing the next phrase
    }
  }
  type();


})();