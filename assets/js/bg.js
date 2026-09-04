/* ------------------------------------------------------------------
   bg.js — the slow wave field that lives behind the glass.

   Everything on the page that reads as "glass" is a panel with a
   backdrop-filter over this canvas. If the canvas were static the glass
   would look like a flat texture; the drift is what makes it read as a
   material with something behind it. It is deliberately slow enough that
   you notice it only if you stop and look.
   ------------------------------------------------------------------ */
(function () {
  var canvas = document.getElementById('bgCanvas');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  /* The field is drawn at a fifth of the real pixel count and scaled back up
     by CSS. Nothing in it has a hard edge, so the upscale costs no visible
     quality — and it keeps a full-viewport animation off the GPU's critical
     path on a laptop. */
  var SCALE = 0.22;
  var FPS = 30;
  var w = 0;
  var h = 0;

  /* Four drifting pools of colour. Each rides its own pair of sine
     frequencies, so the group never repeats on a period anyone will catch. */
  var BLOBS = [
    { rgb: '167,139,250', r: 0.62, ax: 0.30, ay: 0.16, fx: 0.021, fy: 0.017, px: 0.0, py: 1.1, a: 0.16 },
    { rgb: '124, 92,232', r: 0.72, ax: 0.26, ay: 0.20, fx: 0.015, fy: 0.024, px: 2.2, py: 0.4, a: 0.13 },
    { rgb: '206,132,255', r: 0.46, ax: 0.34, ay: 0.14, fx: 0.027, fy: 0.019, px: 4.1, py: 3.0, a: 0.10 },
    { rgb: ' 82, 70,190', r: 0.84, ax: 0.20, ay: 0.22, fx: 0.012, fy: 0.014, px: 5.4, py: 1.8, a: 0.12 }
  ];

  /* Three ribbons crossing the lower half. They are what makes the motion read
     as waves rather than as a lava lamp. */
  var WAVES = [
    { base: 0.60, amp: 0.055, k: 2.1, speed: 0.16, phase: 0.0, rgb: '146,108,255', a: 0.085 },
    { base: 0.73, amp: 0.040, k: 3.0, speed: -0.11, phase: 1.7, rgb: '196,130,255', a: 0.055 },
    { base: 0.87, amp: 0.030, k: 1.6, speed: 0.09, phase: 3.4, rgb: '104, 84,220', a: 0.075 }
  ];

  function resize() {
    w = Math.max(140, Math.round(window.innerWidth * SCALE));
    h = Math.max(140, Math.round(window.innerHeight * SCALE));
    canvas.width = w;
    canvas.height = h;
  }

  function draw(t) {
    ctx.fillStyle = '#090514';
    ctx.fillRect(0, 0, w, h);

    /* Additive, so where two pools overlap the colour lifts instead of one
       painting over the other — the same way light pools do. */
    ctx.globalCompositeOperation = 'lighter';

    var span = Math.sqrt(w * w + h * h) * 0.5;
    var i;

    for (i = 0; i < BLOBS.length; i++) {
      var b = BLOBS[i];
      var x = (0.5 + b.ax * Math.sin(t * b.fx + b.px)) * w;
      var y = (0.5 + b.ay * Math.sin(t * b.fy + b.py)) * h;
      var r = b.r * span;
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(' + b.rgb + ',' + b.a + ')');
      g.addColorStop(1, 'rgba(' + b.rgb + ',0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    var step = Math.max(2, w / 64);
    for (i = 0; i < WAVES.length; i++) {
      var v = WAVES[i];
      var top = (v.base - v.amp) * h;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (var x2 = 0; x2 <= w + step; x2 += step) {
        var yy = (v.base + v.amp * Math.sin((x2 / w) * v.k * Math.PI * 2 + t * v.speed + v.phase)) * h;
        ctx.lineTo(x2, yy);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      var lg = ctx.createLinearGradient(0, top, 0, h);
      lg.addColorStop(0, 'rgba(' + v.rgb + ',' + v.a + ')');
      lg.addColorStop(1, 'rgba(' + v.rgb + ',0)');
      ctx.fillStyle = lg;
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
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

  function start() {
    if (!raf) raf = window.requestAnimationFrame(loop);
  }
  function stop() {
    if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
  }

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
