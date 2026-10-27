/**
 * main.js
 * Client-side script for Minz IT Central System landing page.
 */

(function () {
    'use strict';


    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll progress bar + active nav link
    var bar = document.querySelector('.progress');
    var links = document.querySelectorAll('.nav-link');
    var sections = Array.prototype.map.call(links, function (l) {
        return document.querySelector(l.getAttribute('href'));
    });
    var onScroll = function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar && max > 0) bar.style.transform = 'scaleX(' + (window.scrollY / max) + ')';
        var current = -1;
        sections.forEach(function (sec, i) {
            if (sec && sec.getBoundingClientRect().top < window.innerHeight * 0.4) current = i;
        });
        links.forEach(function (l, i) { l.classList.toggle('active', i === current); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Reveal on scroll
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduce) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        items.forEach(function (el, i) {
            el.style.transitionDelay = (i % 4) * 80 + 'ms';
            io.observe(el);
        });
    } else {
        items.forEach(function (el) { el.classList.add('in'); });
    }

    // Card spotlight follows cursor
    document.querySelectorAll('.feature').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    // Hero image tilt
    var visual = document.querySelector('.visual');
    var img = visual && visual.querySelector('img');
    if (img && !reduce) {
        visual.addEventListener('mousemove', function (e) {
            var r = visual.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            img.style.animation = 'none';
            img.style.transform = 'perspective(800px) rotateY(' + x * 12 + 'deg) rotateX(' + -y * 12 + 'deg)';
        });
        visual.addEventListener('mouseleave', function () {
            img.style.transform = '';
            img.style.animation = '';
        });
    }

    // Roadmap: click to expand
    document.querySelectorAll('.step').forEach(function (step) {
        var toggle = function () { step.classList.toggle('open'); };
        step.addEventListener('click', toggle);
        step.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });


    // Module cards: click to expand
    document.querySelectorAll('.feature').forEach(function (card) {
        var toggle = function () {
            var open = card.classList.toggle('open');
            card.setAttribute('aria-expanded', open);
        };
        card.addEventListener('click', toggle);
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });

    // Build progress: animate fill and counter
    var fill = document.querySelector('.build-progress-fill');
    var pct = document.querySelector('.build-progress-pct');
    if (fill && pct) {
        var target = +fill.dataset.target;
        if (reduce) {
            fill.style.transition = 'none';
            fill.style.width = target + '%';
            pct.textContent = target + '%';
        } else {
            setTimeout(function () { fill.style.width = target + '%'; }, 300);
            var start = null;
            var tick = function (t) {
                if (start === null) start = t;
                var p = Math.min((t - start - 300) / 1600, 1);
                if (p > 0) pct.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + '%';
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }
    }

    // Mobile nav
    var navBtn = document.querySelector('.nav-toggle');
    var nav = document.getElementById('nav');
    if (navBtn && nav) {
        var setNav = function (open) {
            nav.classList.toggle('open', open);
            navBtn.setAttribute('aria-expanded', open);
        };
        navBtn.addEventListener('click', function () {
            setNav(!nav.classList.contains('open'));
        });
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) setNav(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setNav(false);
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 760) setNav(false);
        });
    }

    // Button click ripple
    if (!reduce) {
        document.querySelectorAll('.contact-pill, .nav-cta, .footer-right a').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var r = btn.getBoundingClientRect();
                var size = Math.max(r.width, r.height);
                var dot = document.createElement('span');
                dot.className = 'ripple';
                dot.style.width = dot.style.height = size + 'px';
                dot.style.left = (e.clientX - r.left - size / 2) + 'px';
                dot.style.top = (e.clientY - r.top - size / 2) + 'px';
                btn.appendChild(dot);
                setTimeout(function () { dot.remove(); }, 600);
            });
        });
    }

    // Optional notification handlers if re-enabled in the future
    var goBtn = document.getElementById('go');
    var emailInput = document.getElementById('email');
    var note = document.getElementById('note');

    if (goBtn && emailInput && note) {
        var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var submit = function () {
            var isValid = EMAIL_RE.test(emailInput.value.trim());
            note.textContent = isValid
                ? 'Yay! I\u2019ll email you when I\u2019m ready.'
                : 'Please enter a valid email address.';
            if (isValid) emailInput.value = '';
        };

        goBtn.addEventListener('click', submit);
        emailInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') submit();
        });
    }
}());
