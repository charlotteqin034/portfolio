/* ------------------------------------------------------------------
   nav.js — the shared page chrome: the sticky bar's scrolled state, the
   back-to-top button, and the social links, which both pages read from
   SITE.links so there is one place to change them.
   ------------------------------------------------------------------ */
(function () {
  var U = window.SiteUtil;
  var body = document.body;

  /* ---------------- social links ---------------- */

  var links = (window.SITE && window.SITE.links) || {};

  [].slice.call(document.querySelectorAll('[data-social]')).forEach(function (host) {
    var out = '';
    if (links.linkedin) {
      out += '<a class="' + host.getAttribute('data-social') + '" href="' + U.esc(links.linkedin) +
        '" target="_blank" rel="noopener" aria-label="LinkedIn">' + U.icon('linkedin') + '</a>';
    }
    if (links.github) {
      out += '<a class="' + host.getAttribute('data-social') + '" href="' + U.esc(links.github) +
        '" target="_blank" rel="noopener" aria-label="GitHub">' + U.icon('github') + '</a>';
    }
    host.innerHTML = out;
  });

  [].slice.call(document.querySelectorAll('[data-href="linkedin"]')).forEach(function (a) {
    if (links.linkedin) a.setAttribute('href', links.linkedin);
    else a.remove();
  });

  /* ---------------- scrolled state ---------------- */

  /* Drives both the rule under the sticky bar and the back-to-top button, so
     they can never disagree about whether the page has moved. */
  var scrolled = false;
  function onScroll() {
    var now = window.pageYOffset > 120;
    if (now === scrolled) return;
    scrolled = now;
    body.classList.toggle('is-scrolled', now);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var top = document.getElementById('toTop');
  if (top) {
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- footer year ---------------- */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
