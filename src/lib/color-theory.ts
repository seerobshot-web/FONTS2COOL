import { hexToRgb, isValidHex } from "./color-utils"

export interface HSL { h: number; s: number; l: number }
export interface RGB { r: number; g: number; b: number }

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const { r, g, b } = rgb
  const rN = r / 255
  const gN = g / 255
  const bN = b / 255
  const max = Math.max(rN, gN, bN)
  const min = Math.min(rN, gN, bN)
  const delta = max - min
  const l = (max + min) / 2

  if (delta === 0) return { h: 0, s: 0, l: Math.round(l * 100) }

  const s = delta / (l > 0.5 ? 2 - max - min : max + min)
  let h = 0
  if (max === rN) h = ((gN - bN) / delta + (gN < bN ? 6 : 0)) / 6
  else if (max === gN) h = ((bN - rN) / delta + 2) / 6
  else h = ((rN - gN) / delta + 4) / 6

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToHex(h: number, s: number, l: number): string {
  const hN = ((h % 360) + 360) % 360 / 360
  const sN = Math.max(0, Math.min(100, s)) / 100
  const lN = Math.max(0, Math.min(100, l)) / 100

  if (sN === 0) {
    const val = Math.round(lN * 255)
    return `#${val.toString(16).padStart(2, "0").repeat(3)}`
  }

  const q = lN < 0.5 ? lN * (1 + sN) : lN + sN - lN * sN
  const p = 2 * lN - q

  const hueToRgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  const r = Math.round(hueToRgb(p, q, hN + 1 / 3) * 255)
  const g = Math.round(hueToRgb(p, q, hN) * 255)
  const b = Math.round(hueToRgb(p, q, hN - 1 / 3) * 255)

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

export function rgbToString(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return ""
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export function hslToString(hex: string): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return ""
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}

export type SchemeMode =
  | "monochrome" | "analogic" | "complement"
  | "analogic-complement" | "triad" | "quad"

export const schemeModes: { value: SchemeMode; label: string; description: string }[] = [
  { value: "monochrome", label: "Monochrome", description: "Variations of a single hue" },
  { value: "analogic", label: "Analogic", description: "Adjacent colors on the wheel" },
  { value: "complement", label: "Complement", description: "Opposite colors for contrast" },
  { value: "analogic-complement", label: "Analogic-Complement", description: "Adjacent plus opposite" },
  { value: "triad", label: "Triad", description: "Three evenly spaced colors" },
  { value: "quad", label: "Quad", description: "Four evenly spaced colors" },
]

export function generateScheme(seedHex: string, mode: SchemeMode, count = 5): string[] {
  const hsl = hexToHsl(seedHex)
  if (!hsl) return []
  const { h, s, l } = hsl
  const result: string[] = []

  switch (mode) {
    case "monochrome": {
      const lightnesses = [85, 70, l, 35, 20]
      for (let i = 0; i < Math.min(count, 5); i++) {
        result.push(hslToHex(h, s, lightnesses[i]))
      }
      break
    }
    case "analogic": {
      const offsets = [-30, -15, 0, 15, 30]
      for (let i = 0; i < Math.min(count, 5); i++) {
        result.push(hslToHex(h + offsets[i], s, l))
      }
      break
    }
    case "complement": {
      result.push(hslToHex(h, s, l))
      result.push(hslToHex(h, s, Math.min(l + 20, 90)))
      result.push(hslToHex(h, Math.max(s - 20, 10), l))
      result.push(hslToHex(h + 180, Math.max(s - 20, 10), l))
      result.push(hslToHex(h + 180, s, l))
      break
    }
    case "analogic-complement": {
      result.push(hslToHex(h - 30, s, l))
      result.push(hslToHex(h, s, l))
      result.push(hslToHex(h + 30, s, l))
      result.push(hslToHex(h + 180, s, l))
      result.push(hslToHex(h + 180, s, Math.min(l + 15, 90)))
      break
    }
    case "triad": {
      result.push(hslToHex(h, s, l))
      result.push(hslToHex(h, s, Math.min(l + 20, 90)))
      result.push(hslToHex(h + 120, s, l))
      result.push(hslToHex(h + 240, s, l))
      result.push(hslToHex(h + 240, s, Math.min(l + 20, 90)))
      break
    }
    case "quad": {
      result.push(hslToHex(h, s, l))
      result.push(hslToHex(h + 90, s, l))
      result.push(hslToHex(h + 180, s, l))
      result.push(hslToHex(h + 270, s, l))
      result.push(hslToHex(h, s, Math.min(l + 20, 90)))
      break
    }
  }

  return result.slice(0, count)
}

export type PaletteStyle = "vibrant" | "muted" | "corporate" | "pastel" | "dark" | "earthy"

export const paletteStyles: { value: PaletteStyle; label: string }[] = [
  { value: "vibrant", label: "Vibrant" },
  { value: "muted", label: "Muted" },
  { value: "corporate", label: "Corporate" },
  { value: "pastel", label: "Pastel" },
  { value: "dark", label: "Dark" },
  { value: "earthy", label: "Earthy" },
]

const styleParams: Record<PaletteStyle, { s: number; l: number; sVar: number; lVar: number }> = {
  vibrant: { s: 85, l: 50, sVar: 10, lVar: 20 },
  muted: { s: 35, l: 55, sVar: 10, lVar: 15 },
  corporate: { s: 55, l: 45, sVar: 15, lVar: 20 },
  pastel: { s: 50, l: 75, sVar: 15, lVar: 10 },
  dark: { s: 60, l: 25, sVar: 15, lVar: 15 },
  earthy: { s: 40, l: 40, sVar: 15, lVar: 20 },
}

export interface GeneratedPalette {
  primary: string
  secondary: string
  accent: string
  neutral: string
  background: string
}

export function generatePalette(seedHex: string, style: PaletteStyle): GeneratedPalette {
  const hsl = hexToHsl(seedHex)
  if (!hsl) return { primary: "#3b82f6", secondary: "#64748b", accent: "#a78bfa", neutral: "#94a3b8", background: "#ffffff" }
  const { h } = hsl
  const p = styleParams[style]

  return {
    primary: hslToHex(h, p.s, p.l),
    secondary: hslToHex(h + 40, Math.max(p.s - p.sVar, 10), p.l + p.lVar),
    accent: hslToHex(h + 180, p.s, p.l),
    neutral: hslToHex(h, Math.max(p.s - 30, 5), p.l + p.lVar * 2),
    background: style === "dark" ? hslToHex(h, 20, 10) : hslToHex(h, 10, 95),
  }
}

export function generateMonoScale(baseHex: string): { shade: number; hex: string }[] {
  const hsl = hexToHsl(baseHex)
  if (!hsl) return []
  const { h, s } = hsl
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const lightnesses = [97, 93, 86, 77, 66, hsl.l, 48, 39, 31, 23, 16]

  return shades.map((shade, i) => ({
    shade,
    hex: hslToHex(h, i <= 5 ? Math.max(s - (5 - i) * 5, 10) : s, lightnesses[i]),
  }))
}

export function apcaScore(fgHex: string, bgHex: string): number {
  const fg = hexToRgb(fgHex)
  const bg = hexToRgb(bgHex)
  if (!fg || !bg) return 0

  const fgL = 0.2126 * Math.pow(fg.r / 255, 2.4) + 0.7152 * Math.pow(fg.g / 255, 2.4) + 0.0722 * Math.pow(fg.b / 255, 2.4)
  const bgL = 0.2126 * Math.pow(bg.r / 255, 2.4) + 0.7152 * Math.pow(bg.g / 255, 2.4) + 0.0722 * Math.pow(bg.b / 255, 2.4)

  const delta = fgL - bgL
  const sign = delta > 0 ? 1 : -1
  const absDelta = Math.abs(delta)
  if (absDelta < 0.02) return 0
  return Math.round(sign * (Math.pow(absDelta, 0.57) * 1.14) * 100)
}

export function generateRandomSeed(): string {
  const h = Math.floor(Math.random() * 360)
  const s = 40 + Math.floor(Math.random() * 50)
  const l = 30 + Math.floor(Math.random() * 40)
  return hslToHex(h, s, l)
}

export { isValidHex }
