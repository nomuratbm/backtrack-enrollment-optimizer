import { TERMS, SCHOOL_YEARS, STUDENT_NAV, EMPTY_SCHEDULE } from '../../types'
import { ScheduleTable } from '../../components/ScheduleTable'

// ─── ScheduleView ─────────────────────────────────────────────────────────────
// Student "My Schedule" page — term tabs + weekly grid.

type Props = {
  activeNav: string
  activeTerm: string
  schoolYear: string
  onTermChange: (term: string) => void
  onYearChange: (year: string) => void
  onBack: () => void
}

export function ScheduleView({
  activeNav,
  activeTerm,
  schoolYear,
  onTermChange,
  onYearChange,
  onBack,
}: Props) {
  if (activeNav !== 'schedule') {
    // Placeholder page for unimplemented student nav items
    return (
      <div className="ph-page">
        <div className="ph-inner">
          <div className="ph-icon">📅</div>
          <h2 className="ph-heading">
            {STUDENT_NAV.find(n => n.id === activeNav)?.label ?? 'Page'}
          </h2>
          <p className="ph-body">This section is under development.</p>
          <button className="ph-btn" onClick={onBack}>
            ← Back to My Schedule
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="sched-page">
      <h1 className="sched-page__title">My Schedule</h1>

      <div className="sched-controls">
        <label className="sched-controls__label" htmlFor="sy-sel">School Year</label>
        <select
          id="sy-sel"
          className="sched-controls__select"
          value={schoolYear}
          onChange={e => onYearChange(e.target.value)}
        >
          {SCHOOL_YEARS.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      <div className="term-tabs" role="tablist" aria-label="Academic Terms">
        {TERMS.map(t => (
          <button
            key={t}
            id={`tab-${t.replace(' ', '-').toLowerCase()}`}
            role="tab"
            aria-selected={activeTerm === t}
            className={`term-tab${activeTerm === t ? ' term-tab--active' : ''}`}
            onClick={() => onTermChange(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <ScheduleTable scheduleData={EMPTY_SCHEDULE} ariaLabel="Weekly Schedule" />
    </div>
  )
}
