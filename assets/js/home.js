/* ------------------------------------------------------------------
   home.js — builds the project gallery.

   The old build flew these cards down a 3D corridor on scroll. This one
   is a plain grid: the browser lays it out, the page scrolls normally,
   and the only script left is the reveal and the card markup.
   ------------------------------------------------------------------ */
(function () {
  var U = window.SiteUtil;
  var grid = document.getElementById('grid');
  if (!grid) return;

  function coverHTML(p, i) {
    var c = p.cover ? U.media(p.cover) : null;

    if (!c || !c.src) {
      return '<div class="card__media">' + U.thumbSVG(p, i) + chip(p) + '</div>';
    }

    /* A phone screenshot is portrait and a card is landscape. Cropping one to
       fill leaves a stripe of an app nobody can read, so it stands in the frame
       at full height instead, like a device on a shelf. */
    if (c.frame === 'phone') {
      return '<div class="card__media card__media--tall">' +
        '<img src="' + U.esc(c.src) + '" alt="" loading="lazy">' +
        chip(p) +
      '</div>';
    }

    return '<div class="card__media">' +
      '<img class="' + (c.fit === 'contain' ? 'is-contain' : 'is-cover') +
        (c.focus ? ' is-' + c.focus : '') + '" ' +
        'src="' + U.esc(c.src) + '" alt="" loading="lazy">' +
      chip(p) +
    '</div>';
  }

  /* Sits over the bottom-left of the media. It has to be inside that box: the
     card is the positioned ancestor, so as a sibling it anchored to the bottom
     of the whole card and landed on the tag row. */
  function chip(p) {
    var kind = U.kindLabel(p);
    return kind ? '<span class="card__kind"><i></i>' + U.esc(kind) + '</span>' : '';
  }

  function cardHTML(p, i) {
    var tags = (p.tags || []).map(function (t) {
      return '<span class="card__tag">' + U.esc(t) + '</span>';
    }).join('');

    return (
      '<a class="card' + (p.wide ? ' card--wide' : '') + '" href="' + U.href(p) + '" ' +
         'style="--accent:' + U.esc(p.accent || '#a78bfa') + ';--i:' + i + '">' +
        coverHTML(p, i) +
        '<div class="card__body">' +
          '<div class="card__meta">' +
            '<b>' + U.pad2(i + 1) + '</b><s></s>' +
            '<span>' + U.esc(p.period || '') + '</span>' +
          '</div>' +
          '<h3 class="card__title">' + U.esc(U.shortName(p)) + '</h3>' +
          '<p class="card__blurb">' + U.esc(p.blurb) + '</p>' +
          (tags ? '<div class="card__tags">' + tags + '</div>' : '') +
        '</div>' +
        '<span class="card__go">' + U.icon('arrowUpRight') + '</span>' +
      '</a>'
    );
  }

  grid.innerHTML = window.PROJECTS.map(cardHTML).join('');

  var count = document.getElementById('workCount');
  if (count) {
    count.textContent = U.pad2(window.PROJECTS.length) + ' projects';
  }

  /* ---------------- the stack cloud ----------------

     Every distinct tool across the six projects, drifting beside the headline
     and breathing in and out of focus. Placement is seeded, not random: the
     field is part of the layout, and a version that reshuffled on every load
     would be a different page each visit. */

  var cloud = document.getElementById('cloud');
  if (cloud) buildCloud(cloud);

  function buildCloud(host) {
    var terms = [];
    var seen = {};
    window.PROJECTS.forEach(function (p) {
      (p.stack || '').split(',').forEach(function (raw) {
        var t = raw.trim();
        var key = t.toLowerCase();
        if (t && !seen[key]) { seen[key] = 1; terms.push(t); }
      });
    });
    if (!terms.length) return;

    var seed = 20260904;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    /* Jittered grid rather than free placement. Purely random positions put
       "Meta Quest 3" straight through "OpenAI API"; one term per cell, shaken
       around inside it, keeps the scatter without the collisions. */
    var COLS = 3;
    var ROWS = Math.ceil(terms.length / COLS);

    /* Each word is two stacked copies of itself, one sharp and one already
       blurred, and coming into focus is a cross-fade between them. Animating
       `filter: blur()` directly would re-rasterise every word on every frame;
       opacity is a compositor job and costs nothing. */
    host.innerHTML = terms.map(function (t, n) {
      var col = n % COLS;
      var row = (n / COLS) | 0;
      var x = (((col + 0.18 + rnd() * 0.64) / COLS) * 100).toFixed(2);
      var y = (((row + 0.15 + rnd() * 0.70) / ROWS) * 100).toFixed(2);
      var e = U.esc(t);
      return '<span class="cloud__w" style="left:' + x + '%;top:' + y + '%">' +
          '<b class="cloud__sharp">' + e + '</b>' +
          '<b class="cloud__soft">' + e + '</b>' +
        '</span>';
    }).join('');

    var words = [].slice.call(host.querySelectorAll('.cloud__w')).map(function (el) {
      return {
        el: el,
        sharp: el.querySelector('.cloud__sharp'),
        soft: el.querySelector('.cloud__soft'),
        /* Every word keeps its own periods and phase, so the field never
           pulses in unison — that would read as a blinking page, not depth.
           The slowest focus cycle is about a minute, the fastest about
           twenty-five seconds. */
        fz: 0.10 + rnd() * 0.16, phz: rnd() * 6.283,
        fx: 0.05 + rnd() * 0.07, phx: rnd() * 6.283,
        fy: 0.04 + rnd() * 0.07, phy: rnd() * 6.283,
        ax: 8 + rnd() * 12,
        ay: 6 + rnd() * 10
      };
    });

    function frame(t) {
      for (var i = 0; i < words.length; i++) {
        var w = words[i];
        var z = 0.5 + 0.5 * Math.sin(t * w.fz + w.phz);      // 0 far, 1 near
        var dx = w.ax * Math.sin(t * w.fx + w.phx);
        var dy = w.ay * Math.sin(t * w.fy + w.phy);
        var bright = 0.09 + z * 0.42;
        w.el.style.transform =
          'translate(-50%,-50%) translate(' + dx.toFixed(2) + 'px,' +
          dy.toFixed(2) + 'px) scale(' + (0.82 + z * 0.5).toFixed(3) + ')';
        w.sharp.style.opacity = (bright * z).toFixed(3);
        w.soft.style.opacity = (bright * (1 - z)).toFixed(3);
      }
    }

    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (still && still.matches) {
      frame(0);
      return;
    }

    var visible = true;
    var raf = 0;
    var last = 0;
    /* 20fps, not 60. The fastest word drifts at about 2.4px a second, so even
       here it moves a tenth of a pixel between frames — the motion is really a
       slow cross-fade, and three times the frames would buy nothing visible.
       (The cloud's own arithmetic is 0.04ms a frame; the cost is compositing
       two dozen text layers, so the way to spend less is to do it less often.) */
    var FRAME = 1000 / 20;

    function loop(now) {
      raf = window.requestAnimationFrame(loop);
      if (now - last < FRAME) return;
      last = now;
      frame(now / 1000);
    }
    function start() {
      if (!raf && visible && !document.hidden) raf = window.requestAnimationFrame(loop);
    }
    function stop() {
      if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    /* Scrolled past the hero this is a couple of dozen elements being
       restyled for nobody, so it stops until the cloud is on screen again. */
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0 }).observe(host);
    }

    frame(0);
    start();
  }

  /* ---------------- reveal on scroll ---------------- */

  var cards = [].slice.call(grid.querySelectorAll('.card'));

  if (!window.IntersectionObserver) {
    cards.forEach(function (c) { c.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);   // it only ever needs to arrive once
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  cards.forEach(function (c) { io.observe(c); });
})();
