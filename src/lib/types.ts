export interface Font {
  id: string
  family: string
  category: string
  weights: number[]
  google_fonts_url: string
  x_height: string | null
  ascender: string | null
  descender: string | null
  glyph_count: number
  created_at: string
}

export interface Pairing {
  id: string
  user_id: string
  primary_font_id: string
  secondary_font_id: string
  heading_size: number
  body_size: number
  line_height: number
  letter_spacing: number
  bg_color: string
  text_color: string
  sample_text: string
  share_id: string | null
  created_at: string
  primary_font?: Font
  secondary_font?: Font
}

export interface ColorPalette {
  id: string
  user_id: string
  name: string
  colors: string[]
  created_at: string
}

export interface BrandTheme {
  id: string
  user_id: string | null
  name: string
  tokens: BrandThemeTokens
  is_preset: boolean
  created_at: string
}

export interface BrandThemeTokens {
  colors: {
    primary: string
    secondary: string
    accent: string
    neutral: string
    background: string
    surface: string
    border: string
    error: string
    warning: string
    success: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    headingSize: string
    bodySize: string
    headingWeight: string
    bodyWeight: string
    lineHeight: string
    letterSpacing: string
  }
  spacing: {
    baseUnit: string
    radius: string
    shadow: string
  }
}

export const defaultTokens: BrandThemeTokens = {
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#a78bfa",
    neutral: "#94a3b8",
    background: "#ffffff",
    surface: "#f8fafc",
    border: "#e2e8f0",
    error: "#ef4444",
    warning: "#f59e0b",
    success: "#22c55e",
  },
  typography: {
    headingFont: "Playfair Display",
    bodyFont: "Inter",
    headingSize: "48",
    bodySize: "16",
    headingWeight: "700",
    bodyWeight: "400",
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  spacing: {
    baseUnit: "4",
    radius: "8",
    shadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
}

export interface PlaygroundState {
  primaryFontId: string | null
  secondaryFontId: string | null
  headingWeight: number
  bodyWeight: number
  headingSize: number
  bodySize: number
  lineHeight: number
  letterSpacing: number
  gap: number
  bgColor: string
  textColor: string
  headingText: string
  bodyText: string
}
