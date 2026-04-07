# Band Website

Static band website built with [Eleventy](https://www.11ty.dev/) and [Decap CMS](https://decapcms.org/).

## Setup

```bash
npm install
```

## Development

```bash
npm start
```

Opens a live-reloading server at [localhost:8080](http://localhost:8080).

## Build

```bash
npm run build
```

Outputs the static site to `_site/`.

## Configuration

Edit `src/_data/site.json` to set the band name, URL, description, and social links. These values are used across the entire site.

## Content

- **Events** — add Markdown files to `src/events/` with frontmatter: `title`, `date`, `venue`, `location`, `ticketUrl`
- **Announcements** — add Markdown files to `src/announcements/` with frontmatter: `title`, `date`, `excerpt`
- **Pages** — edit `src/about.md` and `src/contact.md`, or create new `.md` files with `layout: page.njk`
- **Homepage** — edit `src/index.njk` directly (plain HTML + Nunjucks)

## CMS

When deployed to Netlify with [Identity](https://docs.netlify.com/security/secure-access-to-sites/identity/) enabled, visit `/admin/` to manage content through a visual editor.

## Hosting

Deploy to [Netlify](https://www.netlify.com/) or [GitHub Pages](https://pages.github.com/). Build command: `npm run build`, publish directory: `_site`.
