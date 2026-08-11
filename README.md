# pixel-portfolio

A dark, purple-tinged portfolio with a pixel display face. The homepage is type
only. Scrolling walks a virtual camera down a corridor; project cards arrive one
at a time from the far end, staggered left and right, and sweep past you.

No build step, no dependencies. Plain HTML, CSS and ES5 JavaScript.

## Run it

```bash
python3 -m http.server 4444
# http://127.0.0.1:4444
```

Opening `index.html` straight off disk works too — everything is same-origin
and there are no ES modules.

## Where things live

| What | Where |
| --- | --- |
| Projects (all of them) | `assets/js/site.js` → `window.PROJECTS` |
| LinkedIn / GitHub URLs | `assets/js/site.js` → `SITE.links` |
| Hero headline and the two lines under it | `index.html`, marked `EDIT ME` |
| "Based in …" | the top bar in `index.html` **and** `project.html` |
| Colours, type scale, card size | `assets/css/main.css` → `:root` |
| Corridor feel (spacing, speed, fades) | `assets/js/home.js` → `metrics()` |

### Adding or editing a project

One object in `window.PROJECTS`. The homepage cards, the sidebar index and the
detail page all read from it, so nothing else needs touching.

```js
{
  slug: 'my-project',           // becomes project.html?p=my-project
  title: 'My Project',
  blurb: 'One line for the card.',
  tags: ['react', 'webgl'],
  year: '2026',
  role: 'Design + build',
  stack: 'TypeScript, three.js',
  accent: '#b06bff',            // tints the card, the thumbnail and the detail page
  wide: false,                  // true = full-width card with no thumbnail
  body: ['First paragraph.', 'Second paragraph.'],
  highlights: ['A thing that went well']
}
```

Order in the array is the order you walk past them. Cards alternate left/right
automatically.

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
