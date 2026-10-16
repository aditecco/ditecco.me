import { defineConfig } from "astro/config"
import react from "@astrojs/react"

export default defineConfig({
  site: "https://ditecco.me",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [react()],
  vite: {
    css: {
      preprocessorOptions: {
        // the stylesheets still use @import; migrating them to @use is a
        // separate cleanup
        scss: { silenceDeprecations: ["import"] },
      },
    },
  },
})
