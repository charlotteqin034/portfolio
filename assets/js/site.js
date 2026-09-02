/* ------------------------------------------------------------------
   site.js — the only file you need to edit to change content.
   Loaded by every page as a plain script (no modules, so file:// works).
   ------------------------------------------------------------------ */

window.SITE = {
  name: 'Charlotte',

  // The footer and the sidebar both read these.
  // Leave a string empty and it renders as a muted "coming soon" placeholder.
  links: {
    linkedin: 'https://www.linkedin.com/in/charlotte-qin-96757320a/',
    github: 'https://github.com/charlotteqin034'
  }
};

/* Hero headline, the "Based in ___" line and the two lines under the hero
   live directly in index.html so they paint instantly — search for
   "EDIT ME" in that file. */

/* Projects, in the order you walk past them. `slug` is what shows up
   in the URL (project.html?p=slug). `shortTitle` is optional — set it when the
   real name is too long for a card, and it replaces `title` on the card, the
   page headline and the prev/next boxes. `wide: true` renders the full-width,
   no-thumbnail card variant.

   Media is optional and lives in assets/media/<slug>/. `cover` is the image
   that stands for the project on its corridor card; it also leads the gallery
   on the detail page, where `media` follows it. Every entry — cover included —
   is a path or { src, caption, poster, frame, fit, focus }. frame: 'phone'
   puts a tall screenshot inside the site's phone mockup instead of a full-bleed
   panel. On a card cover, fit: 'contain' shows the whole image rather than
   cropping it to fill, and focus: 'right' (or left/top/bottom/center) picks
   which edge survives the crop. `coverCardOnly: true` keeps the cover off the
   detail page, for when one image is the right face for the card but something
   else should lead the page. */
