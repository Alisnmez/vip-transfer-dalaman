import { useState, type MouseEvent } from 'react'

type CalendarEvent = {
  time: string
  title: string
  route: string
  icon: string
  borderClass: string
  timeClass: string
  meta?: string
  driver?: string
  vehicle?: string
}

const weekDays = [
  { name: 'Monday', day: '14' },
  { name: 'Tuesday', day: '15' },
  { name: 'Wednesday', day: '16' },
  { name: 'Thursday', day: '17', active: true },
  { name: 'Friday', day: '18' },
  { name: 'Saturday', day: '19' },
  { name: 'Sunday', day: '20' },
]

const calendarCells: Array<{ key: string; events?: CalendarEvent[]; empty?: boolean; today?: boolean; muted?: boolean; placeholder?: boolean }> = [
  {
    key: 'mon',
    events: [
      {
        time: '09:15',
        title: 'Julian V. Richards',
        route: 'DLM → Marmaris Marina',
        icon: 'flight_land',
        borderClass: 'border-l-primary',
        timeClass: 'text-primary bg-primary/5',
        meta: 'VIP-01',
        vehicle: 'Mercedes S-Class',
        driver: 'Ahmed K.',
      },
    ],
  },
  {
    key: 'tue',
    events: [
      {
        time: '14:30',
        title: 'Sofia G. Petrov',
        route: 'Hillside → DLM',
        icon: 'stars',
        borderClass: 'border-l-secondary',
        timeClass: 'text-secondary bg-secondary/5',
        driver: 'Ahmed K.',
      },
    ],
  },
  { key: 'wed', empty: true },
  {
    key: 'thu',
    today: true,
    events: [
      {
        time: '10:00',
        title: 'Luggage #402',
        route: '12 Pax - Fethiye',
        icon: 'inventory_2',
        borderClass: 'border-l-slate-400',
        timeClass: 'text-slate-600 bg-slate-50',
      },
      {
        time: '12:15',
        title: 'Robert D. Sterling',
        route: 'Gokova → DLM',
        icon: 'flight_takeoff',
        borderClass: 'border-l-primary',
        timeClass: 'text-primary bg-primary/5',
        vehicle: 'BMW 7 Series',
      },
    ],
  },
  {
    key: 'fri',
    events: [
      {
        time: '16:45',
        title: 'DELAY: Hans Mueller',
        route: 'DLM → Turunc',
        icon: 'report',
        borderClass: 'border-l-error',
        timeClass: 'text-error bg-error/5',
        driver: 'Mehmet S.',
        vehicle: 'V-Class XL',
      },
    ],
  },
  {
    key: 'sat',
    events: [
      {
        time: '08:00',
        title: 'Event Transfer',
        route: 'D-Resort Göcek',
        icon: 'groups',
        borderClass: 'border-l-primary',
        timeClass: 'text-primary bg-primary/5',
      },
    ],
  },
  {
    key: 'sun',
    events: [
      {
        time: '22:00',
        title: 'Elena K. Night Arrv.',
        route: 'DLM → Bodrum',
        icon: 'nights_stay',
        borderClass: 'border-l-secondary',
        timeClass: 'text-secondary bg-secondary/5',
      },
    ],
  },
  { key: 'mon-2', muted: true },
  { key: 'tue-2', muted: true, placeholder: true },
  { key: 'wed-2', muted: true },
  { key: 'thu-2', today: true },
  { key: 'fri-2', muted: true },
  { key: 'sat-2', muted: true },
  { key: 'sun-2', muted: true },
]

const agendaItems = [
  {
    time: '09:15 AM',
    status: 'Assigned',
    title: 'Julian V. Richards',
    route: 'DLM → Marmaris Marina',
    vehicle: 'Mercedes S-Class',
    driver: 'Ahmed K.',
    statusClass: 'bg-primary/10 text-primary',
    timeClass: 'text-primary',
  },
  {
    time: '12:15 PM',
    status: 'In Progress',
    title: 'Robert D. Sterling',
    route: 'Gokova → DLM',
    vehicle: 'BMW 7 Series',
    driver: 'Unassigned',
    statusClass: 'bg-secondary/10 text-secondary',
    timeClass: 'text-primary',
  },
  {
    time: '04:45 PM',
    status: 'Delayed',
    title: 'Hans Mueller',
    route: 'DLM → Turunc',
    vehicle: 'V-Class XL',
    driver: 'Mehmet S.',
    statusClass: 'bg-error/10 text-error',
    timeClass: 'text-error',
  },
]

