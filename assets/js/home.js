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

     Every distinct tool across the six projects, scattered beside the
     headline. Placement is seeded, not random: the field is part of the
     layout, and a version that reshuffled on every load would be a
     different page each visit. */

  var cloud = document.getElementById('cloud');
  if (cloud) {
    var terms = [];
    var seen = {};
    window.PROJECTS.forEach(function (p) {
      (p.stack || '').split(',').forEach(function (raw) {
        var t = raw.trim();
        var key = t.toLowerCase();
        if (t && !seen[key]) { seen[key] = 1; terms.push(t); }
      });
    });

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

    cloud.innerHTML = terms.map(function (t, n) {
      /* z is depth: the near ones are bigger, brighter and sharp, the far
         ones small, dim and slightly out of focus. */
      var z = rnd();
      var size = (9.5 + z * 6).toFixed(1);
      var op = (0.10 + z * 0.40).toFixed(2);
      var blur = ((1 - z) * 1.5).toFixed(2);
      var col = n % COLS;
      var row = (n / COLS) | 0;
      var x = (((col + 0.18 + rnd() * 0.64) / COLS) * 100).toFixed(2);
      var y = (((row + 0.15 + rnd() * 0.70) / ROWS) * 100).toFixed(2);
      return '<span style="left:' + x + '%;top:' + y + '%;font-size:' + size +
        'px;opacity:' + op + ';filter:blur(' + blur + 'px)">' + U.esc(t) + '</span>';
    }).join('');
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
