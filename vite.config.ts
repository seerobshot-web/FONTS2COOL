import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/FONTS2COOL/" : "/",
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
})
