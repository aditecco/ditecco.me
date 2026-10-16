import { marked } from "marked"

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&rarr;": "→",
  "&larr;": "←",
  "&nbsp;": " ",
  "&middot;": "·",
  "&bull;": "•",
}

function decode(text) {
  return text.replace(/&[a-z0-9#]+;/gi, m => ENTITIES[m] ?? m)
}

// markdown authored for remark sometimes quotes the URL: [x]('/path/')
function cleanHref(href) {
  return href.replace(/^'(.*)'$/, "$1")
}

function createKeys(prefix) {
  let i = 0
  return () => `${prefix}${(i++).toString(36)}`
}

function inline(tokens, key, markDefs, marks = []) {
  const children = []

  for (const token of tokens) {
    switch (token.type) {
      case "text":
      case "escape":
        if (token.tokens?.length) {
          children.push(...inline(token.tokens, key, markDefs, marks))
        } else {
          children.push({
            _type: "span",
            _key: key(),
            text: decode(token.text).replace(/\s*\n\s*/g, " "),
            marks,
          })
        }
        break
      case "strong":
        children.push(
          ...inline(token.tokens, key, markDefs, [...marks, "strong"]),
        )
        break
      case "em":
        children.push(...inline(token.tokens, key, markDefs, [...marks, "em"]))
        break
      case "codespan":
        children.push({
          _type: "span",
          _key: key(),
          text: decode(token.text),
          marks: [...marks, "code"],
        })
        break
      case "br":
        children.push({ _type: "span", _key: key(), text: "\n", marks })
        break
      case "link": {
        const markKey = key()
        markDefs.push({
          _type: "link",
          _key: markKey,
          href: cleanHref(token.href),
        })
        children.push(
          ...inline(token.tokens, key, markDefs, [...marks, markKey]),
        )
        break
      }
      case "html":
        break
      default:
        children.push({
          _type: "span",
          _key: key(),
          text: decode(token.raw ?? token.text ?? ""),
          marks,
        })
    }
  }

  return children
}

function block(tokens, key, style = "normal", listItem, level = 1) {
  const markDefs = []
  const children = inline(tokens, key, markDefs)

  return {
    _type: "block",
    _key: key(),
    style,
    markDefs,
    children: children.length
      ? children
      : [{ _type: "span", _key: key(), text: "", marks: [] }],
    ...(listItem ? { listItem, level } : {}),
  }
}

function listBlocks(token, key, level = 1) {
  const listItem = token.ordered ? "number" : "bullet"
  const out = []

  for (const item of token.items) {
    const textTokens = item.tokens.filter(t => t.type === "text")
    out.push(
      block(
        textTokens.flatMap(t => t.tokens ?? [t]),
        key,
        "normal",
        listItem,
        level,
      ),
    )

    for (const nested of item.tokens.filter(t => t.type === "list")) {
      out.push(...listBlocks(nested, key, level + 1))
    }
  }

  return out
}

/**
 * Converts the markdown subset used by the site's content
 * (paragraphs, headings, lists, links, emphasis, code) to Portable Text.
 */
export function markdownToPortableText(markdown, keyPrefix = "k") {
  const key = createKeys(keyPrefix)
  const out = []

  for (const token of marked.lexer(markdown)) {
    switch (token.type) {
      case "paragraph":
        out.push(block(token.tokens, key))
        break
      case "heading":
        out.push(block(token.tokens, key, `h${Math.min(token.depth, 4)}`))
        break
      case "blockquote":
        for (const inner of token.tokens.filter(t => t.type === "paragraph")) {
          out.push(block(inner.tokens, key, "blockquote"))
        }
        break
      case "list":
        out.push(...listBlocks(token, key))
        break
      case "code":
        out.push({
          _type: "codeBlock",
          _key: key(),
          language: token.lang || undefined,
          code: token.text,
        })
        break
      default:
        break
    }
  }

  return out
}
