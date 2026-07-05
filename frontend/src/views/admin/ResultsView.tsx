import { ScheduleTable } from '../../components/ScheduleTable'

// ─── ResultsView ──────────────────────────────────────────────────────────────
// Admin panel — Algorithm Results schedule grid.
// Renders an empty grid since data is loaded externally; passes no scheduleData
// so ScheduleTable shows an empty state.

export function ResultsView() {
  return (
    <div className="adm-page">
      <h1 className="adm-page__title">Algorithm Results</h1>
      <p className="adm-page__sub">
        View how the Backtracking Algorithm resolved conflicts for each student's schedule.
      </p>
      <ScheduleTable ariaLabel="Algorithm Results Schedule" />
    </div>
  )
}
