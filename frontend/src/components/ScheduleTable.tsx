import { DAYS, TIME_SLOTS, type ScheduleData } from '../types'

// ─── ScheduleTable ────────────────────────────────────────────────────────────
// Shared weekly schedule grid used in both student and admin views.
// Static JSX (header row) is derived from module-level constants, satisfying
// rendering-hoist-jsx: all loop sources are hoisted outside component scope.

type Props = {
  /** Optional schedule data; when omitted renders an empty grid */
  scheduleData?: ScheduleData
  ariaLabel?: string
}

export function ScheduleTable({ scheduleData, ariaLabel = 'Weekly Schedule' }: Props) {
  return (
    <div className="tbl-wrap">
      <div className="tbl-scroll">
        <table className="sched-tbl" aria-label={ariaLabel}>
          <thead>
            <tr>
              <th className="tbl-th tbl-th--time" scope="col">Time</th>
              {DAYS.map(day => (
                <th
                  key={day}
                  scope="col"
                  className={`tbl-th tbl-th--day${day === 'Saturday' ? ' tbl-th--sat' : ''}`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot, si) => (
              <tr key={si} className="tbl-tr">
                <td className="tbl-td--time">
                  <span className="tbl-time-from">{slot.start}</span>
                  <span className="tbl-time-to">{slot.end}</span>
                </td>
                {DAYS.map(day => {
                  const entry = scheduleData ? scheduleData[si][day] : null
                  return (
                    <td
                      key={day}
                      className={[
                        'tbl-td',
                        day === 'Saturday' ? 'tbl-td--sat' : '',
                        entry ? 'tbl-td--filled' : '',
                      ].filter(Boolean).join(' ')}
                    >
                      {entry ? (
                        <div className="cc">
                          <span className="cc__code">{entry.code}</span>
                          <span className="cc__section">{entry.section}</span>
                          <span className="cc__room">{entry.room}</span>
                        </div>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
