/* ------------------------------------------------------------------
   site.js — the only file you need to edit to change content.
   Loaded by every page as a plain script (no modules, so file:// works).
   ------------------------------------------------------------------ */

window.SITE = {
  name: 'Charlotte',

  // Drop your real URLs in here — the footer and the sidebar both read them.
  // Leave a string empty and it renders as a muted "coming soon" placeholder.
  links: {
    linkedin: '',
    github: ''
  }
};

/* Hero headline, the "Based in ___" line and the two lines under the hero
   live directly in index.html so they paint instantly — search for
   "EDIT ME" in that file. */

/* Dummy projects. Everything below is placeholder copy — swap the strings,
   keep the shape. `slug` is what shows up in the URL (project.html?p=slug).
   `wide: true` renders the full-width, no-thumbnail card variant. */
window.PROJECTS = [
  {
    slug: 'aurora-engine',
    title: 'Aurora Engine',
    blurb: 'Placeholder project. A short line about what it is.',
    tags: ['placeholder', 'wip'],
    year: '2026',
    role: 'Design + build',
    stack: 'TypeScript, WebGL',
    accent: '#b06bff',
    body: [
      'Placeholder copy. Replace this with the story of the project — what the problem was, who it was for, and what constraints you were working inside.',
      'A second paragraph works well for the approach: what you tried, what you threw away, and the decision you would defend in a review.'
    ],
    highlights: ['Placeholder outcome one', 'Placeholder outcome two', 'Placeholder outcome three']
  },
  {
    slug: 'pixel-drift',
    title: 'Pixel Drift',
    blurb: 'Placeholder project. A short line about what it is.',
    tags: ['placeholder', 'game'],
    year: '2026',
    role: 'Solo build',
    stack: 'Canvas, Web Audio',
    accent: '#ff5ea8',
    body: [
      'Placeholder copy. Replace this with the story of the project — what the problem was, who it was for, and what constraints you were working inside.',
      'A second paragraph works well for the approach: what you tried, what you threw away, and the decision you would defend in a review.'
    ],
    highlights: ['Placeholder outcome one', 'Placeholder outcome two']
  },
  {
    slug: 'signal-garden',
    title: 'Signal Garden',
    blurb: 'Placeholder project. A short line about what it is.',
    tags: ['placeholder', 'tooling'],
    year: '2025',
    role: 'Engineering',
    stack: 'Python, Postgres',
    accent: '#5ee0c8',
    body: [
      'Placeholder copy. Replace this with the story of the project — what the problem was, who it was for, and what constraints you were working inside.',
      'A second paragraph works well for the approach: what you tried, what you threw away, and the decision you would defend in a review.'
    ],
    highlights: ['Placeholder outcome one', 'Placeholder outcome two']
  },
  {
    slug: 'nightshift',
    title: 'Nightshift',
    blurb: 'Placeholder project. A short line about what it is.',
    tags: ['placeholder', 'mobile'],
    year: '2025',
    role: 'Design + build',
    stack: 'Swift, CoreML',
    accent: '#ffb347',
    body: [
      'Placeholder copy. Replace this with the story of the project — what the problem was, who it was for, and what constraints you were working inside.',
      'A second paragraph works well for the approach: what you tried, what you threw away, and the decision you would defend in a review.'
    ],
    highlights: ['Placeholder outcome one', 'Placeholder outcome two']
  },
  {
    slug: 'vector-bloom',
    title: 'Vector Bloom',
    blurb: 'Placeholder project. A short line about what it is.',
    tags: ['placeholder', 'research'],
    year: '2025',
    role: 'Research',
    stack: 'PyTorch',
    accent: '#7aa2ff',
    body: [
      'Placeholder copy. Replace this with the story of the project — what the problem was, who it was for, and what constraints you were working inside.',
      'A second paragraph works well for the approach: what you tried, what you threw away, and the decision you would defend in a review.'
    ],
    highlights: ['Placeholder outcome one', 'Placeholder outcome two']
  },
  {
    slug: 'halfmoon',
    title: 'Halfmoon',
    blurb: 'Placeholder project. The full-width card with no thumbnail.',
    tags: ['placeholder'],
    year: '2024',
    role: 'Side project',
    stack: 'Whatever you like',
    accent: '#c9a6ff',
    wide: true,
    body: [
      'Placeholder copy. Replace this with the story of the project — what the problem was, who it was for, and what constraints you were working inside.'
    ],
    highlights: ['Placeholder outcome one']
  }
];

/* ------------------------------------------------------------------
   Helpers shared by the homepage and the project pages.
   ------------------------------------------------------------------ */
