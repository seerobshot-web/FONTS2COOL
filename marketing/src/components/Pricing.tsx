import { APP_URL } from "../config"

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-ink-100 bg-ink-50/60 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Free, with no catch
        </h2>
        <p className="mt-4 text-lg text-ink-700">
          Every feature on this page is free today: unlimited pairing
          exploration, the full playground, color tools, and the brand theme
          builder. Create a free account only if you want to save pairings
          and pick up where you left off.
        </p>

        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Free plan
          </p>
          <p className="mt-2 font-display text-4xl font-bold text-ink-900">$0</p>
          <ul className="mt-6 space-y-3 text-left text-sm text-ink-700">
            <li>Unlimited font pairing exploration</li>
            <li>Full color &amp; contrast toolkit</li>
            <li>Brand theme builder + exports</li>
            <li>Save &amp; share pairings with a free account</li>
          </ul>
          <a
            href={APP_URL}
            className="mt-8 block w-full rounded-full bg-brand-500 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Get started free
          </a>
        </div>
      </div>
    </section>
  )
}
