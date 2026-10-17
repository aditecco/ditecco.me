# ditecco.me

Personal website of Alessandro Di Tecco, built with [Astro](https://astro.build)
(static output) and [Sanity](https://www.sanity.io).

| Path         | What                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| `/`          | Home cards (Sanity `homeCard`)                                         |
| `/resume/`   | Résumé, EN/IT (Sanity `resumeEntry`)                                   |
| `/notes/`    | Notes, i.e. the blog (Sanity `note`)                                   |
| `/archive/`  | Index of the archived sites, which live in `public/archive`            |
| `/projects/` | Index of projects (hardcoded list in `src/pages/projects/index.astro`) |

The photo blog lives in its own repo and subdomain:
[itakepictures.ditecco.me](https://itakepictures.ditecco.me).

## Develop

```sh
npm install
npm run dev
```

Without `SANITY_PROJECT_ID` the site renders `fixtures/*.json`, which are
generated from the markdown in `src/content` (`npm run fixtures`), so it works
offline. Copy `.env.example` to `.env` to read from Sanity instead.

## Content

The studio lives in `cms/` and is deployed to Sanity's hosting:

```sh
cd cms && npm install
SANITY_STUDIO_PROJECT_ID=... SANITY_STUDIO_DATASET=production npm run deploy
```

To seed an empty dataset from `src/content` (idempotent, safe to re-run):

```sh
SANITY_PROJECT_ID=... SANITY_DATASET=production SANITY_WRITE_TOKEN=... npm run import
```

## Deploy

Vercel (framework preset Astro). Set `SANITY_PROJECT_ID` and `SANITY_DATASET`
in the project's environment. Add a Sanity webhook (filter:
`_type in ["homeCard", "resumeEntry", "note"]`) that calls a Vercel deploy hook,
so published changes rebuild the site. Redirects live in `vercel.json`.
