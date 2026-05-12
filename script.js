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

  // truck tarin brand slider
  const track = document.getElementById('trustTrack');
  if (!track) return;

  const original = Array.from(track.children);
  if (!original.length) return;

  const SPEED = 45; // px per second — tweak this to control speed
  const COPIES = 5; // copies per half — always fills any screen

  // Build one half = COPIES × original items
  function buildHalf(hidden) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COPIES; i++) {
      original.forEach(function (item) {
        const clone = item.cloneNode(true);
        if (hidden) clone.setAttribute('aria-hidden', 'true');
        frag.appendChild(clone);
      });
    }
    return frag;
  }

  // Replace track with: firstHalf + secondHalf (identical)
  // -50% always lands on pixel-perfect identical content
  track.innerHTML = '';
  track.appendChild(buildHalf(false));
  track.appendChild(buildHalf(true));

  // Measure AFTER layout is fully painted — double rAF guarantees it
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      // Width of first half = half the total track
      const halfWidth = track.scrollWidth / 2;
      const duration = halfWidth / SPEED;

      track.style.animationDuration = duration.toFixed(2) + 's';

      // Pause on individual card hover
      track.addEventListener('mouseover', function (e) {
        if (e.target.closest('.trust-logo-item')) {
          track.style.animationPlayState = 'paused';
        }
      });
      track.addEventListener('mouseout', function (e) {
        if (e.target.closest('.trust-logo-item')) {
          track.style.animationPlayState = 'running';
        }
      });
    });
  });

  const len = document.getElementById('curvePath').getTotalLength();
  document.getElementById('curvePath').style.strokeDasharray = len;
  document.getElementById('curvePath').style.strokeDashoffset = len;


})();