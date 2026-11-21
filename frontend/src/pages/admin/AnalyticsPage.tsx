const metrics = [
  { label: 'Website Visitors', description: 'Awaiting privacy-compliant analytics integration' },
  { label: 'Completed Transfers', description: 'Awaiting verified booking data' },
  { label: 'Commission Revenue', description: 'Awaiting completed-transfer commission records' },
]

export function AnalyticsPage() {
  return (
    <section className="p-4 sm:p-6 lg:p-8 space-y-6 min-w-0">
      <div>
        <h1 className="font-title-lg text-title-lg text-on-surface">Analytics</h1>
        <p className="text-on-surface-variant mt-1">
          Visitor, booking and commission performance. Only verified data will be shown.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {metrics.map((metric) => (
          <div className="glass-card rounded-xl p-5" key={metric.label}>
            <p className="text-on-surface-variant font-label-sm uppercase tracking-wider">
              {metric.label}
            </p>
            <p className="text-2xl font-bold text-on-surface mt-2">No data yet</p>
            <p className="text-sm text-on-surface-variant mt-2">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5 sm:p-6">
        <h2 className="font-title-md text-title-md">Performance Charts</h2>
        <div className="mt-4 min-h-40 rounded-lg border border-dashed border-outline-variant flex flex-col items-center justify-center text-center p-6" role="status">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant" aria-hidden="true">bar_chart</span>
          <p className="font-semibold mt-2">Charts are not available yet</p>
          <p className="text-sm text-on-surface-variant mt-1 max-w-lg">
            Revenue, countries, devices and conversion charts will appear after their data sources are connected.
            No example figures are presented as real business results.
          </p>
        </div>
      </div>
    </section>
  )
}