window.SiteUtil = (function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function bySlug(slug) {
    for (var i = 0; i < window.PROJECTS.length; i++) {
      if (window.PROJECTS[i].slug === slug) return { project: window.PROJECTS[i], index: i };
    }
    return null;
  }

  function href(project) {
    return 'project.html?p=' + encodeURIComponent(project.slug);
  }

  /* A fake app screenshot, drawn as flat rects so it stays crisp and pixel-y.
     Four archetypes, picked by index, tinted with the project's accent. */
  function thumbSVG(project, index) {
    var a = project.accent || '#b06bff';
    var W = 168;
    var H = 356;
    var r = [];

    function rect(x, y, w, h, fill, op) {
      r.push(
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
        '" fill="' + fill + '"' + (op == null ? '' : ' opacity="' + op + '"') + '/>'
      );
    }

    // status bar + header, common to every archetype
    rect(0, 0, W, H, '#0a0713');
    rect(14, 14, 26, 4, '#ffffff', 0.28);
    rect(W - 34, 13, 20, 6, '#ffffff', 0.18);
    rect(14, 34, 74, 10, '#ffffff', 0.72);

    var kind = index % 4;

    if (kind === 0) {
      // search + tile grid
      rect(14, 56, W - 28, 20, '#ffffff', 0.07);
      rect(22, 63, 40, 6, '#ffffff', 0.3);
      for (var i = 0; i < 6; i++) {
        var cx = 14 + (i % 2) * 74;
        var cy = 88 + Math.floor(i / 2) * 78;
        rect(cx, cy, 66, 66, a, 0.14 + (i % 3) * 0.16);
        rect(cx + 8, cy + 44, 34, 5, '#ffffff', 0.4);
        rect(cx + 8, cy + 54, 22, 4, '#ffffff', 0.18);
      }
      rect(0, H - 34, W, 34, '#ffffff', 0.05);
      for (var t = 0; t < 4; t++) rect(20 + t * 34, H - 22, 12, 10, '#ffffff', t === 0 ? 0.6 : 0.2);
    } else if (kind === 1) {
      // hero card + feed rows
      rect(14, 56, W - 28, 96, a, 0.5);
      rect(14, 56, W - 28, 96, '#000000', 0.12);
      rect(24, 122, 62, 8, '#ffffff', 0.9);
      rect(24, 136, 40, 5, '#ffffff', 0.45);
      for (var j = 0; j < 4; j++) {
        var ry = 166 + j * 44;
        rect(14, ry, 34, 34, a, 0.3 - j * 0.05);
        rect(56, ry + 5, 78 - j * 8, 7, '#ffffff', 0.55);
        rect(56, ry + 18, 54, 5, '#ffffff', 0.2);
      }
    } else if (kind === 2) {
      // map + bottom sheet
      rect(0, 48, W, 190, a, 0.13);
      for (var g = 0; g < 8; g++) rect(0, 56 + g * 24, W, 1, '#ffffff', 0.06);
      for (var g2 = 0; g2 < 5; g2++) rect(12 + g2 * 36, 48, 1, 190, '#ffffff', 0.06);
      var path = [[28, 214], [28, 176], [72, 176], [72, 128], [124, 128], [124, 86]];
      for (var p = 0; p < path.length - 1; p++) {
        var x1 = path[p][0], y1 = path[p][1], x2 = path[p + 1][0], y2 = path[p + 1][1];
        rect(Math.min(x1, x2), Math.min(y1, y2), Math.max(4, Math.abs(x2 - x1)), Math.max(4, Math.abs(y2 - y1)), a, 0.95);
      }
      rect(120, 80, 10, 10, '#ffffff', 0.95);
      rect(0, 238, W, H - 238, '#ffffff', 0.06);
      rect(70, 246, 28, 4, '#ffffff', 0.25);
      rect(16, 262, 90, 9, '#ffffff', 0.8);
      for (var k = 0; k < 3; k++) {
        rect(16, 286 + k * 26, 24, 16, a, 0.35);
        rect(48, 290 + k * 26, 84 - k * 14, 6, '#ffffff', 0.35);
      }
    } else {
      // editor: toolbar, canvas, layers
      rect(0, 50, W, 22, '#ffffff', 0.06);
      for (var b = 0; b < 5; b++) rect(12 + b * 22, 57, 12, 8, '#ffffff', b === 1 ? 0.7 : 0.22);
      rect(10, 82, W - 20, 168, '#ffffff', 0.04);
      rect(34, 106, 56, 56, a, 0.85);
      rect(74, 146, 62, 62, a, 0.35);
      rect(74, 146, 62, 62, '#ffffff', 0.08);
      rect(30, 102, 4, 4, '#ffffff', 0.9);
      rect(86, 102, 4, 4, '#ffffff', 0.9);
      rect(30, 158, 4, 4, '#ffffff', 0.9);
      rect(86, 158, 4, 4, '#ffffff', 0.9);
      for (var l = 0; l < 4; l++) {
        rect(14, 264 + l * 22, 14, 14, a, 0.5 - l * 0.1);
        rect(36, 268 + l * 22, 70 - l * 10, 6, '#ffffff', 0.3);
      }
    }

    return (
      '<svg class="thumb" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H +
      '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' +
      r.join('') + '</svg>'
    );
  }

  return { esc: esc, pad2: pad2, bySlug: bySlug, href: href, thumbSVG: thumbSVG };
})();
