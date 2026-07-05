// ─── Types ────────────────────────────────────────────────────────────────────
export type CourseEntry = {
  code: string
  section: string
  room: string
}

export type ScheduleData = Record<number, Record<string, CourseEntry | null>>

export type Role = 'student' | 'admin'

export type StudentRow = { id: number; name: string; program: string; year: number; status: string }

export type CourseRow = {
  id: number; courseCode: string; section: string; instructor: string
  units: number; enrolled: number; capacity: number; schedule: string
}

export type AssignmentRow = {
  studentId: number; studentName: string
  courseCode: string; section: string; instructor: string; schedule: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const TIME_SLOTS = [
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

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const TERMS = ['TERM 3', 'TERM 2', 'TERM 1']

export const SCHOOL_YEARS = ['2025-2026', '2024-2025', '2023-2024']

export const STUDENT_NAV: {
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

export const ADMIN_NAV: { id: string; label: string; icon: string }[] = [
  { id: 'students', label: 'Students', icon: '👥' },
  { id: 'courses', label: 'Courses & Sections', icon: '📚' },
  { id: 'optimizer', label: 'Backtracking Algorithm', icon: '⚙️' },
  { id: 'results', label: 'Algorithm Results', icon: '📊' },
]

// ─── Constraints (sourced from studentclass.py — can_append) ─────────────────
export const CONSTRAINTS = [
  {
    num: 1,
    name: 'Duplicate',
    rule: "A course may not appear more than once in a student's schedule.",
    detail: 'Checked via course ID (coursecode-section) across all schedule cells.',
  },
  {
    num: 2,
    name: 'Overlap',
    rule: 'Two courses cannot occupy the same period on the same day.',
    detail: "For every period (1–13) × day (1–7), both the student's existing schedule and the candidate course must be free.",
  },
  {
    num: 3,
    name: 'Consecutive',
    rule: 'No more than 3 consecutive occupied periods on any single day.',
    detail: 'A streak of 4+ back-to-back periods (≥ 280 min) on the same day is rejected. Each period is 70 minutes.',
  },
  {
    num: 4,
    name: 'Gap',
    rule: 'On a shared day, a new course period may be at most 1 period (70 min) away from the nearest existing period.',
    detail: 'Only enforced once the student has at least one course. Applies per day where both the student and candidate course have periods.',
  },
]

// ─── Empty data arrays (no seed data) ────────────────────────────────────────
export const STUDENTS: StudentRow[] = []

export const COURSES: CourseRow[] = []

export const ASSIGNMENTS: AssignmentRow[] = []

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function buildEmptySchedule(): ScheduleData {
  const data: ScheduleData = {}
  TIME_SLOTS.forEach((_, i) => {
    data[i] = {}
    DAYS.forEach(d => { data[i][d] = null })
  })
  return data
}

/** Pre-built empty schedule grid — hoisted to module level (rendering-hoist-jsx) */
export const EMPTY_SCHEDULE = buildEmptySchedule()
