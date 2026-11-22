import { Link } from 'react-router-dom'
import { travelGuides } from '../../content/guides'
import { PublicNavbar } from './PublicNavbar'
import { useLanguage } from '../../shared/localization/language'

export function GuidesIndexPage() {
  const { language } = useLanguage()
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <section className="mx-auto max-w-container-max px-gutter py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-on-surface-variant"><Link className="underline" to="/">Home</Link> <span aria-hidden="true">/</span> Travel Guides</nav>
          <header className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">Dalaman & the Turquoise Coast</p>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-on-surface sm:text-5xl">Travel Guides for your time on the Turquoise Coast</h1>
            <p className="text-lg leading-8 text-on-surface-variant">Original ideas for history, coast and local character. Choose a place to explore, then plan your private airport pickup around the trip you want to have.</p>
          </header>

          <div className="grid gap-5 md:grid-cols-2">
            {travelGuides.map((guide) => {
              const article = 'translations' in guide ? guide.translations[language] : guide
              return <article className="flex h-full flex-col rounded-2xl border border-outline bg-white p-6 shadow-sm sm:p-8" key={guide.path}>
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-secondary">{article.category}</p>
                <h2 className="mb-3 text-2xl font-bold leading-snug text-on-surface">{article.title}</h2>
                <p className="mb-6 flex-1 leading-7 text-on-surface-variant">{article.cardDescription}</p>
                <Link className="font-bold text-secondary underline underline-offset-4" to={guide.path}>Explore this guide <span aria-hidden="true">→</span></Link>
              </article>
            })}
          </div>

          <aside className="mt-10 flex flex-col justify-between gap-5 rounded-2xl bg-primary p-7 text-white sm:flex-row sm:items-center sm:p-9">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Ready to explore?</h2>
              <p className="max-w-2xl leading-7 text-white/80">Request a private Dalaman Airport transfer and share the destination, flight and group details for your trip.</p>
            </div>
            <Link className="shrink-0 rounded-lg bg-secondary px-5 py-3 text-center font-bold text-on-secondary" to="/booking">Plan your pickup</Link>
          </aside>
        </section>
      </main>
    </>
  )
}
