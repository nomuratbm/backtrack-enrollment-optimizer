import { useState } from 'react'
import { ScheduleTable } from '../../components/ScheduleTable'
import { TIME_SLOTS, DAYS, type ScheduleData } from '../../types'
import {
  type SchedulerPayload,
  type CourseInput,
  type Timeslot,
  PREMADE_PROFILES,
  blankCourse,
  blankTimeslot,
} from '../../data/profiles'
import { runScheduler } from '../../api/scheduler'

// ─── Time label helper ────────────────────────────────────────────────────────
// Converts a TIME_SLOTS entry to the canonical "7:00am-8:10am" backend format.
function slotLabel(slot: { start: string; end: string }): string {
  const fmt = (s: string) => s.replace('AM', 'am').replace('PM', 'pm')
  return `${fmt(slot.start)}-${fmt(slot.end)}`
}

// Pre-build dropdown option values at module level (rendering-hoist-jsx)
const TIME_OPTIONS = TIME_SLOTS.map(s => slotLabel(s))

// ─── Blank initial payload ────────────────────────────────────────────────────
const INITIAL_PAYLOAD: SchedulerPayload = {
  student: { id: 1, name: '' },
  courses: [blankCourse()],
}

// ─── Sub-components (rerender-no-inline-components) ───────────────────────────

type TimeslotRowProps = {
  timeslot: Timeslot
  onChange: (updated: Timeslot) => void
  onRemove: () => void
  canRemove: boolean
}

