# portfolio

A dark, purple-tinged portfolio with a pixel display face. The homepage is type
only. Scrolling walks a virtual camera down a corridor; project cards arrive one
at a time from the far end, staggered left and right, and sweep past you.

No build step, no dependencies. Plain HTML, CSS and ES5 JavaScript.

## Run it

```bash
python3 tools/serve.py       # http://127.0.0.1:4444
```

Use this rather than `python3 -m http.server`: it sends `Cache-Control:
no-store`, so an edit always shows up on reload. Plain `http.server` sends no
cache headers at all and browsers will happily serve you a stale page.

Opening `index.html` straight off disk works too — everything is same-origin
and there are no ES modules — but then you are back to fighting the cache.

## Where things live

| What | Where |
| --- | --- |
| Projects (all of them) | `assets/js/site.js` → `window.PROJECTS` |
| LinkedIn / GitHub URLs | `assets/js/site.js` → `SITE.links` |
| Hero headline and the two lines under it | `index.html`, marked `EDIT ME` |
| "Based in …" | the top bar in `index.html` **and** `project.html` |
| Colours, type scale, card size | `assets/css/main.css` → `:root` |
| Corridor feel (spacing, speed, fades) | `assets/js/home.js` → `metrics()` |

### Pictures and video

Drop files into `assets/media/<slug>/` — one folder per project, already
created. Then point at them from the project:

```js
cover: 'assets/media/prox/cover.jpg',      // card thumbnail + page banner
media: [
  'assets/media/prox/search.png',          // just a path, or…
  { src: 'assets/media/prox/demo.mp4', caption: 'Semantic search in action.' }
]
```

`cover` fills the card's left panel and the banner at the top of the detail
page; without one, the procedural fake screenshot is used instead. `media`
renders under the write-up, in order. `.mp4` and `.webm` become players (add
`poster: '…'` for a still frame); anything else is treated as an image.

Keep files under ~10 MB each — they are served straight from the repo, and
GitHub rejects anything over 100 MB.

### Adding or editing a project

One object in `window.PROJECTS`. The homepage cards, the sidebar index and the
detail page all read from it, so nothing else needs touching.

```js
{
  slug: 'my-project',           // becomes project.html?p=my-project
  title: 'My Project',
  shortTitle: 'Shorter',        // optional; used on the card, headline and prev/next
  blurb: 'One line for the card.',
  tags: ['react', 'webgl'],
  period: 'Sept 2025 — Jan 2026',   // shown on the card as "01 / <period>"
  role: 'Design + build',
  team: '3 members',
  stack: 'TypeScript, three.js',
  accent: '#b06bff',            // tints the card, the thumbnail and the detail page
  wide: false,                  // true = full-width card with no thumbnail
  links: [{ label: 'App Store', url: 'https://…' }],   // optional, detail page only
  body: ['First paragraph.', 'A line linking to [another project](its-slug).'],
  highlights: ['A thing that went well']
}
```

Order in the array is the order you walk past them. Cards alternate left/right
automatically.

Body paragraphs are plain text, with one exception: `[label](target)` becomes a
link. A target that looks like a URL opens in a new tab; anything else is read
as a project slug, so `[Nethra](nethra)` links to that project's page.
Everything else is escaped, so copy can never inject markup.

The card thumbnails are fake app screenshots drawn in code
(`SiteUtil.thumbSVG`), picked by position and tinted with `accent` — there are
four layouts. To use a real screenshot instead, swap the `<div class="phone">`
contents in `home.js` → `cardHTML()` for an `<img>`.

## Notes

- **Fonts** are self-hosted in `assets/fonts/` (Press Start 2P for display,
  VT323 for body text, both SIL OFL). No network calls at runtime.
- **`prefers-reduced-motion`** turns the corridor off entirely and renders the
  projects as a normal staggered list that fades in on scroll.
- **Below 860px** the cards stack, the left/right stagger collapses to centre,
  and the camera slows down.
- The hero headline **shrinks to fit** if you use a longer name — no need to
  retune the `clamp()`.
