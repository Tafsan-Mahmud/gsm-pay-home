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
  if (nav) {
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
  }

  /* ── Active Nav Link ─────────────────────────────────────────── */
  const navLinks = document.querySelectorAll(".nav-pill");
  const navMenu = document.getElementById("navMenu");

  if (navMenu) {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navMenu, {
      toggle: false
    });
    navLinks.forEach(link => {
      link.addEventListener("click", function () {
        navLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");
      });
      link.addEventListener("click", () => {
        if (window.innerWidth < 992 && navMenu.classList.contains("show")) {
          bsCollapse.hide();
        }
      });
    });
  }

  // /* ── Staggered entrance animation for nav items (page load only) ── */
  // function animateNavIn() {
  //   const items = document.querySelectorAll(".nav-item, .nav-cta");
  //   items.forEach((el, i) => {
  //     el.style.opacity = "0";
  //     el.style.transform = "translateY(-8px)";
  //     el.style.transition = `opacity 0.4s ease ${i * 55}ms, transform 0.4s ease ${i * 55}ms`;
  //     requestAnimationFrame(() => {
  //       requestAnimationFrame(() => {
  //         el.style.opacity = "1";
  //         el.style.transform = "translateY(0)";
  //       });
  //     });
  //   });
  // }

  // if (document.readyState === "loading") {
  //   document.addEventListener("DOMContentLoaded", animateNavIn);
  // } else {
  //   animateNavIn();
  // }

  /* ── Trust track brand slider ────────────────────────────────── */
  // FIX: wrapped in if-block — missing element never kills script
  const trustTrack = document.getElementById('trustTrack');
  if (trustTrack) {
    const original = Array.from(trustTrack.children);
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

      trustTrack.innerHTML = '';
      trustTrack.appendChild(buildHalf(false));
      trustTrack.appendChild(buildHalf(true));

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          const halfWidth = trustTrack.scrollWidth / 2;
          const duration = halfWidth / SPEED;
          trustTrack.style.animationDuration = duration.toFixed(2) + 's';

          trustTrack.addEventListener('mouseover', function (e) {
            if (e.target.closest('.trust-logo-item'))
              trustTrack.style.animationPlayState = 'paused';
          });
          trustTrack.addEventListener('mouseout', function (e) {
            if (e.target.closest('.trust-logo-item'))
              trustTrack.style.animationPlayState = 'running';
          });
          trustTrack.addEventListener('touchstart', function () {
            trustTrack.style.animationPlayState = 'paused';
          }, {
            passive: true
          });
          trustTrack.addEventListener('touchend', function () {
            trustTrack.style.animationPlayState = 'running';
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
      if (adx < 3) return 'M' + from.bx + ',' + from.by + ' L' + to.tx + ',' + to.ty;
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
          pulse,
          pinEl,
          portEl,
          len,
          DASH,
          busy: false
        });
      });
    }

    function animatePulse(pd, onComplete) {
      var pulse = pd.pulse;
      var len = pd.len;
      var DASH = pd.DASH;
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
            pulse.setAttribute('stroke-dashoffset', String(startOff + (endOff - startOff) * eased));
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

  /* ── Pricing title entrance ──────────────────────────────────── */
  // FIX: wrapped in if-block — was using `if(!t) return` which
  // exited the entire IIFE, killing the slider and anything below
  const pricingTitle = document.getElementById('pricingTitle');
  if (pricingTitle) {
    pricingTitle.querySelectorAll('.ptw').forEach(function (w, i) {
      w.style.setProperty('--ptw-delay', (0.04 + i * 0.1) + 's');
    });
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: .35
    }).observe(pricingTitle);
  }

  /* ── Dashboard carousel slider ───────────────────────────────── */
  var embTrack = document.getElementById('embTrack');
  var embNavEl = document.getElementById('embDotNav');
  var embWrap = document.getElementById('embWrap');

  if (embTrack && embNavEl) {

    var embSlides = embTrack.querySelectorAll('.emb-slide');
    var embReal = embSlides.length; /* real count — used for dots + text */
    var embCur = 0;
    var embTimer;
    var embJumping = false;

    /*
     * INFINITE LOOP FIX:
     * Clone the first slide and append it to the end of the track.
     * When the track slides to this clone, it looks identical to slide 0.
     * After the transition ends we silently reset to the real index 0
     * (no animation = no visible jump). This gives seamless forward looping.
     */
    var firstClone = embSlides[0].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    embTrack.appendChild(firstClone);

    /* text slides (may not exist on all pages — safe if absent) */
    var embTextSlides = document.querySelectorAll('.emb-text-slide');

    /* build dots for real slides only */
    embSlides.forEach(function (_, i) {
      var btn = document.createElement('button');
      btn.className = 'emb-dot-btn' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      btn.addEventListener('click', function () {
        embGoTo(i);
        embResetTimer();
      });
      embNavEl.appendChild(btn);
    });

    var embDots = embNavEl.querySelectorAll('.emb-dot-btn');

    function embSyncText(ri) {
      embTextSlides.forEach(function (s, i) {
        s.classList.toggle('active', i === ri);
      });
    }

    function embGoTo(n) {
      if (embJumping) return;
      embCur = n;

      embTrack.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
      embTrack.style.transform = 'translateX(-' + (embCur * 100) + '%)';

      /* sync dots + text using real index */
      var ri = embCur % embReal;
      embDots.forEach(function (d, i) {
        d.classList.toggle('active', i === ri);
      });
      embSyncText(ri);

      /* reached clone → wait for transition then silently reset to real 0 */
      if (embCur === embReal) {
        embJumping = true;
        setTimeout(function () {
          embTrack.style.transition = 'none';
          embCur = 0;
          embTrack.style.transform = 'translateX(0%)';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              embJumping = false;
            });
          });
        }, 570); /* 20ms after the 550ms transition finishes */
      }
    }

    function embResetTimer() {
      clearInterval(embTimer);
      embTimer = setInterval(function () {
        embGoTo(embCur + 1);
      }, 4000);
    }

    if (embWrap) {
      embWrap.addEventListener('mouseenter', function () {
        clearInterval(embTimer);
      });
      embWrap.addEventListener('mouseleave', embResetTimer);

      var embSx = 0;
      embWrap.addEventListener('touchstart', function (e) {
        embSx = e.touches[0].clientX;
        clearInterval(embTimer);
      }, {
        passive: true
      });
      embWrap.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - embSx;
        if (Math.abs(dx) > 40) embGoTo(dx < 0 ? embCur + 1 : embCur - 1);
        embResetTimer();
      });
    }

    embResetTimer();

  } // end slider

  /* ══════════════════════════════════════════════════════════════
       REGISTER — progressive multi-step form
       Add this block inside your IIFE in script.js
       ══════════════════════════════════════════════════════════════ */

  /* ── Eye toggles ─────────────────────────────────────────────── */
  document.querySelectorAll('.rg-eye').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var inp = document.getElementById(btn.dataset.target);
      if (!inp) return;
      var isText = inp.type === 'text';
      inp.type = isText ? 'password' : 'text';
      btn.querySelector('i').className = isText ? 'bi bi-eye' : 'bi bi-eye-slash';

      /* restore cursor to end — switching type resets it to position 0 */
      var len = inp.value.length;
      inp.setSelectionRange(len, len);
      inp.focus();
    });
  });

  /* ── Multi-step logic ────────────────────────────────────────── */
  var rgForm = document.getElementById('rgForm');
  if (rgForm) {

    var curStep = 1;

    var panels = [null,
      document.getElementById('rgPanel1'),
      document.getElementById('rgPanel2'),
      document.getElementById('rgPanel3')
    ];
    var headers = [null,
      document.getElementById('rgHeader1'),
      document.getElementById('rgHeader2'),
      document.getElementById('rgHeader3')
    ];
    var stepItems = [null,
      document.getElementById('rgStepItem1'),
      document.getElementById('rgStepItem2'),
      document.getElementById('rgStepItem3')
    ];

    var btnPrev = document.getElementById('rgPrev');
    var btnNext = document.getElementById('rgNext');
    var btnSubmit = document.getElementById('rgSubmit');
    var fillEl = document.getElementById('rgProgressFill');

    /* progress fill: 0% / 50% / 100% */
    var fillMap = {
      1: '0%',
      2: '50%',
      3: '100%'
    };

    function goToStep(n) {
      /* hide old */
      panels[curStep].style.display = 'none';
      headers[curStep].style.display = 'none';

      /* mark done or reset */
      if (n > curStep) {
        stepItems[curStep].classList.remove('active');
        stepItems[curStep].classList.add('done');
      } else {
        stepItems[curStep].classList.remove('active', 'done');
      }

      curStep = n;

      /* show new */
      panels[curStep].style.display = 'block';
      headers[curStep].style.display = 'block';

      stepItems[curStep].classList.remove('done');
      stepItems[curStep].classList.add('active');

      /* un-done future steps when going back */
      for (var i = curStep + 1; i <= 3; i++) {
        stepItems[i].classList.remove('active', 'done');
      }

      /* progress bar */
      fillEl.style.width = fillMap[curStep];

      /* button visibility */
      btnPrev.style.display = curStep > 1 ? 'inline-flex' : 'none';
      btnNext.style.display = curStep < 3 ? 'inline-flex' : 'none';
      btnSubmit.style.display = curStep === 3 ? 'inline-flex' : 'none';
    }

    /* ── Validation per step ────────────────────────────────────── */
    function validateStep(n) {
      var ok = true;

      function check(id) {
        var el = document.getElementById(id);
        if (!el) return;
        var empty = !el.value.trim();
        el.classList.toggle('rg-err', empty);
        if (empty) ok = false;
        el.addEventListener('input', function () {
          el.classList.remove('rg-err');
        }, {
          once: true
        });
      }

      if (n === 1) {
        check('rgName');
        /* email format */
        var emailEl = document.getElementById('rgEmail');
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
        emailEl.classList.toggle('rg-err', !emailOk);
        if (!emailOk) ok = false;
        emailEl.addEventListener('input', function () {
          emailEl.classList.remove('rg-err');
        }, {
          once: true
        });
        check('rgPhone');
      }

      if (n === 2) {
        check('rgAddr1');
        check('rgCity');
        check('rgCountry');
      }

      return ok;
    }

    /* ── Next button ─────────────────────────────────────────────── */
    btnNext.addEventListener('click', function () {
      if (!validateStep(curStep)) return;
      goToStep(curStep + 1);
    });

    /* ── Prev button ─────────────────────────────────────────────── */
    btnPrev.addEventListener('click', function () {
      goToStep(curStep - 1);
    });

    /* ── Password tooltip show/hide ──────────────────────────────── */
    var pwGuide = document.getElementById('rgPwGuide');
    var pwInput = document.getElementById('rgPass');
    var pwBlurTimer;

    pwInput.addEventListener('focus', function () {
      clearTimeout(pwBlurTimer);
      pwGuide.classList.add('visible');
    });

    pwInput.addEventListener('blur', function () {
      /* small delay so eye-button click doesn't flash it away */
      pwBlurTimer = setTimeout(function () {
        pwGuide.classList.remove('visible');
      }, 180);
    });
    /* ── Password rules ──────────────────────────────────────────── */
    var pwRules = [{
        id: 'pwLen',
        test: function (v) {
          return v.length >= 8;
        }
      },
      {
        id: 'pwUpper',
        test: function (v) {
          return /[A-Z]/.test(v);
        }
      },
      {
        id: 'pwLower',
        test: function (v) {
          return /[a-z]/.test(v);
        }
      },
      {
        id: 'pwNum',
        test: function (v) {
          return /[0-9]/.test(v);
        }
      },
      {
        id: 'pwSpecial',
        test: function (v) {
          return /[!@#$%^&*(),.?":{}|<>_\-]/.test(v);
        }
      },
    ];

    function allRulesPass(val) {
      return pwRules.every(function (r) {
        return r.test(val);
      });
    }

    function checkMatch() {
      var p = document.getElementById('rgPass').value;
      var pc = document.getElementById('rgPassC').value;
      var msg = document.getElementById('rgMatchMsg');
      if (!pc) {
        msg.textContent = '';
        msg.className = 'rg-match-msg';
        return false;
      }
      var match = p === pc;
      msg.textContent = match ? '✓ Passwords match' : '✗ Passwords do not match';
      msg.className = 'rg-match-msg ' + (match ? 'ok' : 'err');
      return match;
    }

    document.getElementById('rgPass').addEventListener('input', function () {
      var val = this.value;
      pwRules.forEach(function (r) {
        var el = document.getElementById(r.id);
        var pass = r.test(val);
        el.classList.toggle('pass', pass);
        el.querySelector('i').className = pass ?
          'bi bi-check-circle-fill' :
          'bi bi-x-circle-fill';
      });
      updateSubmit();
      checkMatch();
    });

    document.getElementById('rgPassC').addEventListener('input', function () {
      checkMatch();
      updateSubmit();
    });

    function updateSubmit() {
      var p = document.getElementById('rgPass').value;
      var pc = document.getElementById('rgPassC').value;
      var ready = allRulesPass(p) && p === pc && p.length > 0;
      btnSubmit.disabled = !ready;

      /* fill or unfill the last step circle */
      var step3 = document.getElementById('rgStepItem3');
      if (ready) {
        step3.classList.add('done');
        step3.classList.remove('active');
      } else {
        step3.classList.remove('done');
        step3.classList.add('active');
      }

      /* fill progress bar to 100% when ready, back to 50% when not */
      document.getElementById('rgProgressFill').style.width = ready ? '100%' : '50%';
    }

    /* ── Submit ──────────────────────────────────────────────────── */
    rgForm.addEventListener('submit', function (e) {
      e.preventDefault();
      /* handle form submission here */
    });

    /* ── Init ────────────────────────────────────────────────────── */
    goToStep(1);
  }

}());