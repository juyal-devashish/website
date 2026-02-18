# CLAUDE.md

## Project Overview
Personal portfolio website for Devashish Juyal — a single-page static site with no build system or dependencies to install.

## Structure
```
index.html          # All content and markup (single page)
assets/
  css/style.css     # All styles
  js/main.js        # All JavaScript (p5.js neural net + page interactions)
  images/           # Project thumbnails (1.png–10.png) and logos
```

## Key Conventions

**Styling**
- Dark theme using CSS variables defined in `:root` (see top of `style.css`)
- Accent color: `--accent-primary: #d4a27a` (warm gold)
- Background: `--bg-primary: #191918`
- Responsive breakpoints: 1024px (tablet), 768px (mobile), 480px (small mobile)
- Fonts: system `-apple-system` stack for body/display; `SF Mono`/`ui-monospace` for mono

**HTML**
- Sections are tagged with `id` values: `#hero`, `#about`, `#projects`, `#skills`, `#contact`
- Section numbers: About=01, Projects=02, Skills=03, Contact=04
- Project cards use `data-category` attributes (`llm`, `ml`, `nlp`, `data`) for JS filtering

**JavaScript**
- p5.js global mode (functions `setup()`, `draw()` in global scope)
- All DOM interactions inside `DOMContentLoaded` listener at bottom of `main.js`
- No frameworks, no bundler — plain ES5-compatible JS

## No Build Step
Open `index.html` directly in a browser or use any static file server:
```bash
python3 -m http.server 8000
```

## External CDNs
- p5.js 1.9.0 (neural net animation)
- Font Awesome 6.5.1 (icons)
- Google Fonts (Source Serif 4, Inter, IBM Plex Mono)
