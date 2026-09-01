/* home.js — the "walking forward" corridor.

   Every project card is parked at a fixed depth along a Z axis. Scrolling
   moves a virtual camera down that axis; each frame we re-project the cards
   to `cameraZ - cardDepth` and let CSS perspective do the scaling. The camera
   chases the scroll position with a lerp, which is what makes the motion feel
   like walking rather than dragging. */
(function () {
  var U = window.SiteUtil;
  var scene = document.getElementById('scene');
  var corridor = document.getElementById('corridor');
  if (!scene || !corridor) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* The headline is set in a monospaced pixel face, so a longer name grows the
     line linearly and will happily run off the side of a phone. Rather than
     hand-tune the clamp() for one specific name, shrink to fit whatever is
     actually in the markup. */
  var heroTitle = document.querySelector('.hero__title');
  function fitHeroTitle() {
    if (!heroTitle) return;
    heroTitle.style.fontSize = '';
    // measure against the section, not the parent — the parent is sized by the
    // headline itself, so it can never report an overflow
    var host = document.getElementById('hero');
    if (!host) return;
    var cs = window.getComputedStyle(host);
    var avail = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    // the lines are nowrap blocks, so the h1 itself measures the widest line
    var widest = heroTitle.getBoundingClientRect().width;
    if (widest > avail && widest > 0) {
      var size = parseFloat(window.getComputedStyle(heroTitle).fontSize);
      heroTitle.style.fontSize = Math.floor(size * (avail / widest) * 0.99) + 'px';
    }
  }
  fitHeroTitle();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeroTitle);

  /* ---------------- build the scene ---------------- */
  function cardHTML(p, i) {
    var tags = (p.tags || []).map(function (t) {
      return '<span class="card__tag">' + U.esc(t) + '</span>';
    }).join('');

    /* A landscape cover fills the whole left panel; a phone screenshot goes in
       the phone mockup, same as the procedural fallback. */
    var c = p.cover ? U.media(p.cover) : null;
    var thumb =
      p.wide ? ''
      : c && c.frame !== 'phone'
        ? '<div class="card__thumb card__thumb--cover">' +
            '<img class="' + (c.fit === 'contain' ? 'is-contain' : 'is-cover') +
              (c.focus ? ' is-' + c.focus : '') + '" ' +
              'src="' + U.esc(c.src) + '" alt="" loading="lazy">' +
          '</div>'
      : '<div class="card__thumb"><div class="phone"><div class="phone__screen">' +
          (c ? '<img class="thumb" src="' + U.esc(c.src) + '" alt="" loading="lazy">'
             : U.thumbSVG(p, i)) +
        '</div></div></div>';

    return (
      '<a class="card' + (p.wide ? ' card--wide' : '') + '" href="' + U.href(p) + '" ' +
         'style="--accent:' + U.esc(p.accent || '#b06bff') + '">' +
        thumb +
        '<div class="card__body">' +
          '<span class="card__index">' + U.pad2(i + 1) + ' / ' + U.esc(p.period || '') + '</span>' +
          '<h3 class="card__title">' + U.esc(U.shortName(p)) + '</h3>' +
          '<p class="card__desc">' + U.esc(p.blurb) + '</p>' +
          '<span class="card__tags">' + tags + '</span>' +
        '</div>' +
        '<span class="card__arrow" aria-hidden="true">&#8599;</span>' +
      '</a>'
    );
  }

  var items = [];

  var titleEl = document.createElement('div');
  titleEl.className = 'depth-item depth-item--title';
  titleEl.innerHTML = '<h2 class="section-title">Some projects<b class="dot"></b></h2>';
  items.push({ el: titleEl, side: 0, order: -1 });

  window.PROJECTS.forEach(function (p, i) {
    var side = i % 2 === 0 ? -1 : 1;
    var wrap = document.createElement('div');
    wrap.className = 'depth-item depth-item--card' +
      (p.wide ? ' is-wide' : side < 0 ? ' is-left' : ' is-right');
    wrap.innerHTML = cardHTML(p, i);
    items.push({ el: wrap, side: p.wide ? 0 : side, order: i });
  });

  /* Paint order, not reading order: the browser does not reliably depth-sort
     opacity-composited layers inside a preserve-3d context, so the deepest
     card goes into the DOM first and the nearest one last. The static
     (reduced-motion) layout flips it back with `flex-direction: column-reverse`. */
  for (var n = items.length - 1; n >= 0; n--) scene.appendChild(items[n].el);

  /* ---------------- reduced motion: plain stacked list ---------------- */
  if (reduced) {
    document.body.classList.add('is-static');
    corridor.style.height = 'auto';
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.25 });
    items.forEach(function (it) { io.observe(it.el); });
    window.addEventListener('resize', fitHeroTitle);
    renderOutro();
    return;
  }

  /* ---------------- geometry ---------------- */
  var M;

  function metrics() {
    var w = window.innerWidth;
    var narrow = w < 860;
    var spacing = narrow ? 1550 : 1900;
    var titleDepth = narrow ? 800 : 950;
    return {
      narrow: narrow,
      // a full gap after the section title, or the title and the first card
      // sit on screen together and read as one muddy layer
      firstDepth: titleDepth + spacing,
      spacing: spacing,
      titleDepth: titleDepth,
      // no room to stagger sideways on a phone, and with no sideways offset
      // the yaw just reads as a wonky skew — so both go to zero together
      xoff: narrow ? 0 : Math.min(240, w * 0.135),
      tilt: narrow ? 0 : -7,
      yoff: narrow ? -10 : -18,
      /* Fade in from the far end, fade out as the card sweeps past the camera.
         The two windows are deliberately kept apart so the arriving card is
         still a faint speck while the previous one finishes leaving —
         that is what makes them read as arriving one at a time. */
      inNear: narrow ? -820 : -900,
      inFar: narrow ? -1750 : -1900,
      outStart: 40,
      outEnd: 420,
      speed: narrow ? 1.8 : 2.1,
      tail: 900
    };
  }

  var maxCam = 0;

  function layout() {
    M = metrics();
    items.forEach(function (it) {
      it.depth = it.order < 0 ? M.titleDepth : M.firstDepth + it.order * M.spacing;
    });
    maxCam = items[items.length - 1].depth + M.tail;
    corridor.style.height = Math.round(maxCam / M.speed + window.innerHeight) + 'px';
  }

  function smoothstep(a, b, x) {
    var t = (x - a) / (b - a);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  }

  function targetCam() {
    var top = corridor.getBoundingClientRect().top;
    var scrolled = -top;
    var max = corridor.offsetHeight - window.innerHeight;
    if (scrolled < 0) scrolled = 0;
    if (scrolled > max) scrolled = max;
    return scrolled * M.speed;
  }

  /* ---------------- per-frame projection ---------------- */
  function render(cam) {
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var z = cam - it.depth;
      var o = smoothstep(M.inFar, M.inNear, z) * (1 - smoothstep(M.outStart, M.outEnd, z));

      if (o <= 0.004) {
        if (it.visible !== false) {
          it.el.style.visibility = 'hidden';
          it.el.style.opacity = '0';
          it.visible = false;
        }
        continue;
      }
      if (it.visible === false || it.visible === undefined) {
        it.el.style.visibility = 'visible';
        it.visible = true;
      }

      it.el.style.opacity = o.toFixed(3);
      it.el.style.transform =
        'translate(-50%, -50%) translate3d(' + (it.side * M.xoff).toFixed(1) + 'px,' +
        (it.order < 0 ? -20 : it.side * M.yoff) + 'px,' + z.toFixed(1) + 'px) ' +
        'rotateY(' + (it.side * M.tilt) + 'deg)';

      /* Clickable for as long as you can actually see it. The old rule also
         demanded the card be close to the camera, so a card you could plainly
         read still ignored the cursor at both ends of its run. Letting every
         visible card take the pointer is safe: hit-testing follows paint
         order and paint order is depth order, so a far card can never steal a
         click from a nearer one. The floor keeps the last near-invisible
         ghost of a card that has already swept past you from catching a
         stray click, and the section title never takes the pointer at all —
         it has nothing to click, it would only block the card behind it. */
      var pe = (it.order >= 0 && o > 0.08) ? 'auto' : 'none';
      if (it.pe !== pe) {
        it.el.style.pointerEvents = pe;
        it.pe = pe;
      }
    }
  }

  /* ---------------- hero exit ---------------- */
  var hero = document.getElementById('hero');
  var heroStage = hero && hero.querySelector('.hero__stage');
  var heroMeta = hero && hero.querySelector('.hero__meta');
  var heroHint = hero && hero.querySelector('.hero__hint');
  var lastHeroP = -1;

  function renderHero() {
    if (!hero) return;
    var vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, window.pageYOffset / (vh * 0.9)));
    if (Math.abs(p - lastHeroP) < 0.002) return;
    lastHeroP = p;
    // the hero recedes as you step past it, so the corridor feels continuous
    if (heroStage) {
      heroStage.style.opacity = (1 - smoothstep(0.1, 0.85, p)).toFixed(3);
      heroStage.style.transform = 'translate3d(0,' + (-p * 70).toFixed(1) + 'px,' + (p * 420).toFixed(0) + 'px)';
    }
    if (heroMeta) {
      heroMeta.style.opacity = (1 - smoothstep(0.02, 0.5, p)).toFixed(3);
      heroMeta.style.transform = 'translateY(' + (-p * 40).toFixed(1) + 'px)';
    }
    if (heroHint) heroHint.style.opacity = (1 - smoothstep(0, 0.18, p)).toFixed(3);
  }

  /* ---------------- loop ---------------- */
  var cam = 0;
  var settled = false;

  function frame() {
    requestAnimationFrame(frame);
    renderHero();
    var t = targetCam();
    var d = t - cam;
    if (Math.abs(d) < 0.4) {
      if (settled) return;
      cam = t;
      settled = true;
    } else {
      cam += d * 0.085;
      settled = false;
    }
    render(cam);
  }

  function reset() {
    fitHeroTitle();
    layout();
    settled = false;
    cam = targetCam();
    render(cam);
    lastHeroP = -1;
    renderHero();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(reset, 120);
  });

  /* Tabbing to a card that is currently 40 metres down the corridor would be
     confusing, so jump the scroll position to wherever that card lives. */
  items.forEach(function (it) {
    var link = it.el.querySelector('a');
    if (!link) return;
    link.addEventListener('focus', function () {
      var z = cam - it.depth;
      if (z > -1200 && z < 200) return;
      var top = corridor.offsetTop + Math.round((it.depth - 320) / M.speed);
      window.scrollTo(0, Math.max(0, top));
    });
  });

  reset();
  requestAnimationFrame(frame);
  renderOutro();

  /* ---------------- outro links ---------------- */
  function renderOutro() {
    var host = document.getElementById('outroLinks');
    if (!host) return;
    var l = window.SITE.links || {};
    var rows = [
      { label: 'LinkedIn', url: l.linkedin },
      { label: 'GitHub', url: l.github }
    ];
    host.innerHTML = rows.map(function (r) {
      if (!r.url) {
        return '<span class="outro__link is-empty">' + r.label +
          '<em>add your link in assets/js/site.js</em></span>';
      }
      return '<a class="outro__link" href="' + U.esc(r.url) + '" target="_blank" rel="noopener">' +
        r.label + '<span class="outro__arrow" aria-hidden="true">&#8599;</span></a>';
    }).join('');
  }
})();
