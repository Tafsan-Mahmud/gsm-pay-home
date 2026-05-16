/**
 * GSM Pay — Navbar JavaScript
 * Handles: scroll-triggered glass effect, active link, smooth toggler
 */

(function () {
  "use strict";

  // hero curve animation
  const curvePath = document.getElementById('curvePath');
  if (curvePath) {
    const len = curvePath.getTotalLength();
    curvePath.style.strokeDasharray = len;
    curvePath.style.strokeDashoffset = len;
  }

  /* ── Scroll Glass Effect ─────────────────────────────────────── */
  const nav = document.getElementById("mainNav");
  const SCROLL_THRESHOLD = 30;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", animateNavIn);
  } else {
    animateNavIn();
  }


  /* ── Trust track brand slider ────────────────────────────────── */
  // FIX 1: wrapped in if-block so a missing element
  // does NOT return early and kill the rest of the script
  const track = document.getElementById('trustTrack');
  if (track) {
    const original = Array.from(track.children);

    if (original.length) {
      const SPEED = 45;
      const COPIES = 5;

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

      track.innerHTML = '';
      track.appendChild(buildHalf(false));
      track.appendChild(buildHalf(true));

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          const halfWidth = track.scrollWidth / 2;
          const duration = halfWidth / SPEED;
          track.style.animationDuration = duration.toFixed(2) + 's';

          // mouse — desktop
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

          // FIX 2: touch — mobile/tablet
          track.addEventListener('touchstart', function () {
            track.style.animationPlayState = 'paused';
          }, {
            passive: true
          });

          track.addEventListener('touchend', function () {
            track.style.animationPlayState = 'running';
          });
        });
      });
    }
  }


  /* ── Powered By IC section ───────────────────────────────────── */
  var CONNECTIONS = [{
      pin: 'pin-1',
      port: 'cport-0',
      mid: 0.30
    },
    {
      pin: 'pin-0',
      port: 'cport-1',
      mid: 0.62
    },
    {
      pin: 'pin-2',
      port: 'cport-2',
      mid: 0.70
    },
    {
      pin: 'pin-3',
      port: 'cport-3',
      mid: 0.70
    },
    {
      pin: 'pin-4',
      port: 'cport-4',
      mid: 0.30
    },
    {
      pin: 'pin-5',
      port: 'cport-5',
      mid: 0.62
    },
  ];

  var svg = document.getElementById('poweredSvg');
  var stage = document.getElementById('poweredStage');
  var pathData = [];

  // Guard: section may not be on every page
  if (svg && stage) {

    function rel(el) {
      var e = el.getBoundingClientRect();
      var s = stage.getBoundingClientRect();
      return {
        bx: e.left - s.left + e.width / 2,
        by: e.bottom - s.top,
        tx: e.left - s.left + e.width / 2,
        ty: e.top - s.top,
      };
    }

    function buildD(from, to, mid) {
      var f = (mid !== undefined) ? mid : 0.5;
      var midY = from.by + (to.ty - from.by) * f;
      var dx = to.tx - from.bx;
      var adx = Math.abs(dx);

      if (adx < 3) {
        return 'M' + from.bx + ',' + from.by + ' L' + to.tx + ',' + to.ty;
      }

      var r = Math.min(8, adx * 0.28, Math.abs(midY - from.by) * 0.45);
      var sx = dx > 0 ? 1 : -1;

      return [
        'M' + from.bx + ',' + from.by,
        'L' + from.bx + ',' + (midY - r),
        'Q' + from.bx + ',' + midY + ' ' + (from.bx + sx * r) + ',' + midY,
        'L' + (to.tx - sx * r) + ',' + midY,
        'Q' + to.tx + ',' + midY + ' ' + to.tx + ',' + (midY + r),
        'L' + to.tx + ',' + to.ty,
      ].join(' ');
    }

    function makePath(d, stroke, w, opacity) {
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', stroke);
      p.setAttribute('stroke-width', String(w || 1.5));
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-linejoin', 'round');
      if (opacity !== undefined) p.setAttribute('opacity', String(opacity));
      return p;
    }

    function buildPaths() {
      svg.innerHTML = '';
      pathData.length = 0;

      svg.setAttribute('width', stage.offsetWidth);
      svg.setAttribute('height', stage.offsetHeight);
      svg.setAttribute('viewBox', '0 0 ' + stage.offsetWidth + ' ' + stage.offsetHeight);

      CONNECTIONS.forEach(function (conn) {
        var pinEl = document.getElementById(conn.pin);
        var portEl = document.getElementById(conn.port);
        if (!pinEl || !portEl) return;

        var from = rel(pinEl);
        var to = rel(portEl);
        var d = buildD(from, to, conn.mid);

        svg.appendChild(makePath(d, '#d1d5db', 1.5));

        var pulse = makePath(d, '#16a34a', 2.5, 0);
        pulse.style.filter = 'drop-shadow(0 0 6px rgba(34,197,94,.7))';
        svg.appendChild(pulse);

        var len = pulse.getTotalLength();
        var DASH = Math.min(52, len * 0.32);

        pulse.setAttribute('stroke-dasharray', DASH + ' ' + (len + DASH + 1));
        pulse.setAttribute('stroke-dashoffset', String(DASH));

        pathData.push({
          pulse: pulse,
          pinEl: pinEl,
          portEl: portEl,
          len: len,
          DASH: DASH,
          busy: false,
        });
      });
    }

    function animatePulse(pd, onComplete) {
      var pulse = pd.pulse;
      var len = pd.len;
      var DASH = pd.DASH;

      // FIX 3: removed duplicate `var startOff = DASH` line
      var startOff = -(len + DASH);
      var endOff = DASH;
      var dur = 1800 + len * 1.6;

      var token = pd.token = (pd.token || 0) + 1;

      pulse.setAttribute('opacity', '0');
      pulse.setAttribute('stroke-dashoffset', String(startOff));

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (pd.token !== token) return;

          pd.pinEl.classList.add('lit');
          pd.portEl.classList.add('lit');
          pulse.setAttribute('opacity', '1');

          var t0 = performance.now();

          function tick() {
            if (pd.token !== token) return;

            var p = Math.min((performance.now() - t0) / dur, 1);
            var eased = 0.5 - Math.cos(p * Math.PI) / 2;

            pulse.setAttribute('stroke-dashoffset',
              String(startOff + (endOff - startOff) * eased));

            if (p < 1) {
              requestAnimationFrame(tick);
            } else {
              setTimeout(function () {
                if (pd.token !== token) return;
                pulse.setAttribute('opacity', '0');
                pd.pinEl.classList.remove('lit');
                pd.portEl.classList.remove('lit');
                pd.busy = false;
                if (onComplete) onComplete();
              }, 120);
            }
          }

          requestAnimationFrame(tick);
        });
      });
    }

    function startLoop() {
      pathData.forEach(function (pd, i) {
        setTimeout(function () {
          (function loop() {
            var delay = 700 + Math.random() * 2000;
            setTimeout(function () {
              pd.busy = true;
              animatePulse(pd, loop);
            }, delay);
          }());
        }, i * 300 + Math.random() * 200);
      });
    }

    function init() {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          buildPaths();
          startLoop();
        });
      });
    }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        pathData.forEach(function (pd) {
          pd.token = (pd.token || 0) + 1;
        });
        requestAnimationFrame(function () {
          buildPaths();
          startLoop();
        });
      }, 130);
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

  } // end if (svg && stage)

  /* ── Powered title entrance ──────────────────────────────────── */
  const titleEl = document.getElementById('poweredTitle');
  if (titleEl) {
    // assign stagger delay to each word
    titleEl.querySelectorAll('.tw').forEach(function (word, i) {
      word.style.setProperty('--tw-delay', (.09 + i * .2) + 's');
    });

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.4
    });

    io.observe(titleEl);
  }

  // Pricing section
  var t = document.getElementById('pricingTitle');
  if (!t) return;
  t.querySelectorAll('.ptw').forEach(function (w, i) {
    w.style.setProperty('--ptw-delay', (0.04 + i * 0.1) + 's');
  });
  new IntersectionObserver(function (e) {
    e.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('revealed');
        arguments[1].unobserve(en.target);
      }
    });
  }, {
    threshold: .35
  }).observe(t);

}());