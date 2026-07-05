import { DAYS, type ScheduleData } from '../types'

// ─── Base URL ─────────────────────────────────────────────────────────────────
// Vite exposes VITE_* env vars; falls back to the Django dev server default.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

// ─── Request / Response types ─────────────────────────────────────────────────
export type SchedulerRequest = {
  student: { id: number; name: string }
  courses: {
    coursecode: string
    section: string
    instructor: string
    units: number
    timeslots: { time: string; day: string }[]
  }[]
}

/** Shape returned by POST /api/schedule/ on success */
type SchedulerSuccessResponse = {
  success: true
  /** 13 × 7 grid: schedule[period][day_index] = "COURSECODE-SECTION" | "Free" */
  schedule: string[][]
}

/** Shape returned by POST /api/schedule/ on failure */
type SchedulerFailureResponse = {
  success: false
  message: string
}

type RawSchedulerResponse = SchedulerSuccessResponse | SchedulerFailureResponse

// ─── Schedule grid adapter ────────────────────────────────────────────────────
/**
 * Converts the backend's 13×7 string grid into the ScheduleData shape
 * consumed by <ScheduleTable>.
 *
 * Backend grid indices: schedule[period (0-12)][day (0-6, Mon=0)]
 * ScheduleData shape:   { [period]: { [dayName]: CourseEntry | null } }
 *
 * CourseEntry has { code, section, room }.  The backend encodes the cell as
 * "COURSECODE-SECTION" so we split on the last "-" to separate the two parts.
 * `room` is not tracked by the backend so we leave it as an empty string.
 */
function adaptSchedule(raw: string[][]): ScheduleData {
  const data: ScheduleData = {}
  raw.forEach((row, periodIdx) => {
    data[periodIdx] = {}
    DAYS.forEach((day, dayIdx) => {
      const cell = row[dayIdx]
      if (!cell || cell === 'Free') {
        data[periodIdx][day] = null
      } else {
        // Split "COURSECODE-SECTION" → separate code and section
        const lastDash = cell.lastIndexOf('-')
        const code    = lastDash > 0 ? cell.slice(0, lastDash)  : cell
        const section = lastDash > 0 ? cell.slice(lastDash + 1) : ''
        data[periodIdx][day] = { code, section, room: '' }
      }
    })
  })
  return data
}

// ─── API result type ──────────────────────────────────────────────────────────
export type SchedulerResult =
  | { ok: true;  scheduleData: ScheduleData }
  | { ok: false; message: string }

// ─── Main API call ────────────────────────────────────────────────────────────
/**
 * POST /api/schedule/
 *
 * Sends the scheduler payload to the Django backend, validates the response,
 * and returns a typed result (no raw fetch errors escape the caller).
 */
export async function runScheduler(payload: SchedulerRequest): Promise<SchedulerResult> {
  const response = await fetch(`${API_BASE}/schedule/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    // HTTP-level error (4xx/5xx from DRF validation, etc.)
    let detail = `HTTP ${response.status}`
    try {
      const errBody = await response.json()
      detail = JSON.stringify(errBody)
    } catch {
      // ignore JSON parse failure
    }
    return { ok: false, message: detail }
  }

  const data: RawSchedulerResponse = await response.json()

  if (!data.success) {
    return { ok: false, message: (data as SchedulerFailureResponse).message }
  }

  return {
    ok: true,
    scheduleData: adaptSchedule((data as SchedulerSuccessResponse).schedule),
  }
}