window.PROJECTS = [
  {
    slug: 'biofeedback-music',
    title: 'Biofeedback to music composition with Sony Pictures',
    shortTitle: 'Biofeedback to Music',
    blurb: 'Turning physiological data into music.',
    tags: ['sony pictures', 'vr', 'biofeedback'],
    period: 'Sept 2025 \u2014 Jan 2026',
    role: 'Developer',
    team: '3 members',
    stack: 'Unreal Engine, Meta Quest 3, Ableton Live, Polar H-10, Muse 2 Headband',
    accent: '#b06bff',
    cover: { src: 'assets/media/biofeedback-music/rig.jpg', focus: 'right',
             caption: 'Ableton driven by live EEG bands off the headband.' },
    coverCardOnly: true,
    media: [
      { src: 'assets/media/biofeedback-music/eeg-1.mp4',
        poster: 'assets/media/biofeedback-music/eeg-1-poster.jpg',
        caption: 'EEG-driven composition at a resting heart rate.' },
      { src: 'assets/media/biofeedback-music/eeg-2.mp4',
        poster: 'assets/media/biofeedback-music/eeg-2-poster.jpg',
        caption: 'The same system with the heart rate up — tempo follows it.' },
      { src: 'assets/media/biofeedback-music/eeg-3.mp4',
        poster: 'assets/media/biofeedback-music/eeg-3-poster.jpg',
        caption: 'Asleep in the hardware: eyes closed, heart rate at its lowest.' },
      { src: 'assets/media/biofeedback-music/translator-early.mp4',
        poster: 'assets/media/biofeedback-music/translator-early-poster.jpg',
        caption: 'An early build of the translator, alpha waves setting the note value.' },
      { src: 'assets/media/biofeedback-music/visuals-closeup.mp4',
        poster: 'assets/media/biofeedback-music/visuals-closeup-poster.jpg',
        caption: 'A closer look at the visuals: each one is driven by a different audio frequency.' },
      { src: 'assets/media/biofeedback-music/vr-environment.mp4',
        poster: 'assets/media/biofeedback-music/vr-environment-poster.jpg',
        caption: 'The custom VR environment with its audio-reactive visuals.' }
    ],
    body: [
      'I had the opportunity to work with Sony on a creative project focused on transmedia: combining different mediums of technology and expression to create a unique experience. My two other team members and I came from a game development background, which shaped the design and mechanics of the experience. We wanted to flip traditional gameplay on its head; instead of relying on intentional input, the standard for most games, we chose to use involuntary physiological signals to influence the world around the player. To achieve this, we incorporated a range of novel technology, including VR headsets and unconventional consumer health products, to push past the boundaries of what we typically see in interactive experiences today.',
      'This ambition brought extra obstacles. Since we were working in uncharted territory, there was no blueprint or established process to follow. We had to research and iterate independently, exploring and adapting as we went. My role centered on building the EEG-to-music translation system, learning and applying Ableton\'s Max for Live coding language to map brainwave readings to musical elements.',
      'Our finished product was a custom-modeled VR environment with music tied to the user\'s biofeedback. EEG signals governed the music composition, with different brainwaves controlling elements like notes, rhythm, and key, while heart rate drove the tempo. We also built dynamic visuals that shifted and transformed alongside the music, along with a sonar-like effect (similar to Honmoon from K-pop Demon Hunters) that pulsed outward across the environment with every heartbeat. We presented the project internally to Sony employees in the US and Japan, and I spoke about the work on a panel at South by Southwest 2026.'
    ],
    highlights: [
      'Spoke about the project on a panel at South by Southwest 2026',
      'Learned to break an unmapped problem down into pieces I understood',
      'The coolest thing I have made'
    ]
  },
  {
    slug: 'prox',
    title: 'Prox',
    blurb: 'Intern at a grocery deals startup.',
    tags: ['startup', 'search', 'data pipeline'],
    period: 'Jan 2026 \u2014 May 2026',
    role: 'Software Developer Intern',
    team: 'Solo, with the founder as PM',
    stack: 'TypeScript, Supabase, PostgreSQL, OpenAI API',
    accent: '#5ee0c8',
    cover: { src: 'assets/media/prox/deals-search.jpg', frame: 'phone',
             caption: 'Search results after the enrichment pipeline.' },
    media: [
      { src: 'assets/media/prox/deals-home.jpg', frame: 'phone',
        caption: 'The deals feed the search feeds into.' }
    ],
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/us/app/prox-grocery-savings/id6759476458' }
    ],
    body: [
      'During my time working for Prox, a grocery deals startup, I worked on cleaning data (categorizing, brand-matching, and normalizing size information for retail grocery products), which served the overarching goal of improving search results within the Prox app. The existing search relied purely on keyword matching and ignored the intent behind each query.',
      'Since this work was for a startup, the available tech was limited, so I built a serverless data enrichment pipeline in TypeScript on Supabase Edge Functions, while working to minimize and continually reduce AI API usage to control costs. I used additional categorization techniques to group products into common search patterns, paired with LLM fallback for uncertain categorizations, to eliminate irrelevant grocery items from specific searches. This added semantic functionality, matching by meaning rather than just keywords. The new system reduced irrelevant results by over 70%.'
    ],
    highlights: [
      'Built a system that reduced irrelevant results by over 70%',
      'Build and iterate quickly',
      'Working within constraints'
    ]
  },
  {
    slug: 'agents-on-air',
    title: 'Agents on Air',
    blurb: 'A fully interactive, AI-driven podcast experience in real time.',
    tags: ['hackathon', 'azure', 'real-time ai'],
    period: 'Feb 2026',
    role: 'Developer',
    team: '3 members',
    stack: 'Azure, React.js, Node.js/Express, OpenAI',
    accent: '#7aa2ff',
    cover: { src: 'assets/media/agents-on-air/live-session.png', fit: 'contain',
             caption: 'Nova and Echo mid-episode, with the floor open to listeners.' },
    media: [
      { src: 'assets/media/agents-on-air/demo.mp4',
        poster: 'assets/media/agents-on-air/demo-poster.jpg',
        caption: 'The podcast in action.' }
    ],
    body: [
      'In partnership with Microsoft for Startups, this 24-hour hackathon gave each team access to Microsoft Azure credits. My team and I wanted to leverage as many Azure services as possible within this project (Redis, Web PubSub, OpenAI, Speech, Container Apps, and Static Web Apps) while creating a unique software product. We developed Agents on Air, a real-time AI podcast platform that generates conversational episodes between AI hosts. First, an LLM generates a general outline of the podcast; then, for each host\'s turn, a specific script is generated in real time, responding to the previous message while following the outline. This structure enables listener interaction: users can seamlessly ask questions and add to the conversation through voice chat or text input, with low latency.',
      'My time was spent designing and developing the entire backend and Azure service orchestration. I navigated the challenge of creating a seamless experience for listeners, ensuring that script generation, conversation flow, and user interaction happened without significant pauses. This project also gave me the opportunity to learn how Azure services are configured, how they work together, and how they integrate into a codebase.',
      'Check out the video to see the podcast in action.'
    ],
    highlights: [
      'Experience with cloud services',
      'Improving latency for AI services'
    ]
  },
  {
    slug: 'break-to-make',
    title: 'Break to Make',
    blurb: 'An electric composter doubling as a decorative plant stake, built at a 24-hour makeathon.',
    tags: ['makeathon', 'hardware', 'arduino'],
    period: 'Sept 2025',
    role: 'Engineer / Developer',
    team: '3 members',
    stack: 'Arduino, LCD screen, temperature sensor, heater module, servos',
    accent: '#86e06b',
    cover: { src: 'assets/media/break-to-make/build-table.jpg', focus: 'right',
             caption: 'Wiring the Arduino, somewhere in hour eighteen.' },
    body: [
      'This 24-hour makeathon\'s theme was "Tech for Good," encouraging us to build physical products rather than software. This was one of my first experiences building with hardware coming from a traditional software background, so it gave me the opportunity to explore a new discipline.',
      'Our product was an electric composter shaped like a decorative plant stake. To use it, a user drops in fruit peels which are dehydrated and composted, then automatically fed straight into the plant pot. My responsibilities centered on wiring the Arduino to the temperature sensor, heater modules, LCD, and servos, then rigging everything into the final build, which proved harder than anticipated due to space constraints. I was building until the very last moment, but we produced a working proof of concept, pitched it to a panel of judges, and won the environmental track of the makeathon.'
    ],
    highlights: [
      'Won the environmental track',
      'Learning to thrive under pressure',
      'Making physical tech is so rewarding'
    ]
  },
  {
    slug: 'nethra',
    title: 'Nethra',
    blurb: 'Simplifying complex and fragmented event planning through 3D previsualization.',
    tags: ['startup', '3d', 'photogrammetry'],
    period: 'Jan 2026 \u2014 May 2026',
    role: 'Co-founder',
    team: '2 members',
    stack: 'Tauri 2, React/TypeScript, Three.js, OpenDroneMap, DJI Mini drone',
    accent: '#ff5ea8',
    cover: { src: 'assets/media/nethra/stage.jpg',
             caption: 'The kind of show Nethra is for.' },
    coverCardOnly: true,
    media: [
      { src: 'assets/media/nethra/editor.mp4',
        poster: 'assets/media/nethra/editor-poster.jpg',
        caption: 'The 3D editor, working on a venue built from drone photogrammetry.' }
    ],
    body: [
      'After countless problem discovery calls with event planners, lighting designers, and production managers, my cofounder and I decided to work within the live entertainment industry to address the challenge of planning and designing an event. For our project, Nethra, my work centered on UI/UX design of the 3D editor and developing the technical pipeline from drone photogrammetry to software.',
      'The most important feature was our ability to leverage drone photogrammetry to generate 3D models of an event venue, saving the time and cost of sourcing 3D modelers to build one by hand. The drone captures hundreds of photos of the venue in flight, then OpenDroneMap processes them into the model. This model is uploaded into Nethra, where planners can design the event through an intuitive, easy-to-use interface, accelerating the planning process for large-scale events.'
    ],
    highlights: [
      'Pitched the product to a panel of investors',
      'Design partnerships with Tomorrowland Brasil, Afterlife, and Lollapalooza Brasil'
    ]
  },
  {
    slug: 'mist-hologram',
    title: 'Mist Hologram',
    blurb: 'A fog-curtain hologram.',
    tags: ['side project', 'hardware', 'prototype'],
    period: 'March 2026',
    role: 'Engineer',
    team: '2 members',
    stack: 'Trash bin, pipes, fog machine',
    accent: '#ffb347',
    cover: { src: 'assets/media/mist-hologram/fog-curtain.jpg',
             caption: 'The fog curtain, lit from the spout above it.' },
    media: [
      { src: 'assets/media/mist-hologram/demo.mp4',
        poster: 'assets/media/mist-hologram/demo-poster.jpg',
        caption: 'The curtain running.' }
    ],
    body: [
      'One side project we explored before landing on [Nethra](nethra) was a Mist Hologram. This version was specifically built as a technical feasibility test, where my co-founder and I put together a quick proof of concept in a single day. I focused on designing and building the internal structure, which included routing fog from a fog machine into an internal ice chamber to cool it, then pushing it out through a custom spout to form a clean fog curtain.'
    ],
    highlights: [
      'It looked really cool',
      'Always be building'
    ]
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

  /* Body copy is plain text, but a paragraph occasionally needs to point at
     another project or an outside page. `[label](target)` does it: a target
     that looks like a URL opens in a new tab, anything else is read as a
     project slug. Everything is escaped first, so the copy can never inject
     markup — only these two link shapes survive. */
  function richText(str) {
    return esc(str).replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, function (whole, label, target) {
      if (/^https?:/i.test(target)) {
        return '<a href="' + target + '" target="_blank" rel="noopener">' + label + '</a>';
      }
      var hit = bySlug(target);
      return hit ? '<a href="' + href(hit.project) + '">' + label + '</a>' : label;
    });
  }

  /* A media entry is either a bare path or an object with a caption (and, for
     video, a poster frame). Type is read off the extension so the common case
     stays a one-liner: media: ['assets/media/prox/demo.mp4']. */
  function media(entry) {
    var m = typeof entry === 'string' ? { src: entry } : (entry || {});
    return {
      src: m.src || '',
      kind: /\.(mp4|webm)$/i.test(m.src || '') ? 'video' : 'image',
      poster: m.poster || '',
      caption: m.caption || '',
      // a tall phone screenshot belongs in the site's phone mockup; cropping
      // one into a wide panel throws most of the screen away
      frame: m.frame === 'phone' ? 'phone' : '',
      /* How the card panel treats the image. It crops to fill by default;
         'contain' shows the whole thing instead. `focus` picks which edge
         survives the crop. Both are allow-listed rather than passed through,
         so project copy can never write arbitrary CSS. */
      fit: m.fit === 'contain' ? 'contain' : 'cover',
      focus: /^(left|right|top|bottom|center)$/.test(m.focus || '') ? m.focus : ''
    };
  }

  /* The name a project goes by in tight spaces — the corridor card, the page
     headline, the prev/next boxes. Everything is set in a monospaced pixel
     face, so a long formal name eats three or four lines there. The full
     `title` still owns the browser tab and the detail page. */
  function shortName(project) {
    return project.shortTitle || project.title;
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

  return { esc: esc, richText: richText, pad2: pad2, bySlug: bySlug, href: href,
           shortName: shortName, media: media, thumbSVG: thumbSVG };
})();
