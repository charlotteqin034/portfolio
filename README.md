# portfolio — revamp

A rebuild of the corridor portfolio with a simpler, cleaner interface.

- **Dark purple glass.** Every panel is a translucent dark surface with a
  `backdrop-filter` over a canvas wave field (`assets/js/bg.js`), which drifts
  slowly so the glass has something behind it.
- **No parallax.** The 3D scroll corridor is gone; projects are a plain
  responsive grid that reveals on scroll.
- **One typeface.** Self-hosted Inter, latin + latin-ext only.
- **One icon family.** Inline SVG on a 24px grid at 1.6 stroke, in
  `SiteUtil.icon()` — no icon font.

## Working on it

```sh
python3 tools/serve.py          # http://localhost:4444
python3 tools/stamp.py          # re-hash asset URLs — run before every commit
```

`tools/stamp.py` appends `?v=<content hash>` to every asset URL. GitHub Pages
forces `Cache-Control: max-age=600` with no way to override it, so without the
stamps a visitor can get new HTML with ten-minute-old CSS.

All content lives in `assets/js/site.js`. Project media goes in
`assets/media/<slug>/`.

## Verifying

`scratch/` (gitignored) drives a real Chrome over the DevTools protocol.
`--virtual-time-budget` starves `requestAnimationFrame` and
`IntersectionObserver`, so the scroll reveal never fires under it and the
gallery photographs as an empty page — these scripts use wall-clock time
instead.

```sh
python3 scratch/cdp_sweep.py                        # every page: render state + JS errors
python3 scratch/cdp_carousel.py <project url>       # real-mouse carousel test
python3 scratch/cdp_shot.py <url> <out.png> --y 0.4 # screenshot at a scroll position
```

## Relationship to the live site

This is a copy of the portfolio at `../portfolio`, which is what is published at
<https://charlotteqin034.github.io/portfolio/>. The git remote is deliberately
removed here so nothing in this tree can overwrite the live site.
