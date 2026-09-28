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
        // on Button, Tag, IconButton, etc.), mirroring the exact shape (and
        // light/dark pairing) Chakra's own built-in palettes like "blue"
        // use — see @chakra-ui/react's theme/semantic-tokens/colors.js.
        // Without the _dark half, anything reading brand.fg (ghost/outline
        // button and link text) stays at the light-mode shade and loses
        // contrast against a dark background.
        brand: {
          contrast: { value: { _light: "white", _dark: "white" } },
          fg: { value: { _light: "{colors.brand.700}", _dark: "{colors.brand.300}" } },
          subtle: { value: { _light: "{colors.brand.100}", _dark: "{colors.brand.900}" } },
          muted: { value: { _light: "{colors.brand.200}", _dark: "{colors.brand.800}" } },
          emphasized: { value: { _light: "{colors.brand.300}", _dark: "{colors.brand.700}" } },
          solid: { value: { _light: "{colors.brand.600}", _dark: "{colors.brand.600}" } },
          focusRing: { value: { _light: "{colors.brand.500}", _dark: "{colors.brand.500}" } },
          border: { value: { _light: "{colors.brand.500}", _dark: "{colors.brand.400}" } },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
