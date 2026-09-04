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
      return '<div class="card__media">' + U.thumbSVG(p, i) + '</div>';
    }

    /* A phone screenshot is portrait and a card is landscape. Cropping one to
       fill leaves a stripe of an app nobody can read, so it stands in the frame
       at full height instead, like a device on a shelf. */
    if (c.frame === 'phone') {
      return '<div class="card__media card__media--tall">' +
        '<img src="' + U.esc(c.src) + '" alt="" loading="lazy">' +
      '</div>';
    }

    return '<div class="card__media">' +
      '<img class="' + (c.fit === 'contain' ? 'is-contain' : 'is-cover') +
        (c.focus ? ' is-' + c.focus : '') + '" ' +
        'src="' + U.esc(c.src) + '" alt="" loading="lazy">' +
    '</div>';
  }

  function cardHTML(p, i) {
    var kind = U.kindLabel(p);
    var tags = (kind ? '<span class="card__tag card__tag--kind">' + U.esc(kind) + '</span>' : '') +
      (p.tags || []).map(function (t) {
        return '<span class="card__tag">' + U.esc(t) + '</span>';
      }).join('');

    return (
      '<a class="card' + (p.wide ? ' card--wide' : '') + '" href="' + U.href(p) + '" ' +
         'style="--i:' + i + '">' +
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
