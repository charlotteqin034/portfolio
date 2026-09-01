/* project.js — renders project.html from ?p=<slug>. */
(function () {
  var U = window.SiteUtil;
  var root = document.getElementById('proj');
  if (!root) return;

  var slug = '';
  var m = /[?&]p=([^&]*)/.exec(window.location.search);
  if (m) {
    try { slug = decodeURIComponent(m[1].replace(/\+/g, ' ')); } catch (e) { slug = m[1]; }
  }

  var found = U.bySlug(slug);

  if (!found) {
    document.title = 'Not found — ' + window.SITE.name;
    root.innerHTML =
      '<a class="proj__back" href="index.html"><span aria-hidden="true">&#8592;</span> Back to index</a>' +
      '<div class="proj__missing">' +
        '<h1 class="proj__title">Nothing here<b class="dot"></b></h1>' +
        '<p>That project does not exist &mdash; it may have been renamed. ' +
        'Everything that does exist is in the menu, top left.</p>' +
      '</div>';
    return;
  }

  var p = found.project;
  var i = found.index;
  var all = window.PROJECTS;
  var prev = all[(i - 1 + all.length) % all.length];
  var next = all[(i + 1) % all.length];

  document.title = p.title + ' — ' + window.SITE.name;
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', p.blurb || '');

  var side = document.getElementById('sidebar');
  if (side) side.setAttribute('data-active', p.slug);

  document.documentElement.style.setProperty('--accent', p.accent || '#b06bff');

  function fact(label, value) {
    if (!value) return '';
    return '<div><dt>' + U.esc(label) + '</dt><dd>' + U.esc(value) + '</dd></div>';
  }

  var tags = (p.tags || []).map(function (t) {
    return '<span>' + U.esc(t) + '</span>';
  }).join('');

  var body = (p.body || []).map(function (par) {
    return '<p>' + U.richText(par) + '</p>';
  }).join('');

  var links = (p.links || []).map(function (l) {
    return '<a class="proj__link" href="' + U.esc(l.url) + '" target="_blank" rel="noopener">' +
      U.esc(l.label) + '<span class="ico" aria-hidden="true">&#8599;</span></a>';
  }).join('');

  /* Everything the project has to show lives in one gallery: the cover leads
     it, the rest follow in order. The cover keeps its own field because the
     corridor card needs to know which image represents the project. */
  var shots = (p.cover && !p.coverCardOnly ? [p.cover] : []).concat(p.media || []);

  var items = shots.map(U.media).filter(function (m) { return m.src; });

  /* Two layouts. Phone screenshots are small enough to sit side by side, so a
     set of them stays a grid you take in at a glance. Anything bigger — a
     landscape still, a clip — gets a carousel instead: one at a time, full
     size, clicked through. `gallery: 'grid' | 'carousel'` overrides. */
  var everyOneAPhone = items.length > 0 && items.every(function (m) {
    return m.frame === 'phone';
  });
  var mode = p.gallery || (items.length > 1 && !everyOneAPhone ? 'carousel' : 'grid');

  function mediaEl(m) {
    var el = m.kind === 'video'
      ? '<video src="' + U.esc(m.src) + '" controls playsinline preload="metadata"' +
        (m.poster ? ' poster="' + U.esc(m.poster) + '"' : '') + '></video>'
      : '<img src="' + U.esc(m.src) + '" alt="' + U.esc(m.caption) + '" loading="lazy">';
    return m.frame === 'phone'
      ? '<div class="phone"><div class="phone__screen">' + el + '</div></div>'
      : el;
  }

  function gridHTML() {
    return '<div class="proj__gallery">' + items.map(function (m, n) {
      // the lead item and every clip take the full width; phone shots pair off
      var wide = m.frame !== 'phone' && (n === 0 || m.kind === 'video')
        ? ' proj__shot--wide' : '';
      return '<figure class="proj__shot' + wide + '">' + mediaEl(m) +
        (m.caption ? '<figcaption>' + U.esc(m.caption) + '</figcaption>' : '') +
        '</figure>';
    }).join('') + '</div>';
  }

  function carouselHTML() {
    /* The caption lives under the stage, not over the picture: these are
       screenshots, and a scrim across the bottom of one covers the very UI it
       is meant to be showing. */
    var slides = items.map(function (m, n) {
      return '<figure class="gal__slide' + (n === 0 ? ' is-current' : '') + '"' +
        ' data-caption="' + U.esc(m.caption) + '"' +
        (n === 0 ? '' : ' aria-hidden="true"') + '>' + mediaEl(m) + '</figure>';
    }).join('');

    var dots = items.map(function (m, n) {
      return '<button type="button" class="gal__dot' + (n === 0 ? ' is-current' : '') +
        '" data-go="' + n + '" aria-label="Show item ' + (n + 1) + '"' +
        (n === 0 ? ' aria-current="true"' : '') + '></button>';
    }).join('');

    return '<div class="gal" data-gallery aria-roledescription="carousel">' +
      '<div class="gal__stage">' + slides + '</div>' +
      '<div class="gal__bar">' +
        '<button type="button" class="gal__nav gal__nav--prev" data-step="-1" ' +
          'aria-label="Previous"><span aria-hidden="true"></span></button>' +
        '<span class="gal__count">' + U.pad2(1) + ' / ' + U.pad2(items.length) + '</span>' +
        '<div class="gal__dots">' + dots + '</div>' +
        '<button type="button" class="gal__nav gal__nav--next" data-step="1" ' +
          'aria-label="Next"><span aria-hidden="true"></span></button>' +
      '</div>' +
      '<p class="gal__caption">' + U.esc(items[0].caption) + '</p>' +
    '</div>';
  }

  var gallery = !items.length ? ''
    : mode === 'carousel' ? carouselHTML() : gridHTML();

  var highlights = (p.highlights || []).map(function (h) {
    return '<li>' + U.esc(h) + '</li>';
  }).join('');

  root.innerHTML =
    '<a class="proj__back" href="index.html"><span aria-hidden="true">&#8592;</span> Back to index</a>' +

    '<header class="proj__head">' +
      '<span class="proj__index">' + U.pad2(i + 1) + ' / ' + U.esc(p.period || '') + '</span>' +
      '<h1 class="proj__title">' + U.esc(U.shortName(p)) + '<b class="dot"></b></h1>' +
      (p.shortTitle && p.shortTitle !== p.title
        ? '<p class="proj__fullname">' + U.esc(p.title) + '</p>' : '') +
      '<p class="proj__lede">' + U.esc(p.blurb) + '</p>' +
      (tags ? '<div class="proj__tags">' + tags + '</div>' : '') +
    '</header>' +

    (gallery
      ? gallery
      : '<div class="proj__screen">' +
          '<div class="phone"><div class="phone__screen">' + U.thumbSVG(p, i) + '</div></div>' +
        '</div>') +

    '<dl class="proj__facts">' +
      fact('Period', p.period) +
      fact('Role', p.role) +
      fact('Team', p.team) +
      fact('Stack', p.stack) +
    '</dl>' +

    (links ? '<div class="proj__links">' + links + '</div>' : '') +

    (body ? '<div class="proj__body">' + body + '</div>' : '') +

    (highlights
      ? '<h2 class="proj__sub">Highlights</h2><ul class="proj__highlights">' + highlights + '</ul>'
      : '') +

    '<nav class="proj__nav" aria-label="More projects">' +
      '<a href="' + U.href(prev) + '"><span class="lbl">Previous</span>' +
        '<span class="nm">' + U.esc(U.shortName(prev)) + '</span></a>' +
      '<a href="' + U.href(next) + '"><span class="lbl">Next</span>' +
        '<span class="nm">' + U.esc(U.shortName(next)) + '</span></a>' +
    '</nav>';

  wireCarousel(root.querySelector('[data-gallery]'));

  /* ---------------- carousel ---------------- */
  function wireCarousel(gal) {
    if (!gal) return;

    var slides = [].slice.call(gal.querySelectorAll('.gal__slide'));
    var dots = [].slice.call(gal.querySelectorAll('.gal__dot'));
    var count = gal.querySelector('.gal__count');
    var caption = gal.querySelector('.gal__caption');
    var at = 0;

    function show(n) {
      n = (n % slides.length + slides.length) % slides.length;   // wrap both ways
      if (n === at) return;
      slides[at].classList.remove('is-current');
      slides[at].setAttribute('aria-hidden', 'true');
      // a clip left behind should not keep playing under the next slide
      var playing = slides[at].querySelector('video');
      if (playing) playing.pause();
      dots[at].classList.remove('is-current');
      dots[at].removeAttribute('aria-current');

      at = n;
      slides[at].classList.add('is-current');
      slides[at].removeAttribute('aria-hidden');
      dots[at].classList.add('is-current');
      dots[at].setAttribute('aria-current', 'true');
      if (count) count.textContent = U.pad2(at + 1) + ' / ' + U.pad2(slides.length);
      if (caption) caption.textContent = slides[at].getAttribute('data-caption') || '';
    }

    gal.addEventListener('click', function (e) {
      var step = e.target.closest('[data-step]');
      if (step) return show(at + parseInt(step.getAttribute('data-step'), 10));
      var go = e.target.closest('[data-go]');
      if (go) return show(parseInt(go.getAttribute('data-go'), 10));
      // clicking the picture advances; clicking a video would fight its controls
      var slide = e.target.closest('.gal__slide');
      if (slide && slide.classList.contains('is-current') && e.target.tagName !== 'VIDEO') {
        show(at + 1);
      }
    });

    gal.setAttribute('tabindex', '0');
    gal.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
    });
  }
})();
