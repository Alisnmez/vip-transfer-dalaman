import { Link } from 'react-router-dom'
import { travelGuides } from '../../content/guides'
import { PublicNavbar } from './PublicNavbar'

type Guide = (typeof travelGuides)[number]

export function TravelGuidePage({ guide }: { guide: Guide }) {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <article className="mx-auto max-w-4xl px-gutter py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-on-surface-variant">
            <Link className="underline" to="/">Home</Link> <span aria-hidden="true">/</span>{' '}
            <Link className="underline" to="/guides">Travel Guides</Link> <span aria-hidden="true">/</span> {guide.destination}
          </nav>
          <header className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">{guide.category}</p>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-on-surface sm:text-5xl">{guide.title}</h1>
            <p className="text-lg leading-8 text-on-surface-variant">{guide.intro}</p>
            <p className="mt-4 text-sm text-on-surface-variant">Updated: {guide.reviewed} · Check current opening information and local notices before visiting.</p>
          </header>

          <div className="space-y-10 text-on-surface">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-4 text-2xl font-bold">{section.heading}</h2>
                {'paragraphs' in section && section.paragraphs?.map((paragraph) => <p className="mb-4 leading-7 text-on-surface-variant" key={paragraph}>{paragraph}</p>)}
                {'bullets' in section && section.bullets && <ul className="list-disc space-y-3 pl-6 leading-7 text-on-surface-variant">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
                {'faqs' in section && section.faqs && <div className="space-y-5">{section.faqs.map((faq) => <div key={faq.question}><h3 className="mb-2 text-lg font-semibold">{faq.question}</h3><p className="leading-7 text-on-surface-variant">{faq.answer}</p></div>)}</div>}
              </section>
            ))}
          </div>

          <aside className="my-12 rounded-2xl bg-primary p-7 text-white sm:p-9">
            <h2 className="mb-3 text-2xl font-bold">Make more time for your {guide.destination} plans</h2>
            <p className="mb-6 leading-7 text-white/80">Arrange a private Dalaman Airport pickup and plan your first day around the places you want to see.</p>
            <div className="flex flex-wrap gap-4">
              <Link className="rounded-lg bg-secondary px-5 py-3 font-bold text-on-secondary" to={`/routes/${guide.destinationSlug}`}>View private transfers to {guide.transferDestination}</Link>
              <Link className="rounded-lg border border-white/50 px-5 py-3 font-bold text-white" to={`/booking?destination=${encodeURIComponent(guide.transferDestination)}`}>Plan your pickup</Link>
            </div>
          </aside>

          <section className="border-t border-outline pt-8">
            <h2 className="mb-4 text-xl font-bold">Further reading</h2>
            <ul className="list-disc space-y-2 pl-6 text-on-surface-variant">
              {guide.sources.map((source) => <li key={source.url}><a className="underline underline-offset-2" href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}
            </ul>
          </section>

          <nav aria-label="Related pages" className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-outline pt-6 text-sm font-semibold">
            <Link className="text-secondary underline" to="/guides">Explore all travel guides</Link>
            <Link className="text-secondary underline" to={`/routes/${guide.destinationSlug}`}>{guide.transferDestination} transfer details</Link>
            <Link className="text-secondary underline" to="/vehicles">Compare private vehicles</Link>
          </nav>
        </article>
      </main>
    </>
  )
}
