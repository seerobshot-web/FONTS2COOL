import { APP_URL } from "../config"

export function Footer() {
  return (
    <footer className="border-t border-ink-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-ink-700 sm:flex-row">
        <p>Fontpair.co — free font pairing &amp; color tools built on Google Fonts.</p>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-brand-600">
            Features
          </a>
          <a href="#colors" className="hover:text-brand-600">
            Colors
          </a>
          <a href={APP_URL} className="font-medium text-brand-600 hover:text-brand-700">
            Open the app
          </a>
        </div>
      </div>
    </footer>
  )
}
