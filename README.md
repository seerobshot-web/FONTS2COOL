# Fontpair.co

Discover and test free font pairings using Google Fonts. Browse curated combinations, preview with your own content, adjust colors and spacing, and save your favorites.

## Features

- **Curated Font Pairings** - Browse 12+ hand-picked font combinations across serif, sans-serif, display, handwriting, and monospace categories
- **Interactive Playground** - Select primary and secondary fonts, adjust sizes, weights, line height, letter spacing, and gap with live preview
- **Color Tools** - Generate color-wheel schemes, 11-step monochromatic scales, style-based palettes, WCAG/APCA contrast checks, and multi-format color values
- **Editable Preview** - Click directly on heading or body text in the preview to type your own content
- **CSS Export** - Copy production-ready CSS with one click, including Google Fonts import links
- **Color Palettes** - Browse 12 curated color palettes with WCAG contrast ratings, create your own, and export as CSS variables or Tailwind config
- **Brand Theme Builder** - Create reusable color, typography, spacing, radius, and shadow tokens with live previews and CSS, Tailwind, JSON, and Figma exports
- **Save & Share** - Save pairings to your account, generate shareable links, and view shared pairings without an account
- **Dark/Light Mode** - Toggle between dark and light themes
- **Responsive Design** - Works on mobile, tablet, and desktop
- **MCP Color Tools** - Agent configuration includes Colors & Fonts palette tools plus color-wheel scheme generation tools
- **55+ Google Fonts** - Searchable database of fonts with metadata (category, weights, x-height, glyph count)

## MCP Setup

The project includes two local MCP servers for AI-assisted branded UI work:

- `@colorsandfonts/mcp` - palette generation, monochromatic scales, contrast checks, color conversion, and exports.
- `deepakkumardewani/color-scheme-mcp` - monochrome, analogic, complement, triad, and quad color-wheel schemes.

The configuration is stored in `.mcp.json`. Restart your MCP client after opening the project to load the tools.

## Brand UI/UX Tokens

A consistent branded interface needs more than a primary color. The Brand Theme Builder covers semantic colors (primary, secondary, accent, surface, border, error, warning, and success), typography roles, spacing, radius, and shadows. Export the resulting tokens to CSS, Tailwind, JSON, or Figma-compatible JSON so the same visual language can be used across web, design, and product surfaces.

## Tech Stack

- React 19 with TypeScript
- Chakra UI v3 (component library and design system)
- Vite (build tool and dev server)
- Supabase (database, authentication)
- React Router (client-side routing)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or your preferred package manager

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd fontpair
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your Supabase project URL and anon key. These are pre-populated in the hosted environment.

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Database Schema

- **fonts** - Font metadata (family, category, weights, Google Fonts URL, metrics)
- **pairings** - Saved font pairings with user ownership and shareable links
- **color_palettes** - User-saved color palettes

All tables have Row Level Security enabled:
- Fonts are publicly readable
- Pairings and palettes are owner-scoped (only the creator can modify)
- Shared pairings are viewable by anyone via a share ID

## Pages

- `/` - Explore curated pairings with search and filters
- `/playground` - Interactive font pairing playground with color picker
- `/colors` - Color palette browser, color-wheel generator, palette generator, monochromatic scale, and contrast checker
- `/brand-theme` - Brand token editor with live branded UI preview and export tools
- `/my-pairings` - Your saved pairings (requires sign-in)
- `/share/:id` - Public shared pairing view
- `/login` - Sign in page
- `/signup` - Create account page
