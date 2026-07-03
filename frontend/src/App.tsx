import { useState } from 'react'
import './App.css'

// ─── Types ────────────────────────────────────────────────────────────────────
type CourseEntry = {
  code: string
  section: string
  room: string
}

type ScheduleData = Record<number, Record<string, CourseEntry | null>>

// ─── Constants ────────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  { start: '07:00AM', end: '08:10AM' },
  { start: '08:10AM', end: '09:20AM' },
  { start: '09:20AM', end: '10:30AM' },
  { start: '10:30AM', end: '11:40AM' },
  { start: '11:40AM', end: '12:50PM' },
  { start: '12:50PM', end: '02:00PM' },
  { start: '02:00PM', end: '03:10PM' },
  { start: '03:10PM', end: '04:20PM' },
  { start: '04:20PM', end: '05:30PM' },
  { start: '05:30PM', end: '06:40PM' },
  { start: '06:40PM', end: '07:50PM' },
  { start: '07:50PM', end: '09:00PM' },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TERMS = ['TERM 3', 'TERM 2', 'TERM 1']
const SCHOOL_YEARS = ['2025-2026', '2024-2025', '2023-2024']

// ─── Sample schedule (output from backtracking optimizer) ─────────────────────
const RAW: { slot: number; day: string; entry: CourseEntry }[] = [
  // CSS152P — Programming Lab | Tuesday 7:00AM–9:20AM
  { slot: 0, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
  { slot: 1, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
  { slot: 2, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
  // CSS182-01 — Data Structures | Saturday 7:00AM–9:20AM
  { slot: 0, day: 'Saturday', entry: { code: 'CSS182-01', section: 'BM1', room: 'MPO213' } },
  { slot: 1, day: 'Saturday', entry: { code: 'CSS182-01', section: 'BM1', room: 'MPO213' } },
  { slot: 2, day: 'Saturday', entry: { code: 'CSS182-01', section: 'BM1', room: 'MPO213' } },
  // ITS150P — IT Systems | Mon & Thu 10:30AM–11:40AM
  { slot: 3, day: 'Monday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO401' } },
  { slot: 3, day: 'Thursday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO401' } },
  // FW04-2 — PE / NSTP | Saturday 10:30AM–12:50PM
  { slot: 3, day: 'Saturday', entry: { code: 'FW04-2', section: 'BM8', room: 'MPOGYM1' } },
  { slot: 4, day: 'Saturday', entry: { code: 'FW04-2', section: 'BM8', room: 'MPOGYM1' } },
  // CSS133-1 — Algorithm Design | Mon/Wed/Fri 11:40AM–12:50PM
  { slot: 4, day: 'Monday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
  { slot: 4, day: 'Wednesday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
  { slot: 4, day: 'Friday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
  // CSS134-1 — Operating Systems | Mon/Wed/Fri 2:00PM–3:10PM
  { slot: 6, day: 'Monday', entry: { code: 'CSS134-1', section: 'BM6', room: 'MPO504' } },
  { slot: 6, day: 'Wednesday', entry: { code: 'CSS134-1', section: 'BM6', room: 'MPO504' } },
  { slot: 6, day: 'Friday', entry: { code: 'CSS134-1', section: 'BM6', room: 'MPO504' } },
  // CSS152P — Lab afternoon | Mon/Wed 3:10PM–4:20PM
  { slot: 7, day: 'Monday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO605' } },
  { slot: 7, day: 'Wednesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO605' } },
  // ITS150P — afternoon/evening | Tuesday 3:10PM–6:40PM
  { slot: 7, day: 'Tuesday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO409' } },
  { slot: 8, day: 'Tuesday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO409' } },
  { slot: 9, day: 'Tuesday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO409' } },
  // GED102 — Technical Writing (Online) | Mon/Wed/Fri 5:30PM–6:40PM
  { slot: 9, day: 'Monday', entry: { code: 'GED102', section: 'BM4', room: 'ONLINE' } },
  { slot: 9, day: 'Wednesday', entry: { code: 'GED102', section: 'BM4', room: 'ONLINE' } },
  { slot: 9, day: 'Friday', entry: { code: 'GED102', section: 'BM4', room: 'ONLINE' } },
]

function buildSchedule(raw: typeof RAW): ScheduleData {
  const data: ScheduleData = {}
  TIME_SLOTS.forEach((_, i) => {
    data[i] = {}
    DAYS.forEach(d => { data[i][d] = null })
  })
  raw.forEach(({ slot, day, entry }) => { data[slot][day] = entry })
  return data
}

