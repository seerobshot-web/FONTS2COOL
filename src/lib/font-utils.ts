import type { Font } from "./types"

const loadedFonts = new Set<string>()

export function loadGoogleFont(family: string, weights: number[] = [400]) {
  const key = `${family}-${weights.join(",")}`
  if (loadedFonts.has(key)) return

  const weightStr = weights.length > 1
    ? `wght@${[...weights].sort((a, b) => a - b).join(";")}`
    : `wght@${weights[0]}`

  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, "+")}:${weightStr}&display=swap`

  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = cssUrl
  document.head.appendChild(link)

  loadedFonts.add(key)
}

export function loadFontsForPreview(fonts: Font[]) {
  for (const font of fonts) {
    loadGoogleFont(font.family, font.weights)
  }
}

export function fontFamilyCss(family: string): string {
  return `"${family}", sans-serif`
}

export function buildGoogleFontsLink(families: string[], weights: Record<string, number[]> = {}): string {
  const params = families.map((family) => {
    const w = weights[family] || [400]
    const weightStr = w.length > 1
      ? `wght@${[...w].sort((a, b) => a - b).join(";")}`
      : `wght@${w[0]}`
    return `family=${family.replace(/\s+/g, "+")}:${weightStr}`
  })
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`
}

export function categoryColor(category: string): string {
  const map: Record<string, string> = {
    "sans-serif": "blue",
    "serif": "purple",
    "display": "orange",
    "handwriting": "pink",
    "monospace": "green",
  }
  return map[category] || "gray"
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    "sans-serif": "Sans-Serif",
    "serif": "Serif",
    "display": "Display",
    "handwriting": "Handwriting",
    "monospace": "Monospace",
  }
  return map[category] || category
}
