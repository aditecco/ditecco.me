import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import fs from "node:fs"
import path from "node:path"

// The dev server doesn't resolve folder indexes for files in public/, so
// /archive/simplest/ 404s there while the built site (and Vercel) serves
// archive/simplest/index.html. Rewrite those requests to the index file.
const publicIndexes = {
  name: "public-folder-indexes",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url?.split("?")[0] ?? ""

      if (url.endsWith("/")) {
        const index = path.join(server.config.publicDir, url, "index.html")
        if (fs.existsSync(index)) req.url = `${url}index.html`
      }

      next()
    })
  },
}

export default defineConfig({
  site: "https://ditecco.me",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [react()],
  vite: {
    plugins: [publicIndexes],
    css: {
      preprocessorOptions: {
        // the stylesheets still use @import; migrating them to @use is a
        // separate cleanup
        scss: { silenceDeprecations: ["import"] },
      },
    },
  },
})