const SCHEDULE = buildSchedule(RAW)

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
const NAV: {
  id: string; label: string; icon?: string; indent?: boolean; isGroup?: boolean
}[] = [
    { id: 'home', label: 'My Home', icon: '⊞' },
    { id: 'grp', label: 'Student Profile', isGroup: true },
    { id: 'contact', label: 'My Contact Info', indent: true },
    { id: 'personal', label: 'My Personal Info', indent: true },
    { id: 'grades', label: 'My Grades', indent: true },
    { id: 'schedule', label: 'My Schedule', indent: true },
    { id: 'curriculum', label: 'My Curriculum', indent: true },
    { id: 'print', label: 'Print Schedule', indent: true },
  ]

const LEGEND = [
  { code: 'CSS152P', desc: 'Programming Laboratory' },
  { code: 'CSS182-01', desc: 'Data Structures & Algorithms' },
  { code: 'ITS150P', desc: 'IT Systems & Networking' },
  { code: 'CSS133-1', desc: 'Algorithm Design' },
  { code: 'CSS134-1', desc: 'Operating Systems' },
  { code: 'FW04-2', desc: 'Physical Education / NSTP' },
  { code: 'GED102', desc: 'Technical Writing (Online)' },
]

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [activeTerm, setActiveTerm] = useState('TERM 3')
  const [activeNav, setActiveNav] = useState('schedule')
  const [schoolYear, setSchoolYear] = useState('2025-2026')
  const [profileOpen, setProfileOpen] = useState(true)

  return (
    <div className="p-root">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="p-header">
        <div className="p-header__brand">
          <span className="p-header__name">Hero's Party</span>
        </div>
      </header>

      <div className="p-body">

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className="p-sidebar">
          <ul className="sb-list">
            {NAV.map(item => {
              if (item.isGroup) {
                return (
                  <li key={item.id}>
                    <button
                      className="sb-group"
                      onClick={() => setProfileOpen(o => !o)}
                      aria-expanded={profileOpen}
                    >
                      <span className="sb-group__arrow">{profileOpen ? '−' : '+'}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              }

              if (item.indent && !profileOpen) return null

              return (
                <li key={item.id}>
                  <button
                    id={`nav-${item.id}`}
                    className={[
                      'sb-item',
                      item.indent ? 'sb-item--indent' : '',
                      activeNav === item.id ? 'sb-item--active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setActiveNav(item.id)}
                  >
                    {item.icon && <span className="sb-item__icon">{item.icon}</span>}
                    <span className="sb-item__label">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="p-main">

          {/* Schedule page */}
          {activeNav === 'schedule' && (
            <div className="sched-page">
              <h1 className="sched-page__title">My Schedule</h1>

              {/* Controls */}
              <div className="sched-controls">
                <label className="sched-controls__label" htmlFor="sy-sel">School Year</label>
                <select
                  id="sy-sel"
                  className="sched-controls__select"
                  value={schoolYear}
                  onChange={e => setSchoolYear(e.target.value)}
                >
                  {SCHOOL_YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>

              {/* Term tabs */}
              <div className="term-tabs" role="tablist" aria-label="Academic Terms">
                {TERMS.map(t => (
                  <button
                    key={t}
                    id={`tab-${t.replace(' ', '-').toLowerCase()}`}
                    role="tab"
                    aria-selected={activeTerm === t}
                    className={`term-tab${activeTerm === t ? ' term-tab--active' : ''}`}
                    onClick={() => setActiveTerm(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="tbl-wrap">
                <div className="tbl-scroll">
                  <table className="sched-tbl" aria-label="Weekly Schedule">
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
                            const entry = SCHEDULE[si][day]
                            return (
                              <td
                                key={day}
                                className={[
                                  'tbl-td',
                                  day === 'Saturday' ? 'tbl-td--sat' : '',
                                  entry ? 'tbl-td--filled' : '',
                                ].filter(Boolean).join(' ')}
                              >
                                {entry && (
                                  <div className="cc">
                                    <span className="cc__code">{entry.code}</span>
                                    <span className="cc__section">{entry.section}</span>
                                    <span className="cc__room">{entry.room}</span>
                                  </div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Placeholder for other pages */}
          {activeNav !== 'schedule' && (
            <div className="ph-page">
              <div className="ph-inner">
                <div className="ph-icon">📅</div>
                <h2 className="ph-heading">
                  {NAV.find(n => n.id === activeNav)?.label ?? 'Page'}
                </h2>
                <p className="ph-body">This section is under development.</p>
                <button className="ph-btn" onClick={() => setActiveNav('schedule')}>
                  ← Back to My Schedule
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="p-footer">
        <div className="p-footer__topline" />
        <div className="p-footer__content">
          <p className="p-footer__copy">Copyright &copy; 2001–2017. All rights reserved. Mapúa University</p>
          <p className="p-footer__links">
            <a href="#" className="p-footer__link"> <b>Terms of Service</b></a>
            <span className="p-footer__sep">|</span>
            <a href="#" className="p-footer__link"><b>Privacy Policy</b></a>
          </p>
          <p className="p-footer__email">helpdesk@mapua.edu.ph</p>
        </div>
      </footer>

    </div>
  )
}

export default App