export function CalendarPage() {
  const [selectedView, setSelectedView] = useState('Week')
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 })

  const showTooltip = (event: MouseEvent<HTMLDivElement>) => {
    setTooltip({ visible: true, x: event.clientX + 25, y: event.clientY - 40 })
  }

  const moveTooltip = (event: MouseEvent<HTMLDivElement>) => {
    setTooltip((current) => ({
      ...current,
      x: event.clientX + 25,
      y: event.clientY - 40,
    }))
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background text-on-surface font-body-md">
      <header className="h-16 bg-white px-gutter flex items-center justify-between border-b border-outline-variant shrink-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-surface-container-low p-1 rounded">
            {['Month', 'Week', 'Day'].map((view) => (
              <button
                className={`px-4 py-1 font-label-sm rounded ${
                  selectedView === view
                    ? 'bg-white text-primary shadow-sm border border-outline-variant/50'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                key={view}
                onClick={() => setSelectedView(view)}
              >
                {view}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-surface-container-low rounded-full text-on-surface-variant">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h2 className="font-title-md text-on-surface min-w-[160px] text-center">
              Oct 14 — 20, 2024
            </h2>
            <button className="p-1 hover:bg-surface-container-low rounded-full text-on-surface-variant">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              className="pl-9 pr-4 py-2 bg-white border border-outline-variant rounded text-sm w-64 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-on-surface-variant/50"
              placeholder="Global search..."
              type="text"
            />
          </div>
          <div className="h-6 w-px bg-outline-variant" />
          <button className="p-2 text-on-surface-variant hover:text-primary relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-white" />
          </button>
        </div>
      </header>

      <div className="flex-grow overflow-auto bg-background">
        <div className="grid grid-cols-7 border-b border-outline-variant sticky top-0 bg-white z-30 shadow-sm">
          {weekDays.map((day) => (
            <div
              className={`py-3 text-center border-r border-outline-variant ${
                day.active ? 'bg-primary/[0.03]' : ''
              }`}
              key={day.name}
            >
              <p
                className={`font-label-sm uppercase tracking-tighter text-[10px] ${
                  day.active
                    ? 'text-secondary font-bold'
                    : 'text-on-surface-variant'
                }`}
              >
                {day.name}
              </p>
              <p
                className={`text-xl font-black ${
                  day.active ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {day.day}
              </p>
            </div>
          ))}
        </div>

        <div className="calendar-grid min-h-full">
          {calendarCells.map((cell, index) => (
            <div
              className={`border-b border-outline-variant p-3 relative group ${
                index % 7 !== 6 ? 'border-r' : ''
              } ${cell.muted ? 'bg-slate-50/30' : ''} ${
                cell.today ? 'bg-primary/[0.03] border-t-2 border-t-secondary' : ''
              } ${cell.events ? 'flex flex-col gap-3' : ''}`}
              key={cell.key}
              onClick={() => setAgendaOpen(true)}
            >
              <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 text-on-surface-variant hover:bg-primary hover:text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10 shadow-sm">
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>

              {cell.empty && (
                <div className="h-full border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/30 transition-colors">
                  <span className="material-symbols-outlined text-outline-variant">
                    add
                  </span>
                </div>
              )}

              {cell.placeholder && (
                <div className="event-card bg-white border-2 border-dashed border-outline-variant p-3 rounded opacity-60">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                    Unassigned
                  </p>
                  <div className="h-4 w-2/3 bg-slate-100 rounded" />
                </div>
              )}

              {cell.events?.map((item) => (
                <div
                  className={`event-card bg-white border border-outline-variant border-l-4 ${item.borderClass} p-3 rounded shadow-sm cursor-pointer`}
                  key={`${cell.key}-${item.time}-${item.title}`}
                  onMouseEnter={showTooltip}
                  onMouseLeave={() => setTooltip((current) => ({ ...current, visible: false }))}
                  onMouseMove={moveTooltip}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${item.timeClass}`}
                    >
                      {item.time}
                    </span>
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        item.borderClass.includes('error')
                          ? 'text-error'
                          : item.borderClass.includes('secondary')
                            ? 'text-secondary'
                            : 'text-on-surface-variant'
                      }`}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-bold truncate ${
                      item.borderClass.includes('error')
                        ? 'text-error'
                        : 'text-on-surface'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-[11px] text-on-surface-variant truncate font-medium uppercase">
                    {item.route}
                  </p>
                  {(item.meta || item.driver) && (
                    <div className="mt-3 pt-2 border-t border-outline-variant flex items-center justify-between">
                      {item.meta ? (
                        <>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                              directions_car
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-medium">
                              {item.meta}
                            </span>
                          </div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded font-bold">
                            CAT-A
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[10px] text-secondary">
                              person
                            </span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant font-bold">
                            {item.driver}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="h-12 bg-white border-t border-outline-variant px-gutter flex items-center justify-between shrink-0 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6">
          <Legend color="bg-primary" label="Assigned" />
          <Legend color="bg-secondary" label="Highlight / Active" />
          <Legend color="bg-error" label="Action Required" />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 border-r border-outline-variant pr-6">
            <span className="text-[11px] font-medium text-on-surface-variant">
              OPS CONNECTIVITY:
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-600">STABLE</span>
          </div>
          <p className="text-[10px] font-mono text-on-surface-variant">
            UTC +3 | 14:02:55
          </p>
        </div>
      </footer>

      <aside
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-outline-variant z-[60] transform transition-transform duration-300 flex flex-col ${
          agendaOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-white">
          <div>
            <h3 className="font-title-md text-primary">Daily Agenda</h3>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Thursday, Oct 17
            </p>
          </div>
          <button
            className="p-1 hover:bg-outline-variant/20 rounded-full"
            onClick={() => setAgendaOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-grow overflow-auto p-4 space-y-4">
          {agendaItems.map((item) => (
            <div
              className="p-3 border border-outline-variant rounded-lg hover:border-primary/50 cursor-pointer transition-all bg-white shadow-sm group"
              key={`${item.time}-${item.title}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-black ${item.timeClass}`}>
                  {item.time}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.statusClass}`}
                >
                  {item.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
              <p className="text-[11px] text-on-surface-variant mb-3">
                {item.route}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/50">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                    directions_car
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-medium">
                    {item.vehicle}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    item.driver === 'Unassigned'
                      ? 'text-on-surface-variant italic'
                      : 'text-secondary'
                  }`}
                >
                  {item.driver}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-outline-variant">
          <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded uppercase tracking-wider hover:brightness-110 transition-all">
            View Full Day Schedule
          </button>
        </div>
      </aside>

      {tooltip.visible && (
        <div
          className="fixed pointer-events-none z-[100] bg-white p-5 rounded shadow-2xl border border-primary/10 w-80"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-primary font-black text-sm uppercase tracking-tight">
                MISSION #TRX-9942
              </h3>
              <p className="text-[10px] text-on-surface-variant font-bold">
                PRIORITY ALPHA
              </p>
            </div>
            <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold">
              TRACKING
            </span>
          </div>
          <div className="space-y-3">
            <DetailRow label="Passenger" value="Julian V. Richards" />
            <DetailRow label="Asset" value="Mercedes S-Class 2024" />
            <div className="pt-2">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                  Transit Completion
                </span>
                <span className="text-[10px] text-primary font-bold">67%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-2/3" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
      <span className="text-[11px] text-on-surface-variant font-medium">
        {label}
      </span>
      <span className="text-xs text-on-surface font-bold">{value}</span>
    </div>
  )
}
