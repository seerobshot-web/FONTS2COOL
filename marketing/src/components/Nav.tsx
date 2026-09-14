import { APP_URL } from "../config"

const links = [
  { label: "Features", href: "#features" },
  { label: "Colors", href: "#colors" },
  { label: "Pricing", href: "#pricing" },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="text-lg font-semibold tracking-tight text-ink-900">
          Fontpair<span className="text-brand-500">.co</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={APP_URL}
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Open the app
        </a>
      </div>
    </header>
  )
}
