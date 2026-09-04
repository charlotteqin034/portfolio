/* ------------------------------------------------------------------
   bg.js — the smoke field behind the glass.

   Drifting pools of colour read as a lava lamp. Smoke needs noise that
   folds back through itself, so this is value-noise fBm with one domain
   warp: the field is sampled at a position that is itself displaced by
   the field. That fold is what makes the wisps curl instead of blob.

   It is drawn into a buffer about a tenth of the viewport's pixel count
   and blurred back up by CSS. At that size the whole thing costs a few
   hundred thousand noise samples a second, and nothing in it has an edge
   sharp enough to miss the resolution.
   ------------------------------------------------------------------ */
(function () {
  var canvas = document.getElementById('bgCanvas');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  var FPS = 20;
  var OCTAVES = 3;

  /* Dark purple ground, muted violet smoke. The gap between them is the
     whole palette — anything brighter stops being a background. */
  var BASE = [10, 6, 22];
  var WISP = [86, 72, 150];

  /* ---------------- value noise ---------------- */

  /* Shuffled with a fixed seed so the field is identical on every load and
     on every machine: it is part of the design, not a random each time. */
  var PERM = new Uint8Array(512);
  (function () {
    var p = new Uint8Array(256);
    var i, j, t;
    for (i = 0; i < 256; i++) p[i] = i;
    var s = 1337;
    for (i = 255; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0;
      j = (s / 4294967296) * (i + 1) | 0;
      t = p[i]; p[i] = p[j]; p[j] = t;
    }
    for (i = 0; i < 512; i++) PERM[i] = p[i & 255];
  })();

  function noise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y);
    var xf = x - xi, yf = y - yi;
    // quintic fade: smooth enough that the lattice never shows through
    var u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    var v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    xi &= 255; yi &= 255;
    var a = PERM[xi] + yi, b = PERM[xi + 1] + yi;
    var aa = PERM[a] / 255, ba = PERM[b] / 255;
    var ab = PERM[a + 1] / 255, bb = PERM[b + 1] / 255;
    var x1 = aa + u * (ba - aa);
    var x2 = ab + u * (bb - ab);
    return x1 + v * (x2 - x1);
  }

  function fbm(x, y) {
    var v = 0, a = 0.5, i;
    for (i = 0; i < OCTAVES; i++) {
      v += a * noise(x, y);
      // 2.03 rather than an exact 2: doubling lines the octaves up on the same
      // lattice points and stripes the field
      x *= 2.03; y *= 2.03; a *= 0.5;
    }
    return v;
  }

  /* ---------------- render ---------------- */

  var w = 0, h = 0, img = null, buf = null;

  function resize() {
    w = Math.max(96, Math.min(240, Math.round(window.innerWidth * 0.11)));
    h = Math.max(64, Math.round(w * (window.innerHeight / window.innerWidth)));
    canvas.width = w;
    canvas.height = h;
    img = ctx.createImageData(w, h);
    buf = img.data;
    for (var i = 3; i < buf.length; i += 4) buf[i] = 255;   // opaque, once
  }

  function draw(t) {
    var scale = 2.6 / w;          // ~2.6 noise cells across, whatever the width
    var i = 0;

    for (var py = 0; py < h; py++) {
      var ny = py * scale;
      /* Vertical falloff: the top of the page carries the headline, and smoke
         behind type is just a contrast problem. It gathers toward the bottom. */
      var band = 0.30 + 0.70 * (py / h);
      for (var px = 0; px < w; px++) {
        var nx = px * scale;

        // the warp: sample the field at a point the field itself displaces
        var q = fbm(nx + t * 0.012, ny - t * 0.008);
        var f = fbm(nx + 2.4 * q, ny + 2.4 * q + t * 0.010);

        /* Cubed, off a high threshold. Squared off a low one lit most of the
           frame and the "background" became a lavender wash — the wisps only
           read as smoke if the space between them is genuinely dark. */
        var n = (f - 0.36) * 2.3;
        if (n < 0) n = 0; else if (n > 1) n = 1;
        n = n * n * n * band;

        buf[i]     = BASE[0] + (WISP[0] - BASE[0]) * n;
        buf[i + 1] = BASE[1] + (WISP[1] - BASE[1]) * n;
        buf[i + 2] = BASE[2] + (WISP[2] - BASE[2]) * n;
        i += 4;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  resize();

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (still && still.matches) {
    draw(0);
    window.addEventListener('resize', function () { resize(); draw(0); });
    return;
  }

  var last = 0;
  var frame = 1000 / FPS;
  var raf = 0;

  function loop(now) {
    raf = window.requestAnimationFrame(loop);
    if (now - last < frame) return;
    last = now;
    draw(now / 1000);
  }

  function start() { if (!raf) raf = window.requestAnimationFrame(loop); }
  function stop() { if (raf) { window.cancelAnimationFrame(raf); raf = 0; } }

  /* A background animation nobody is looking at is pure battery drain. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  var pending = 0;
  window.addEventListener('resize', function () {
    window.clearTimeout(pending);
    pending = window.setTimeout(function () { resize(); draw(last / 1000); }, 150);
  });

  draw(0);
  start();
})();
