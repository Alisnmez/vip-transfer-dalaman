export function DispatchHubPage() {
  return (
    <section className="p-8 space-y-6">
      <div>
        <h1 className="font-title-lg text-title-lg text-on-surface">
          Dispatch Hub
        </h1>
        <p className="text-on-surface-variant mt-1">
          Assign drivers and monitor active transfer operations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h2 className="font-title-md text-title-md mb-4">Waiting Assignment</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-error/5 border border-error/20">
              <p className="font-bold">Göcek Marina → DLM Airport</p>
              <p className="text-label-sm text-on-surface-variant">
                Driver assignment required.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-error/5 border border-error/20">
              <p className="font-bold">Dalaman → Marmaris</p>
              <p className="text-label-sm text-on-surface-variant">
                Vehicle confirmation required.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="font-title-md text-title-md mb-4">Drivers On Duty</h2>
          <div className="space-y-3">
            {['Mehmet T.', 'Burak Y.', 'Can K.'].map((driver) => (
              <div
                className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low"
                key={driver}
              >
                <span>{driver}</span>
                <span className="text-status-closed text-label-sm font-bold">
                  Available
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
