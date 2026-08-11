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
    return '<p>' + U.esc(par) + '</p>';
  }).join('');

  var highlights = (p.highlights || []).map(function (h) {
    return '<li>' + U.esc(h) + '</li>';
  }).join('');

  root.innerHTML =
    '<a class="proj__back" href="index.html"><span aria-hidden="true">&#8592;</span> Back to index</a>' +

    '<header class="proj__head">' +
      '<span class="proj__index">' + U.pad2(i + 1) + ' &mdash; ' + U.esc(p.year || '') + '</span>' +
      '<h1 class="proj__title">' + U.esc(p.title) + '<b class="dot"></b></h1>' +
      '<p class="proj__lede">' + U.esc(p.blurb) + '</p>' +
      (tags ? '<div class="proj__tags">' + tags + '</div>' : '') +
    '</header>' +

    '<div class="proj__screen">' +
      '<div class="phone"><div class="phone__screen">' + U.thumbSVG(p, i) + '</div></div>' +
    '</div>' +

    '<dl class="proj__facts">' +
      fact('Year', p.year) +
      fact('Role', p.role) +
      fact('Stack', p.stack) +
    '</dl>' +

    (body ? '<div class="proj__body">' + body + '</div>' : '') +

    (highlights
      ? '<h2 class="proj__sub">Highlights</h2><ul class="proj__highlights">' + highlights + '</ul>'
      : '') +

    '<nav class="proj__nav" aria-label="More projects">' +
      '<a href="' + U.href(prev) + '"><span class="lbl">Previous</span>' +
        '<span class="nm">' + U.esc(prev.title) + '</span></a>' +
      '<a href="' + U.href(next) + '"><span class="lbl">Next</span>' +
        '<span class="nm">' + U.esc(next.title) + '</span></a>' +
    '</nav>';
})();
