export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "")
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16)
    const g = parseInt(cleaned[1] + cleaned[1], 16)
    const b = parseInt(cleaned[2] + cleaned[2], 16)
    return { r, g, b }
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.substring(0, 2), 16)
    const g = parseInt(cleaned.substring(2, 4), 16)
    const b = parseInt(cleaned.substring(4, 6), 16)
    return { r, g, b }
  }
  return null
}

export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const { r, g, b } = rgb
  const sR = r / 255
  const sG = g / 255
  const sB = b / 255
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4)
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4)
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function wcagRating(ratio: number): {
  label: "AAA" | "AA" | "AA Large" | "Fail"
  color: "green" | "blue" | "yellow" | "red"
} {
  if (ratio >= 7) return { label: "AAA", color: "green" }
  if (ratio >= 4.5) return { label: "AA", color: "blue" }
  if (ratio >= 3) return { label: "AA Large", color: "yellow" }
  return { label: "Fail", color: "red" }
}

export function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)
}

export function generateShareId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  )
}
