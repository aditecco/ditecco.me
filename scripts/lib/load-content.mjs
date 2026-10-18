import fs from "node:fs"
import path from "node:path"
import { parse } from "yaml"
import { markdownToPortableText } from "./markdown.mjs"

export const root = path.resolve(import.meta.dirname, "../..")

// `---` delimited YAML frontmatter followed by the markdown body
function matter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  return match
    ? { data: parse(match[1]) ?? {}, content: match[2] }
    : { data: {}, content: raw }
}

function readMarkdownDir(dir) {
  const abs = path.join(root, dir)

  return fs
    .readdirSync(abs)
    .filter(f => f.endsWith(".md"))
    .sort()
    .map(file => ({
      file,
      ...matter(fs.readFileSync(path.join(abs, file), "utf8")),
    }))
}

// remark rendered `#{startYear}` literally; that was never intended
function fixPlaceholders(md) {
  return md.replace(/#\{startYear\}/g, "2011")
}

// The old resume page showed the first 10 entries (per language) as work
// experience and the rest as "other". Two entries share order 2, so that cut
// falls after order 9.
// a dot in a document id makes it private to the dataset (the public API
// can't read it), so file names like "bcf.it" become "bcf-it"
const idSlug = slug => slug.replace(/\./g, "-")

const LAST_WORK_ORDER = 9

export function loadResumeEntries() {
  return readMarkdownDir("src/content/resume").map(
    ({ file, data, content }) => {
      const language = String(data.language).toUpperCase()
      const slug = file.replace(/\.md$/, "")

      return {
        _id: `resumeEntry-${idSlug(slug)}`,
        _type: "resumeEntry",
        title: String(data.title),
        subtitle: data.subtitle ?? "",
        language,
        category: data.order <= LAST_WORK_ORDER ? "work" : "other",
        order: data.order,
        body: markdownToPortableText(fixPlaceholders(content), "b"),
      }
    },
  )
}

export function loadHomeCards() {
  return readMarkdownDir("src/content/home").map(({ file, data, content }) => {
    const slug = file.replace(/\.md$/, "")
    const heroImgFile = data.heroImg
      ? path.basename(String(data.heroImg))
      : null

    // the photo project moves to its own subdomain
    const href =
      data.href === "/projects/itakepictures/"
        ? "https://itakepictures.ditecco.me/"
        : data.href === "/blog"
          ? "/notes/"
          : data.href

    return {
      _id: `homeCard-${idSlug(slug)}`,
      _type: "homeCard",
      master: Boolean(data.master),
      expanded: Boolean(data.expanded),
      href,
      title: data.title,
      subtitle: data.subtitle,
      body: data.body,
      intro: data.master ? markdownToPortableText(content, "i") : undefined,
      tags: data.tags ?? [],
      heroImgFile,
      heroAlt: data.heroAlt,
      order: data.order,
    }
  })
}
