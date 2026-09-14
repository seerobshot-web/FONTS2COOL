const swatches = [
  { name: "Teal", classes: "bg-brand-500" },
  { name: "Charcoal", classes: "bg-ink-500" },
  { name: "Olive", classes: "bg-[#6c7549]" },
  { name: "Lime", classes: "bg-[#acc84c]" },
]

export function ColorShowcase() {
  return (
    <section id="colors" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Palettes built for real interfaces, not mood boards
            </h2>
            <p className="mt-4 text-lg text-ink-700">
              Every curated palette ships with WCAG contrast ratings, so you
              can tell at a glance whether a combination is safe for body
              text — not just pretty in a swatch.
            </p>
            <ul className="mt-6 space-y-3 text-ink-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                11-step monochromatic scales generated from any base color
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Color-wheel schemes: monochrome, analogous, complementary, triad, quad
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Export as CSS variables, Tailwind config, or Figma tokens
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {swatches.map((swatch) => (
              <div
                key={swatch.name}
                className={`flex h-32 items-end rounded-2xl p-4 shadow-sm ${swatch.classes}`}
              >
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-900">
                  {swatch.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
