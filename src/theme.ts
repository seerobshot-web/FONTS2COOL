import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

// Font2Color brand system. Same palette and type pairing as the marketing
// site (marketing/src/index.css) — Teal primary, Charcoal secondary,
// Playfair Display for headings, Inter for body/UI.
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#F3FCFC" },
          100: { value: "#E2F8F8" },
          200: { value: "#C1F1F0" },
          300: { value: "#93E6E5" },
          400: { value: "#61DBD9" },
          500: { value: "#155C5B" },
          600: { value: "#114A49" },
          700: { value: "#0D3737" },
          800: { value: "#092726" },
          900: { value: "#051818" },
          950: { value: "#030D0D" },
        },
        ink: {
          50: { value: "#F7F8F8" },
          100: { value: "#ECEEEE" },
          200: { value: "#D7DADA" },
          300: { value: "#BABEBF" },
          400: { value: "#9AA0A2" },
          500: { value: "#313435" },
          600: { value: "#272A2A" },
          700: { value: "#1D1F20" },
          800: { value: "#151616" },
          900: { value: "#0D0E0E" },
          950: { value: "#070707" },
        },
      },
      fonts: {
        heading: { value: "'Playfair Display', serif" },
        body: { value: "'Inter', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        // Registers "brand" as a usable colorPalette (colorPalette="brand"
        // on Button, Tag, IconButton, etc.), the same way Chakra's built-in
        // palettes like "blue" or "teal" work.
        brand: {
          solid: { value: "{colors.brand.600}" },
          contrast: { value: "{colors.brand.50}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.50}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
