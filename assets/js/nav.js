/* Shared page chrome: the sidebar drawer behind the top-left menu button,
   plus the little clock in the top-right corner. */
(function () {
  var U = window.SiteUtil;
  var body = document.body;
  var btn = document.getElementById('menuBtn');
  var scrim = document.getElementById('scrim');
  var drawer = document.getElementById('sidebar');
  if (!btn || !drawer || !scrim) return;

  var activeSlug = drawer.getAttribute('data-active') || '';
  var lastFocused = null;

  /* ---------- build the drawer from the project data ---------- */
  function socialRow() {
    var l = window.SITE.links || {};
    var out = '';
    if (l.linkedin) out += '<a class="sidebar__social" href="' + U.esc(l.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>';
    if (l.github) out += '<a class="sidebar__social" href="' + U.esc(l.github) + '" target="_blank" rel="noopener">GitHub</a>';
    if (!out) out = '<span class="sidebar__social is-empty">links coming soon</span>';
    return out;
  }

  var items = window.PROJECTS.map(function (p, i) {
    var current = p.slug === activeSlug;
    return (
      '<li class="sidebar__item' + (current ? ' is-current' : '') + '" style="--i:' + i + '">' +
        '<a class="sidebar__link" href="' + U.href(p) + '"' + (current ? ' aria-current="page"' : '') + '>' +
          '<span class="sidebar__num">' + U.pad2(i + 1) + '</span>' +
          '<span class="sidebar__name">' + U.esc(p.title) + '</span>' +
          '<span class="sidebar__arrow" aria-hidden="true">&#8599;</span>' +
        '</a>' +
      '</li>'
    );
  }).join('');

  drawer.innerHTML =
    '<div class="sidebar__inner">' +
      '<div class="sidebar__head"><span class="sidebar__eyebrow">Index</span></div>' +
      '<a class="sidebar__home" href="index.html">' +
        '<span class="sidebar__num">00</span><span class="sidebar__name">Home</span>' +
      '</a>' +
      '<ul class="sidebar__list">' + items + '</ul>' +
      '<div class="sidebar__foot">' +
        '<span class="sidebar__eyebrow">Elsewhere</span>' +
        '<div class="sidebar__socials">' + socialRow() + '</div>' +
      '</div>' +
    '</div>';

  /* ---------- open / close ---------- */
  /* The toggle lives outside the drawer but is the only close affordance
     besides Esc, so it has to be inside the tab ring. */
  function focusables() {
    return [btn].concat(
      Array.prototype.slice.call(drawer.querySelectorAll('a[href], button:not([disabled])'))
    );
  }

  function open() {
    if (body.classList.contains('menu-open')) return;
    lastFocused = document.activeElement;
    body.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
    drawer.removeAttribute('aria-hidden');
    var first = drawer.querySelector('a[href]');
    if (first) first.focus();
  }

  function close() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  btn.addEventListener('click', function () {
    if (body.classList.contains('menu-open')) close();
    else open();
  });
  scrim.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (!body.classList.contains('menu-open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ---------- top-right clock ---------- */
  var clock = document.getElementById('clock');
  if (clock) {
    var offset = -new Date().getTimezoneOffset() / 60;
    var zone = 'GMT' + (offset >= 0 ? '+' : '-') + Math.abs(offset);
    var tick = function () {
      var d = new Date();
      clock.textContent = U.pad2(d.getHours()) + ':' + U.pad2(d.getMinutes()) + ' ' + zone;
    };
    tick();
    setInterval(tick, 15000);
  }
})();
