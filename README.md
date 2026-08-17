# hendryshao.github.io

Personal portfolio site for **Hendry Shao** — full-stack developer.

**Live:** <https://hendryshao.github.io>

A hand-built static site. No framework, no build step, no dependencies —
open `index.html` in a browser and it runs.

## Structure

```
.
├── index.html                       # the page — markup + <head> metadata
├── assets/
│   ├── favicon.svg                  # HS monogram, gradient on dark
│   ├── og.png                       # 1200×630 social preview card
│   ├── css/
│   │   └── styles.css               # all styling, tokens at the top
│   ├── js/
│   │   └── main.js                  # constellation canvas, reveals, spotlight
│   └── fonts/
│       ├── sora-variable.woff2      # display + body
│       ├── jetbrains-mono-variable.woff2  # technical labels
│       └── LICENSE.md               # SIL OFL 1.1
├── robots.txt
└── sitemap.xml
```

## Editing

Everything you'd normally want to change lives in `index.html`:

| What | Where |
|---|---|
| Name, tagline, intro | `<section class="hero">` |
| About copy + fact list | `<section id="about">` |
| Projects | `<article class="card">` blocks inside `#work` |
| Stack | `<section id="stack">` |
| Experience + education | `<div class="tl-item">` blocks inside `#path` |
| Email, GitHub, LinkedIn | `<section id="contact">` and the hero buttons |

Colours, spacing and type scale are CSS custom properties at the top of
`assets/css/styles.css` under `:root` — change `--v`, `--b`, `--a` to
restyle the whole gradient system at once.

### Adding a project

Copy an existing `<article class="card">` inside `#work`. Each one carries a
status badge (`badge-live` / `badge-dev` / `badge-oss`), a year, a
description, one "the hard part" note, a chip list, and its links.

The `.hl` note is the point of the section — it's where a real engineering
tradeoff goes. A project entry without one reads like a résumé line.

### Adding a screenshot

Cards have no image slot by default. To add one, drop this above `.chips`:

```html
<figure class="card-media">
  <img src="assets/img/your-shot.png" alt="What the screenshot shows" loading="lazy">
</figure>
```

…and add to `styles.css`:

```css
.card-media{margin-top:18px;border:1px solid var(--edge);border-radius:10px;overflow:hidden}
.card-media img{display:block;width:100%;height:auto}
```

## Local preview

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Opening `index.html` via `file://` mostly works, but a server is closer to
production and avoids font/CORS surprises.

## Deploying

GitHub Pages serves `main` from the repository root. Push and it redeploys:

```bash
git add -A && git commit -m "update: …" && git push
```

Give it about a minute. Check status under **Settings → Pages**.

## Accessibility & performance notes

- Single render-blocking stylesheet; fonts preloaded and self-hosted, so
  there are no third-party requests and nothing to leak a visitor's IP.
- `prefers-reduced-motion` is respected — the canvas draws one still frame
  and scroll reveals are disabled rather than animating.
- The canvas stops its animation loop when scrolled out of view or when the
  tab is hidden, so it doesn't burn battery in a background tab.
- Skip link, visible focus rings, and semantic landmarks are in place.

## Fonts

Sora and JetBrains Mono, both under the SIL Open Font License 1.1 — see
`assets/fonts/LICENSE.md`. They're latin subsets, self-hosted rather than
loaded from a CDN.
