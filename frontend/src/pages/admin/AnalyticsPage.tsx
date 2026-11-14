const metrics = [
  { label: 'Weekly Revenue', value: '€8,420' },
  { label: 'Completed Transfers', value: '126' },
  { label: 'Average Booking Value', value: '€66.80' },
]

export function AnalyticsPage() {
  return (
    <section className="p-8 space-y-6">
      <div>
        <h1 className="font-title-lg text-title-lg text-on-surface">Analytics</h1>
        <p className="text-on-surface-variant mt-1">
          Simple operational and revenue metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div className="glass-card rounded-xl p-5" key={metric.label}>
            <p className="text-on-surface-variant font-label-sm uppercase tracking-wider">
              {metric.label}
            </p>
            <p className="text-3xl font-extrabold text-admin-primary mt-2">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="font-title-md text-title-md mb-6">Revenue Overview</h2>
        <div className="flex items-end gap-3 h-48">
          {['35%', '55%', '45%', '80%', '65%', '90%', '72%'].map((height) => (
            <div className="flex-1 bg-surface-container-low rounded-t-lg relative" key={height}>
              <div
                className="absolute bottom-0 w-full bg-admin-primary rounded-t-lg"
                style={{ height }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
