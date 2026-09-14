import { APP_URL } from "../config"

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center md:pt-24">
      <span className="inline-flex items-center rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
        1000+ curated combinations, free forever
      </span>

      <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
        Find your next font pairing in seconds
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-700">
        Browse curated Google Fonts combinations, preview them with your own
        content, build accessible color palettes, and export production-ready
        CSS — all without leaving the browser.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href={APP_URL}
          className="w-full rounded-full bg-brand-500 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:w-auto"
        >
          Start pairing fonts — it's free
        </a>
        <a
          href="#features"
          className="w-full rounded-full border border-ink-100 px-8 py-3 text-base font-semibold text-ink-900 transition-colors hover:border-brand-300 sm:w-auto"
        >
          See what's included
        </a>
      </div>
    </section>
  )
}
