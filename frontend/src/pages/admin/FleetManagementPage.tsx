export function FleetManagementPage() {
  return (
    <section className="p-8 space-y-6">
      <div>
        <h1 className="font-title-lg text-title-lg text-on-surface">
          Fleet Management
        </h1>
        <p className="text-on-surface-variant mt-1">
          Manage vehicles, capacity, availability, and service status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Mercedes Vito', 'VW Transporter', 'Executive Sedan'].map((vehicle) => (
          <div className="glass-card rounded-xl p-5" key={vehicle}>
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-admin-primary">
                directions_car
              </span>
              <span className="bg-status-closed/10 text-status-closed px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                Active
              </span>
            </div>
            <h2 className="font-title-md text-title-md">{vehicle}</h2>
            <p className="text-on-surface-variant text-label-sm mt-1">
              Vehicle profile placeholder.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
