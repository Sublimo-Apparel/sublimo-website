# Sublimo — Website

Custom full-sublimation jerseys, uniforms and shirts from Tabaco City, Albay.
**Design it. Print it. Wear it.**

A multi-page, fully responsive website (mobile + desktop) built with **HTML, Tailwind CSS v4 and plain JavaScript**.

## Pages

| Page | File | Sections (sub-navbar) |
|---|---|---|
| Home | `index.html` | Hero, intro + stats, "Explore" links to every page |
| Our work | `work.html` | Orders · More work · Layout studio |
| Products | `products.html` | Prices · Fabrics |
| How to order | `order.html` | Steps · Fees & payment · Size chart · Contact |
| Reviews | `reviews.html` | Reviews · Team photos |
| About | `about.html` | Our story · The owners · Podcast · The shop · What we stand for |

Every page shares the same **top navbar** (it collapses into a full-screen menu on phones and tablets) and footer. Longer pages also get a **sticky section navbar** under the header that highlights where you are.

## Project structure

```
sublimo-website/
├── index.html, work.html, products.html, order.html, reviews.html, about.html
├── src/
│   └── input.css     # Tailwind source: brand colors, fonts, custom components  ← edit this
├── css/
│   └── style.css     # Compiled Tailwind output (generated, don't edit by hand)
├── js/
│   ├── data.js       # Fabrics, size charts, reviews, Tagalog translations
│   ├── layout.js     # Shared header navbar, mobile menu and footer (edit nav links here)
│   └── main.js       # Language toggle, menus, tabs, lightbox, scroll animations
├── data/
│   └── designs.json  # Layout studio designs (edited with Pages CMS)
├── img/              # Photos, logo, favicon (img/designs/ = layout mockups)
├── media/            # Podcast trailer video
├── .pages.yml        # Pages CMS settings
└── package.json      # Tailwind build scripts
```

## Run it locally in VS Code

You need [Node.js](https://nodejs.org/) (LTS version) installed once.

1. Open the `sublimo-website` folder in VS Code (**File → Open Folder…**).
2. Open the terminal (**Terminal → New Terminal**) and install Tailwind:
   ```bash
   npm install
   ```
3. Start Tailwind in watch mode. It rebuilds `css/style.css` every time you save:
   ```bash
   npm run dev
   ```
4. Install the **Live Server** extension (VS Code will suggest it), right-click `index.html` → **Open with Live Server**.

Now any Tailwind class you add to an HTML file (e.g. `md:grid-cols-3`, `text-mint`) shows up as soon as you save.

> Just want to look at it? `css/style.css` is already built, so you can skip steps 2–3 and open `index.html` with Live Server directly.

### How the responsiveness works

Tailwind's breakpoint prefixes are used throughout the HTML:

| Prefix | Screen width | Example |
|---|---|---|
| *(none)* | phones (all sizes) | `grid-cols-1` |
| `sm:` | 640px and up | `sm:grid-cols-2` |
| `md:` | 768px and up | `md:grid-cols-4` |
| `lg:` | 1024px and up — desktop navbar appears | `lg:grid-cols-3` |
| `xl:` | 1280px and up | `xl:inline` |

Brand colors are defined once in `src/input.css` under `@theme` and become utilities: `bg-ink`, `bg-ink-2`, `text-paper`, `text-muted`, `text-mint`, `border-line`, `font-display`, `font-body`.

## Publish on GitHub (free hosting with GitHub Pages)

1. Run `npm run build` so `css/style.css` is minified and up to date.
2. Create a new **public** repository on GitHub, e.g. `sublimo-website` (don't add a README).
3. In the VS Code terminal:
   ```bash
   git init
   git add .
   git commit -m "Sublimo website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/sublimo-website.git
   git push -u origin main
   ```
4. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → main / (root) → Save**.
5. In a minute the site is live at `https://YOUR-USERNAME.github.io/sublimo-website/`.

`node_modules/` is ignored by `.gitignore`; the compiled `css/style.css` is committed so GitHub Pages can serve it without a build step. Remember to run `npm run build` and commit again whenever you change styles.

## Adding layout designs yourself (Pages CMS)

The Layout studio designs on **Our work** come from `data/designs.json`, and their images live in `img/designs/`. You can add, edit or remove them from a simple admin form using [Pages CMS](https://pagescms.org), which is free. Only people with access to your GitHub repository can sign in and make changes.

**One-time setup** (after the site is on GitHub):
1. Go to [app.pagescms.org](https://app.pagescms.org) and choose **Sign in with GitHub**.
2. Allow Pages CMS to access your `sublimo-website` repository when GitHub asks.
3. Open the repository in Pages CMS. You'll see **Layout studio designs** in the sidebar (this comes from the `.pages.yml` file in the project).

**To add a design:**
1. Open **Layout studio designs** and add a new entry.
2. Upload the image (square images look best), type the team or client name, pick the type, and add a short description. A Tagalog description is optional.
3. Save. Pages CMS saves the change to GitHub, and your live site updates in about a minute.

The first 6 designs show on the page, with a **Show more designs** button for the rest. Filter buttons (All, Jersey, Polo…) appear automatically based on the types you use. Designs show in the same order as the list, so put your newest or best ones at the top.

To let a staff member help, invite them from Pages CMS or add them as a collaborator on the GitHub repository. You can remove their access any time.

> The designs are loaded with JavaScript, so open the site through Live Server or GitHub Pages. Double-clicking `work.html` won't load them.

## Editing content

| What | Where |
|---|---|
| English text | Directly in each `.html` page |
| Tagalog (TL) translations | `TL` in `js/data.js` (keys match `data-i18n="..."` in the HTML) |
| Navbar / footer links | `NAV` at the top of `js/layout.js` |
| Fabrics, size charts, reviews | `js/data.js` |
| Layout studio designs | Pages CMS, or `data/designs.json` + `img/designs/` |
| Colors and fonts | `@theme` block in `src/input.css` |
| Photos | Replace files in `img/` with the same name, or change the `src` |

## External resources

- Fonts: Barlow and Barlow Condensed via Google Fonts
- Smooth scrolling: [Lenis](https://github.com/darkroomengineering/lenis) via unpkg (the site works without it)

## Contact

- Messenger: [m.me/sublimoph](https://m.me/sublimoph)
- Facebook: [facebook.com/sublimoph](https://www.facebook.com/sublimoph)
- Instagram: [@sublimo.25](https://www.instagram.com/sublimo.25/)
- TikTok: [@sublimoapparel](https://www.tiktok.com/@sublimoapparel)
