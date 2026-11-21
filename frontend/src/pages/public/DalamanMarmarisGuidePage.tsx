import { Link } from 'react-router-dom'
import { PublicNavbar } from './PublicNavbar'
import { dalamanMarmarisGuide as guide } from '../../content/guides/dalaman-marmaris'

export function DalamanMarmarisGuidePage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <article className="mx-auto max-w-4xl px-gutter py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-on-surface-variant">
            <Link className="underline" to="/">Home</Link> <span aria-hidden="true">/</span> Travel guides <span aria-hidden="true">/</span> Marmaris
          </nav>
          <header className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">Dalaman airport travel guide</p>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-on-surface sm:text-5xl">{guide.title}</h1>
            <p className="text-lg leading-8 text-on-surface-variant">{guide.intro}</p>
            <p className="mt-4 text-sm text-on-surface-variant">Reviewed: {guide.reviewed} · Public transport details can change; check the linked operators before departure.</p>
          </header>

          <div className="space-y-10 text-on-surface">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-4 text-2xl font-bold">{section.heading}</h2>
                {'paragraphs' in section && section.paragraphs?.map((paragraph) => <p className="mb-4 leading-7 text-on-surface-variant" key={paragraph}>{paragraph}</p>)}
                {'options' in section && section.options && (
                  <div className="overflow-x-auto rounded-xl border border-outline bg-white">
                    <table className="w-full min-w-[620px] border-collapse text-left">
                      <thead><tr className="border-b border-outline bg-background"><th className="p-4">Option</th><th className="p-4">May suit</th><th className="p-4">Check before choosing</th></tr></thead>
                      <tbody>{section.options.map((option) => <tr className="border-b border-outline last:border-0" key={option.name}><th scope="row" className="p-4 align-top">{option.name}</th><td className="p-4 align-top text-on-surface-variant">{option.bestFor}</td><td className="p-4 align-top text-on-surface-variant">{option.check}</td></tr>)}</tbody>
                    </table>
                  </div>
                )}
                {'bullets' in section && section.bullets && <ul className="list-disc space-y-3 pl-6 leading-7 text-on-surface-variant">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
                {'faqs' in section && section.faqs && <div className="space-y-5">{section.faqs.map((faq) => <div key={faq.question}><h3 className="mb-2 text-lg font-semibold">{faq.question}</h3><p className="leading-7 text-on-surface-variant">{faq.answer}</p></div>)}</div>}
              </section>
            ))}
          </div>

          <aside className="my-12 rounded-2xl bg-primary p-7 text-white sm:p-9">
            <h2 className="mb-3 text-2xl font-bold">Prefer a pre-arranged ride to Marmaris?</h2>
            <p className="mb-6 leading-7 text-white/80">Compare the available vehicle options and review the route estimate in the booking flow before sending a request.</p>
            <div className="flex flex-wrap gap-4">
              <Link className="rounded-lg bg-secondary px-5 py-3 font-bold text-on-secondary" to="/routes/marmaris">View Dalaman to Marmaris transfer</Link>
              <Link className="rounded-lg border border-white/50 px-5 py-3 font-bold text-white" to="/booking?destination=Marmaris">Check booking options</Link>
            </div>
          </aside>

          <section className="border-t border-outline pt-8">
            <h2 className="mb-4 text-xl font-bold">Official information</h2>
            <ul className="list-disc space-y-2 pl-6 text-on-surface-variant">
              {guide.sources.map((source) => <li key={source.url}><a className="underline underline-offset-2" href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}
            </ul>
          </section>

          <nav aria-label="Related pages" className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-outline pt-6 text-sm font-semibold">
            <Link className="text-secondary underline" to="/routes/marmaris">Marmaris transfer route</Link>
            <Link className="text-secondary underline" to="/vehicles">Compare vehicle options</Link>
            <Link className="text-secondary underline" to="/faq">Transfer booking FAQs</Link>
          </nav>
        </article>
      </main>
    </>
  )
}
