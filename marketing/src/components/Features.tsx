const features = [
  {
    title: "Curated font pairings",
    description:
      "Browse 12+ hand-picked combinations across serif, sans-serif, display, handwriting, and monospace.",
  },
  {
    title: "Interactive playground",
    description:
      "Pick primary and secondary fonts, tune size, weight, line height, letter spacing, and gap with a live preview.",
  },
  {
    title: "Color tools",
    description:
      "Generate color-wheel schemes, 11-step monochromatic scales, and WCAG/APCA contrast checks in one place.",
  },
  {
    title: "Editable preview",
    description:
      "Click straight into the heading or body preview and type your own content to see how a pairing really reads.",
  },
  {
    title: "CSS export",
    description:
      "Copy production-ready CSS — including the Google Fonts import — with a single click.",
  },
  {
    title: "Brand theme builder",
    description:
      "Define color, typography, spacing, radius, and shadow tokens once, then export to CSS, Tailwind, JSON, or Figma.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-ink-100 bg-ink-50/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Everything you need to ship good typography
          </h2>
          <p className="mt-4 text-lg text-ink-700">
            One tool for exploring, testing, and exporting font and color
            decisions — instead of ten open tabs.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-ink-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