function TimeslotRow({ timeslot, onChange, onRemove, canRemove }: TimeslotRowProps) {
  return (
    <div className="ri-timeslot-row">
      <select
        className="ri-select"
        value={timeslot.time}
        onChange={e => onChange({ ...timeslot, time: e.target.value })}
        aria-label="Time slot"
      >
        {TIME_OPTIONS.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select
        className="ri-select"
        value={timeslot.day}
        onChange={e => onChange({ ...timeslot, day: e.target.value })}
        aria-label="Day"
      >
        {DAYS.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      {canRemove && (
        <button
          type="button"
          className="ri-btn-icon ri-btn-icon--danger"
          onClick={onRemove}
          aria-label="Remove timeslot"
        >
          🗑
        </button>
      )}
    </div>
  )
}

type CourseCardProps = {
  course: CourseInput
  index: number
  onChange: (updated: CourseInput) => void
  onRemove: () => void
  canRemove: boolean
}

function CourseCard({ course, index, onChange, onRemove, canRemove }: CourseCardProps) {
  function updateField<K extends keyof CourseInput>(key: K, value: CourseInput[K]) {
    onChange({ ...course, [key]: value })
  }

  function updateTimeslot(ti: number, updated: Timeslot) {
    const next = course.timeslots.map((t, i) => (i === ti ? updated : t))
    updateField('timeslots', next)
  }

  function addTimeslot() {
    updateField('timeslots', [...course.timeslots, blankTimeslot()])
  }

  function removeTimeslot(ti: number) {
    updateField('timeslots', course.timeslots.filter((_, i) => i !== ti))
  }

  return (
    <div className="ri-course-card">
      <div className="ri-course-card__header">
        <span className="ri-course-card__label">Course {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            className="ri-btn-icon ri-btn-icon--danger"
            onClick={onRemove}
            aria-label={`Remove course ${index + 1}`}
          >
            🗑 Remove
          </button>
        )}
      </div>

      <div className="ri-course-card__fields">
        <div className="ri-field">
          <label className="ri-label">Course Code</label>
          <input
            className="ri-input"
            type="text"
            placeholder="e.g. MATH101"
            value={course.coursecode}
            onChange={e => updateField('coursecode', e.target.value)}
          />
        </div>
        <div className="ri-field">
          <label className="ri-label">Section</label>
          <input
            className="ri-input ri-input--sm"
            type="text"
            placeholder="e.g. A"
            value={course.section}
            onChange={e => updateField('section', e.target.value)}
          />
        </div>
        <div className="ri-field">
          <label className="ri-label">Instructor</label>
          <input
            className="ri-input"
            type="text"
            placeholder="e.g. Dr. Reyes"
            value={course.instructor}
            onChange={e => updateField('instructor', e.target.value)}
          />
        </div>
        <div className="ri-field">
          <label className="ri-label">Units</label>
          <input
            className="ri-input ri-input--xs"
            type="number"
            min={1}
            max={9}
            value={course.units}
            onChange={e => updateField('units', Math.max(1, Number(e.target.value)))}
          />
        </div>
      </div>

      <div className="ri-timeslots">
        <span className="ri-label">Timeslots</span>
        {course.timeslots.map((ts, ti) => (
          <TimeslotRow
            key={ti}
            timeslot={ts}
            onChange={updated => updateTimeslot(ti, updated)}
            onRemove={() => removeTimeslot(ti)}
            canRemove={course.timeslots.length > 1}
          />
        ))}
        <button
          type="button"
          className="ri-btn-add-sm"
          onClick={addTimeslot}
        >
          ＋ Add Timeslot
        </button>
      </div>
    </div>
  )
}

// ─── ResultsView ──────────────────────────────────────────────────────────────
type ApiStatus = 'idle' | 'loading' | 'success' | 'error'

export function ResultsView() {
  const [payload, setPayload] = useState<SchedulerPayload>(INITIAL_PAYLOAD)
  const [selectedProfile, setSelectedProfile] = useState<string>('')

  // ── API state ──────────────────────────────────────────────────────────────
  const [apiStatus, setApiStatus]     = useState<ApiStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [scheduleData, setScheduleData] = useState<ScheduleData | undefined>(undefined)

  // ── Profile selection ──────────────────────────────────────────────────────
  function handleProfileChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const idx = Number(e.target.value)
    setSelectedProfile(e.target.value)
    if (!isNaN(idx) && PREMADE_PROFILES[idx]) {
      // Deep-clone so edits don't mutate the profile constant
      setPayload(JSON.parse(JSON.stringify(PREMADE_PROFILES[idx].payload)))
    }
    // Reset previous result when profile changes
    setApiStatus('idle')
    setScheduleData(undefined)
  }

  // ── Student ────────────────────────────────────────────────────────────────
  function updateStudent(key: 'id' | 'name', value: string | number) {
    setPayload(p => ({ ...p, student: { ...p.student, [key]: value } }))
  }

  // ── Courses ────────────────────────────────────────────────────────────────
  function updateCourse(ci: number, updated: CourseInput) {
    setPayload(p => ({
      ...p,
      courses: p.courses.map((c, i) => (i === ci ? updated : c)),
    }))
  }

  function addCourse() {
    setPayload(p => ({ ...p, courses: [...p.courses, blankCourse()] }))
  }

  function removeCourse(ci: number) {
    setPayload(p => ({ ...p, courses: p.courses.filter((_, i) => i !== ci) }))
  }

  // ── Generate — calls POST /api/schedule/ ───────────────────────────────────
  async function handleGenerate() {
    setApiStatus('loading')
    setErrorMessage('')
    setScheduleData(undefined)
    try {
      const result = await runScheduler(payload)
      if (result.ok) {
        setScheduleData(result.scheduleData)
        setApiStatus('success')
      } else {
        setErrorMessage(result.message)
        setApiStatus('error')
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unexpected error — is the Django server running?'
      )
      setApiStatus('error')
    }
  }

  return (
    <div className="adm-page">
      <h1 className="adm-page__title">Algorithm Results</h1>
      <p className="adm-page__sub">
        View how the Backtracking Algorithm resolved conflicts for each student's schedule.
      </p>

      {/* ── Schedule grid — shows result after a successful run ────────── */}
      <ScheduleTable ariaLabel="Algorithm Results Schedule" scheduleData={scheduleData} />

      {/* ══════════════════════════════════════════════════════════════════
          SCHEDULE INPUT PANEL
      ══════════════════════════════════════════════════════════════════ */}
      <section className="ri-panel" aria-label="Schedule Input">

        {/* ── Section divider ────────────────────────────────────────────── */}
        <div className="ri-section-header">
          <span className="ri-section-header__title">Try the Scheduler</span>
          <span className="ri-section-header__sub">
            Build a student + course list and run the backtracking algorithm.
          </span>
        </div>

        {/* ── Profile selector ───────────────────────────────────────────── */}
        <div className="ri-profile-row">
          <label className="ri-label" htmlFor="profile-select">Load a premade profile</label>
          <select
            id="profile-select"
            className="ri-select ri-select--wide"
            value={selectedProfile}
            onChange={handleProfileChange}
          >
            <option value="">— Select a profile —</option>
            {PREMADE_PROFILES.map((p, i) => (
              <option key={i} value={String(i)}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* ── Student ────────────────────────────────────────────────────── */}
        <div className="ri-group">
          <h3 className="ri-group__title">Student</h3>
          <div className="ri-row">
            <div className="ri-field">
              <label className="ri-label" htmlFor="student-id">ID</label>
              <input
                id="student-id"
                className="ri-input ri-input--xs"
                type="number"
                min={1}
                value={payload.student.id}
                onChange={e => updateStudent('id', Math.max(1, Number(e.target.value)))}
              />
            </div>
            <div className="ri-field ri-field--grow">
              <label className="ri-label" htmlFor="student-name">Name</label>
              <input
                id="student-name"
                className="ri-input"
                type="text"
                placeholder="e.g. Alice"
                value={payload.student.name}
                onChange={e => updateStudent('name', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Courses ────────────────────────────────────────────────────── */}
        <div className="ri-group">
          <h3 className="ri-group__title">Courses</h3>
          <div className="ri-courses-list">
            {payload.courses.map((course, ci) => (
              <CourseCard
                key={ci}
                course={course}
                index={ci}
                onChange={updated => updateCourse(ci, updated)}
                onRemove={() => removeCourse(ci)}
                canRemove={payload.courses.length > 1}
              />
            ))}
          </div>
          <button
            type="button"
            className="ri-btn-add"
            onClick={addCourse}
          >
            ＋ Add Course
          </button>
        </div>

        {/* ── Generate button + feedback ──────────────────────────────────── */}
        <div className="ri-actions">
          <button
            id="btn-generate-schedule"
            type="button"
            className="ri-btn-generate"
            onClick={handleGenerate}
            disabled={apiStatus === 'loading'}
            aria-busy={apiStatus === 'loading'}
          >
            {apiStatus === 'loading' ? '⏳ Running…' : '▶ Generate Schedule'}
          </button>

          {apiStatus === 'success' && (
            <div className="ri-feedback ri-feedback--success" role="status">
              ✅ Schedule generated successfully — see the grid above.
            </div>
          )}

          {apiStatus === 'error' && (
            <div className="ri-feedback ri-feedback--error" role="alert">
              ❌ {errorMessage}
            </div>
          )}
        </div>

      </section>
    </div>
  )
}
