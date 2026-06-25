(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════════
     Each section below is wrapped in its own function and try/catch.
     A missing element or a thrown error in ONE section can never
     block or skip any other section on the page.
     ══════════════════════════════════════════════════════════════ */

  function safe(fn, label) {
    try {
      fn();
    } catch (err) {
      console.error('[script.js] ' + label + ' failed:', err);
    }
  }

  /* ── Hero curve draw-in ───────────────────────────────────────── */
  safe(function () {
    var curvePath = document.getElementById('curvePath');
    if (!curvePath) return;
    var len = curvePath.getTotalLength();
    curvePath.style.strokeDasharray = len;
    curvePath.style.strokeDashoffset = len;
  }, 'hero curve');

  /* ── Scroll glass nav ─────────────────────────────────────────── */
  safe(function () {
    var nav = document.getElementById('mainNav');
    if (!nav) return;
    var SCROLL_THRESHOLD = 30;

    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, {
      passive: true
    });

    onScroll();
  }, 'scroll nav');

  /* ── Active nav link + mobile menu close ─────────────────────── */
  safe(function () {
    var navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    var navLinks = document.querySelectorAll('.nav-pill');
    var bsCollapse = bootstrap.Collapse.getOrCreateInstance(navMenu, {
      toggle: false
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.forEach(function (l) {
          l.classList.remove('active');
        });
        this.classList.add('active');
      });
      link.addEventListener('click', function () {
        if (window.innerWidth < 992 && navMenu.classList.contains('show')) {
          bsCollapse.hide();
        }
      });
    });
  }, 'nav links');

  /* ── Trust track marquee ──────────────────────────────────────── */
  safe(function () {
    var trustTrack = document.getElementById('trustTrack');
    if (!trustTrack) return;
    var original = Array.from(trustTrack.children);
    if (!original.length) return;

    var SPEED = 45;
    var COPIES = 5;

    function buildHalf(hidden) {
      var frag = document.createDocumentFragment();
      for (var i = 0; i < COPIES; i++) {
        original.forEach(function (item) {
          var clone = item.cloneNode(true);
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
        var halfWidth = trustTrack.scrollWidth / 2;
        var duration = halfWidth / SPEED;
        trustTrack.style.animationDuration = duration.toFixed(2) + 's';

        trustTrack.addEventListener('mouseover', function (e) {
          if (e.target.closest('.trust-logo-item')) trustTrack.style.animationPlayState = 'paused';
        });
        trustTrack.addEventListener('mouseout', function (e) {
          if (e.target.closest('.trust-logo-item')) trustTrack.style.animationPlayState = 'running';
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
  }, 'trust track');

  /* ── FAQ accordion ────────────────────────────────────────────── */
  safe(function () {
    var faqAccordion = document.getElementById('faqAccordion');
    if (!faqAccordion) return;
    var faqQuestions = faqAccordion.querySelectorAll('.faq-question');

    faqQuestions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var answer = document.getElementById(btn.dataset.target);
        var isOpen = item.classList.contains('open');

        faqAccordion.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }, 'faq accordion');

  /* ── Powered By IC pulse animation ───────────────────────────── */
  safe(function () {
    var svg = document.getElementById('poweredSvg');
    var stage = document.getElementById('poweredStage');
    if (!svg || !stage) return;

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
    var pathData = [];

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
          pulse: pulse,
          pinEl: pinEl,
          portEl: portEl,
          len: len,
          DASH: DASH,
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
  }, 'powered IC pulse');

  /* ── Powered title word entrance ─────────────────────────────── */
  safe(function () {
    var titleEl = document.getElementById('poweredTitle');
    if (!titleEl) return;
    titleEl.querySelectorAll('.tw').forEach(function (word, i) {
      word.style.setProperty('--tw-delay', (.09 + i * .2) + 's');
    });
    var io = new IntersectionObserver(function (entries) {
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
  }, 'powered title');

  /* ── Pricing title word entrance ──────────────────────────────── */
  safe(function () {
    var pricingTitle = document.getElementById('pricingTitle');
    if (!pricingTitle) return;
    pricingTitle.querySelectorAll('.ptw').forEach(function (w, i) {
      w.style.setProperty('--ptw-delay', (0.04 + i * 0.1) + 's');
    });
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, {
      threshold: .35
    }).observe(pricingTitle);
  }, 'pricing title');

  /* ── Built-for (powered tabs) title entrance ─────────────────── */
  safe(function () {
    var ptTitleEl = document.getElementById('ptTitle');
    if (!ptTitleEl) return;
    ptTitleEl.querySelectorAll('.ptw').forEach(function (w, i) {
      w.style.setProperty('--ptw-delay', (0.04 + i * 0.1) + 's');
    });
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, {
      threshold: .35
    }).observe(ptTitleEl);
  }, 'built-for title');

  /* ── Dashboard carousel slider ────────────────────────────────── */
  safe(function () {
    var embTrack = document.getElementById('embTrack');
    var embNavEl = document.getElementById('embDotNav');
    var embWrap = document.getElementById('embWrap');
    if (!embTrack || !embNavEl) return;

    var embSlides = embTrack.querySelectorAll('.emb-slide');
    var embReal = embSlides.length;
    var embCur = 0;
    var embTimer;
    var embJumping = false;

    var firstClone = embSlides[0].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    embTrack.appendChild(firstClone);

    var embTextSlides = document.querySelectorAll('.emb-text-slide');

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

      var ri = embCur % embReal;
      embDots.forEach(function (d, i) {
        d.classList.toggle('active', i === ri);
      });
      embSyncText(ri);

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
        }, 570);
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
  }, 'dashboard carousel');

  /* ── Register — progressive multi-step form ──────────────────── */
  safe(function () {
    var rgForm = document.getElementById('rgForm');
    if (!rgForm) return;

    /* eye toggles (register) */
    document.querySelectorAll('.rg-eye').forEach(function (btn) {
      btn.addEventListener('mousedown', function (e) {
        e.preventDefault();
      });
      btn.addEventListener('click', function () {
        var inp = document.getElementById(btn.dataset.target);
        if (!inp) return;
        var isText = inp.type === 'text';
        inp.type = isText ? 'password' : 'text';
        btn.querySelector('i').className = isText ? 'bi bi-eye' : 'bi bi-eye-slash';
        var len = inp.value.length;
        inp.setSelectionRange(len, len);
        inp.focus();
      });
    });

    var curStep = 1;
    var panels = [null, document.getElementById('rgPanel1'), document.getElementById('rgPanel2'), document.getElementById('rgPanel3')];
    var headers = [null, document.getElementById('rgHeader1'), document.getElementById('rgHeader2'), document.getElementById('rgHeader3')];
    var stepItems = [null, document.getElementById('rgStepItem1'), document.getElementById('rgStepItem2'), document.getElementById('rgStepItem3')];
    var btnPrev = document.getElementById('rgPrev');
    var btnNext = document.getElementById('rgNext');
    var btnSubmit = document.getElementById('rgSubmit');
    var fillEl = document.getElementById('rgProgressFill');
    var fillMap = {
      1: '0%',
      2: '50%',
      3: '100%'
    };

    function goToStep(n) {
      panels[curStep].style.display = 'none';
      headers[curStep].style.display = 'none';

      if (n > curStep) {
        stepItems[curStep].classList.remove('active');
        stepItems[curStep].classList.add('done');
      } else {
        stepItems[curStep].classList.remove('active', 'done');
      }

      curStep = n;
      panels[curStep].style.display = 'block';
      headers[curStep].style.display = 'block';
      stepItems[curStep].classList.remove('done');
      stepItems[curStep].classList.add('active');

      for (var i = curStep + 1; i <= 3; i++) {
        stepItems[i].classList.remove('active', 'done');
      }

      fillEl.style.width = fillMap[curStep];
      btnPrev.style.display = curStep > 1 ? 'inline-flex' : 'none';
      btnNext.style.display = curStep < 3 ? 'inline-flex' : 'none';
      btnSubmit.style.display = curStep === 3 ? 'inline-flex' : 'none';

      if (curStep === 3) updateSubmit();
    }

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

    btnNext.addEventListener('click', function () {
      if (!validateStep(curStep)) return;
      goToStep(curStep + 1);
    });
    btnPrev.addEventListener('click', function () {
      goToStep(curStep - 1);
    });

    var pwGuide = document.getElementById('rgPwGuide');
    var pwInput = document.getElementById('rgPass');
    var pwBlurTimer;

    if (pwInput && pwGuide) {
      pwInput.addEventListener('focus', function () {
        clearTimeout(pwBlurTimer);
        pwGuide.classList.add('visible');
      });
      pwInput.addEventListener('blur', function () {
        pwBlurTimer = setTimeout(function () {
          pwGuide.classList.remove('visible');
        }, 180);
      });
    }

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

    if (pwInput) {
      pwInput.addEventListener('input', function () {
        var val = this.value;
        pwRules.forEach(function (r) {
          var el = document.getElementById(r.id);
          var pass = r.test(val);
          el.classList.toggle('pass', pass);
          el.querySelector('i').className = pass ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill';
        });
        updateSubmit();
        checkMatch();
      });
    }

    var pwInputC = document.getElementById('rgPassC');
    if (pwInputC) {
      pwInputC.addEventListener('input', function () {
        checkMatch();
        updateSubmit();
      });
    }

    function updateSubmit() {
      var p = document.getElementById('rgPass').value;
      var pc = document.getElementById('rgPassC').value;
      var ready = allRulesPass(p) && p === pc && p.length > 0;
      btnSubmit.disabled = !ready;

      var step3 = document.getElementById('rgStepItem3');
      if (ready) {
        step3.classList.add('done');
        step3.classList.remove('active');
      } else {
        step3.classList.remove('done');
        step3.classList.add('active');
      }
      document.getElementById('rgProgressFill').style.width = ready ? '100%' : '50%';
    }

    rgForm.addEventListener('submit', function (e) {
      e.preventDefault();
      /* handle form submission here */
    });

    goToStep(1);
  }, 'register form');

  /* ── Login form ───────────────────────────────────────────────── */
  safe(function () {
    var lnForm = document.getElementById('lnForm');
    if (!lnForm) return;

    document.querySelectorAll('.ln-eye').forEach(function (btn) {
      btn.addEventListener('mousedown', function (e) {
        e.preventDefault();
      });
      btn.addEventListener('click', function () {
        var inp = document.getElementById(btn.dataset.target);
        if (!inp) return;
        var isText = inp.type === 'text';
        inp.type = isText ? 'password' : 'text';
        btn.querySelector('i').className = isText ? 'bi bi-eye' : 'bi bi-eye-slash';
        var len = inp.value.length;
        inp.setSelectionRange(len, len);
        inp.focus();
      });
    });

    lnForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      function showErr(inputId, msgId, message) {
        var inp = document.getElementById(inputId);
        var msg = document.getElementById(msgId);
        inp.classList.add('ln-err');
        msg.textContent = message;
        msg.classList.add('visible');
        inp.addEventListener('input', function () {
          inp.classList.remove('ln-err');
          msg.classList.remove('visible');
        }, {
          once: true
        });
      }

      function clearErr(inputId, msgId) {
        document.getElementById(inputId).classList.remove('ln-err');
        document.getElementById(msgId).classList.remove('visible');
      }

      var emailVal = document.getElementById('lnEmail').value.trim();
      if (!emailVal) {
        showErr('lnEmail', 'lnEmailErr', 'Email address is required.');
        ok = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showErr('lnEmail', 'lnEmailErr', 'Please enter a valid email address.');
        ok = false;
      } else {
        clearErr('lnEmail', 'lnEmailErr');
      }

      var passVal = document.getElementById('lnPass').value;
      if (!passVal.trim()) {
        showErr('lnPass', 'lnPassErr', 'Password is required.');
        ok = false;
      } else {
        clearErr('lnPass', 'lnPassErr');
      }

      if (!ok) return;

      var btn = document.getElementById('lnBtn');
      btn.disabled = true;
      btn.innerHTML = '<i class="bi bi-arrow-repeat ln-spin"></i> Logging in…';

      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = 'Login';
      }, 1500);
    });
  }, 'login form');

  /* ── Built-for / Powered tabs (interactive panels) ────────────── */
  safe(function () {
    var ptTabRow = document.getElementById('ptTabRow');
    var ptStage = document.getElementById('ptStage');
    if (!ptTabRow || !ptStage) return;

    var tabs = Array.prototype.slice.call(ptTabRow.querySelectorAll('.pt-tab'));
    var panels = Array.prototype.slice.call(ptStage.querySelectorAll('.pt-panel'));
    var fills = tabs.map(function (t) {
      return t.querySelector('.pt-tab-progress-fill');
    });

    var AUTO_MS = 5000;
    var current = 0;
    var timer = null;
    var startTime = 0;
    var elapsedMs = 0;
    var isPaused = false;

    function runCountUp(panel) {
      var els = panel.querySelectorAll('[data-count], [data-decimal]');
      els.forEach(function (el) {
        var isDecimal = el.hasAttribute('data-decimal');
        var target = parseFloat(el.dataset.count || el.dataset.decimal);
        var suffix = el.dataset.suffix || '';
        var dur = 1100;
        var t0 = performance.now();

        function tick() {
          var p = Math.min((performance.now() - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = (isDecimal ? val.toFixed(2) : Math.round(val)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }

    function runRiskRing(panel) {
      var ring = panel.querySelector('#ptRiskFill');
      if (!ring) return;
      var circumference = 314;
      var score = 12;
      var pct = score / 100;
      var offset = circumference - (circumference * pct);
      ring.style.transition = 'none';
      ring.style.strokeDashoffset = circumference;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          ring.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)';
          ring.style.strokeDashoffset = offset;
        });
      });
    }

    function replayAnim(panel) {
      var animEls = panel.querySelectorAll('.pt-anim');
      animEls.forEach(function (el) {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });
    }

    function goTo(idx, userInitiated) {
      if (idx === current && !userInitiated) return;
      tabs[current].classList.remove('active');
      panels[current].classList.remove('active');
      current = idx;
      tabs[current].classList.add('active');
      panels[current].classList.add('active');
      replayAnim(panels[current]);
      runCountUp(panels[current]);
      runRiskRing(panels[current]);
      resetTimer();
    }

    function resetTimer() {
      clearTimeout(timer);
      elapsedMs = 0;
      isPaused = false;

      fills.forEach(function (f) {
        f.style.transition = 'none';
        f.style.width = '0%';
      });

      void fills[current].offsetWidth;
      startTime = performance.now();

      requestAnimationFrame(function () {
        fills[current].style.transition = 'width ' + AUTO_MS + 'ms linear';
        fills[current].style.width = '100%';
      });

      timer = setTimeout(function () {
        var next = (current + 1) % tabs.length;
        goTo(next, false);
      }, AUTO_MS);
    }

    function pauseTimer() {
      if (isPaused) return;
      isPaused = true;
      clearTimeout(timer);
      elapsedMs += performance.now() - startTime;
      var fill = fills[current];
      var computedWidth = getComputedStyle(fill).width;
      fill.style.transition = 'none';
      fill.style.width = computedWidth;
    }

    function resumeTimer() {
      if (!isPaused) return;
      isPaused = false;
      var remaining = Math.max(AUTO_MS - elapsedMs, 0);
      var fill = fills[current];
      startTime = performance.now();

      requestAnimationFrame(function () {
        fill.style.transition = 'width ' + remaining + 'ms linear';
        fill.style.width = '100%';
      });

      timer = setTimeout(function () {
        var next = (current + 1) % tabs.length;
        goTo(next, false);
      }, remaining);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        goTo(i, true);
      });
    });

    ptStage.addEventListener('mouseenter', pauseTimer);
    ptStage.addEventListener('mouseleave', resumeTimer);

    runCountUp(panels[0]);
    resetTimer();
  }, 'built-for tabs');

  // Developer Section

  var devNav = document.getElementById('devNav');
  if (!devNav) return; /* section not on this page */

  /* ── Render Feather icons (data-feather="..." -> inline svg) ─── */
  if (window.feather) {
    feather.replace();
  }

  /* ──────────────────────────────────────────────────────────────
     1. Build a reliable line-number gutter for every code block.
     ────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.dev-code-body').forEach(function (body) {
    var pres = body.querySelectorAll('pre');
    pres.forEach(function (pre) {
      if (pre.dataset.gutterBuilt) return;
      var code = pre.querySelector('code');
      if (!code) return;

      var text = code.textContent.replace(/\n$/, '');
      var lineCount = text.split('\n').length;

      var row = document.createElement('div');
      row.className = 'dev-code-row';

      if (pre.classList.contains('dev-pane')) {
        row.classList.add('dev-pane');
        pre.classList.remove('dev-pane');
      }
      if (pre.classList.contains('active')) {
        row.classList.add('active');
        pre.classList.remove('active');
      }
      if (pre.dataset.lang) {
        row.dataset.lang = pre.dataset.lang;
      }

      var gutter = document.createElement('div');
      gutter.className = 'dev-gutter';
      for (var i = 1; i <= lineCount; i++) {
        var span = document.createElement('span');
        span.textContent = i;
        gutter.appendChild(span);
      }

      pre.parentNode.insertBefore(row, pre);
      row.appendChild(gutter);
      row.appendChild(pre);
      pre.dataset.gutterBuilt = 'true';
    });
  });

  /* ──────────────────────────────────────────────────────────────
     2. Mobile / tablet off-canvas sidebar
     ────────────────────────────────────────────────────────────── */
  var sidebar = document.getElementById('devSidebar');
  var toggleBtn = document.getElementById('devSidebarToggle');
  var closeBtn = document.getElementById('devSidebarClose');
  var backdrop = document.getElementById('devSidebarBackdrop');

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  /* ──────────────────────────────────────────────────────────────
     3. Nav links — scrollspy + smooth scroll + auto-close on mobile
     ────────────────────────────────────────────────────────────── */
  var navLinks = Array.prototype.slice.call(devNav.querySelectorAll('.dev-nav-link'));
  var blocks = navLinks.map(function (link) {
    return document.getElementById(link.dataset.target);
  }).filter(Boolean);

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.dataset.target === id);
      });
    });
  }, {
    rootMargin: '-15% 0px -70% 0px',
    threshold: 0
  });

  blocks.forEach(function (block) {
    spyObserver.observe(block);
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.getElementById(link.dataset.target);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 24;
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
      if (window.innerWidth <= 991) closeSidebar();
    });
  });

  /* ──────────────────────────────────────────────────────────────
     4. Fade-in blocks on scroll
     ────────────────────────────────────────────────────────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08
  });

  blocks.forEach(function (block) {
    revealObserver.observe(block);
  });

  /* ──────────────────────────────────────────────────────────────
     5. Code language tabs (PHP / cURL)
     ────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.dev-code').forEach(function (codeBlock) {
    var tabs = codeBlock.querySelectorAll('.dev-code-tab');
    var panes = codeBlock.querySelectorAll('.dev-pane');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('active');
        });
        panes.forEach(function (p) {
          p.classList.remove('active');
        });
        tab.classList.add('active');
        var pane = codeBlock.querySelector('.dev-pane[data-lang="' + tab.dataset.lang + '"]');
        if (pane) pane.classList.add('active');
      });
    });
  });

  /* ──────────────────────────────────────────────────────────────
     6. Copy to clipboard
     ────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.dev-copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var codeBlock = btn.closest('.dev-code');
      var codeBody = codeBlock.querySelector('.dev-code-body');
      var activePane = codeBody.querySelector('.dev-pane.active') || codeBody.querySelector('.dev-code-row');
      var codeEl = activePane.querySelector('code');
      var text = codeEl ? codeEl.textContent : '';

      function done() {
        var original = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.innerHTML = original;
          btn.classList.remove('copied');
        }, 1600);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(text, done);
        });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {}
    document.body.removeChild(ta);
    cb();
  }



  // Documentation section 

  var lightbox = document.getElementById('devLightbox');
  if (!lightbox) return; /* page has no gallery */

  var imgEl = document.getElementById('devLightboxImg');
  var captionEl = document.getElementById('devLightboxCaption');
  var counterEl = document.getElementById('devLightboxCounter');
  var closeBtn = document.getElementById('devLightboxClose');
  var prevBtn = document.getElementById('devLightboxPrev');
  var nextBtn = document.getElementById('devLightboxNext');

  var currentGroup = [];
  var currentIndex = 0;

  function showAt(index) {
    if (!currentGroup.length) return;
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    var fig = currentGroup[currentIndex];
    var img = fig.querySelector('img');
    var cap = fig.querySelector('figcaption');

    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    captionEl.textContent = cap ? cap.textContent : '';

    var multi = currentGroup.length > 1;
    prevBtn.classList.toggle('hidden', !multi);
    nextBtn.classList.toggle('hidden', !multi);
    counterEl.textContent = multi ? (currentIndex + 1) + ' / ' + currentGroup.length : '';
  }

  function openLightbox(group, index) {
    currentGroup = group;
    showAt(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* open on any screenshot click — group = siblings within the
     same .dev-shots-grid, so prev/next stays scoped to that block */
  document.querySelectorAll('.dev-shots-grid').forEach(function (grid) {
    var figs = Array.prototype.slice.call(grid.querySelectorAll('.dev-shot'));
    figs.forEach(function (fig, i) {
      fig.addEventListener('click', function () {
        openLightbox(figs, i);
      });
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', function () {
    showAt(currentIndex - 1);
  });
  nextBtn.addEventListener('click', function () {
    showAt(currentIndex + 1);
  });

  /* click backdrop (outside image) to close */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* keyboard support */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
    if (e.key === 'ArrowRight') showAt(currentIndex + 1);
  });

}());