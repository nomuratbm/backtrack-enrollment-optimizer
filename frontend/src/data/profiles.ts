import { TIME_SLOTS, DAYS } from '../types'

// ─── SchedulerPayload ─────────────────────────────────────────────────────────
// The shape sent to the backtracking scheduler backend.

export type Timeslot = {
  time: string
  day: string
}

export type CourseInput = {
  coursecode: string
  section: string
  instructor: string
  units: number
  timeslots: Timeslot[]
}

export type SchedulerPayload = {
  student: {
    id: number
    name: string
  }
  courses: CourseInput[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Returns a blank timeslot seeded with the first valid time + day values */
export function blankTimeslot(): Timeslot {
  return { time: TIME_SLOTS[0].start + '-' + TIME_SLOTS[0].end, day: DAYS[0] }
}

/** Returns a blank course with one empty timeslot */
export function blankCourse(): CourseInput {
  return {
    coursecode: '',
    section: '',
    instructor: '',
    units: 3,
    timeslots: [blankTimeslot()],
  }
}

// ─── Premade profiles (sourced from test_success.py and test_failure.py) ──────
export const PREMADE_PROFILES: { label: string; payload: SchedulerPayload }[] = [
  {
    // test_success.py — Alice, 4 courses, all constraints satisfied
    label: '✅ Success Case — Alice (4 courses, all valid)',
    payload: {
      student: { id: 1, name: 'Alice' },
      courses: [
        {
          coursecode: 'MATH101',
          section: 'A',
          instructor: 'Dr. Reyes',
          units: 3,
          timeslots: [{ time: '7:00am-8:10am', day: 'Monday' }],
        },
        {
          coursecode: 'ENG101',
          section: 'A',
          instructor: 'Dr. Cruz',
          units: 3,
          timeslots: [{ time: '8:10am-9:20am', day: 'Monday' }],
        },
        {
          coursecode: 'SCI101',
          section: 'A',
          instructor: 'Dr. Lim',
          units: 3,
          timeslots: [{ time: '9:20am-10:30am', day: 'Monday' }],
        },
        {
          coursecode: 'HIS101',
          section: 'A',
          instructor: 'Dr. Santos',
          units: 3,
          timeslots: [{ time: '7:00am-8:10am', day: 'Wednesday' }],
        },
      ],
    },
  },
  {
    // test_failure.py — Bob, 3 courses, gap constraint violations → no solution
    label: '❌ Failure Case — Bob (3 courses, gap conflict)',
    payload: {
      student: { id: 2, name: 'Bob' },
      courses: [
        {
          coursecode: 'MATH201',
          section: 'B',
          instructor: 'Dr. Reyes',
          units: 3,
          timeslots: [{ time: '7:00am-8:10am', day: 'Monday' }],
        },
        {
          coursecode: 'ENG201',
          section: 'B',
          instructor: 'Dr. Cruz',
          units: 3,
          timeslots: [{ time: '12:50pm-2:00pm', day: 'Monday' }],
        },
        {
          coursecode: 'SCI201',
          section: 'B',
          instructor: 'Dr. Lim',
          units: 3,
          timeslots: [{ time: '10:30am-11:40am', day: 'Monday' }],
        },
      ],
    },
  },

  // ── Mico Tazarte — 7 subjects, multi-day (MWF + TTh), success case ─────────
  // Layout:
  //   Mon/Wed/Fri  →  periods 0, 1  (MATH301, PHYS301)
  //   Mon/Wed      →  period  2     (FIL301)
  //   Tue/Thu      →  periods 0, 1, 2  (CS301, ENG301, HIS301)
  //   Saturday     →  period  0     (PE301)
  //
  // Gap analysis (per day, periods 0-based):
  //   Every new course on a shared day lands exactly 1 period away from the
  //   nearest already-scheduled period  →  gap ≤ 1 always satisfied.
  //   Max consecutive run on any day = 3  →  consecutive constraint satisfied.
  {
    label: '✅ Success Case — Mico Tazarte (7 courses, MWF + TTh pattern)',
    payload: {
      student: { id: 3, name: 'Mico Tazarte' },
      courses: [
        // ── MWF cluster ───────────────────────────────────────────────────
        {
          coursecode: 'MATH301',
          section: 'A',
          instructor: 'Dr. Santos',
          units: 3,
          timeslots: [
            { time: '7:00am-8:10am', day: 'Monday' },    // period 0
            { time: '7:00am-8:10am', day: 'Wednesday' },
            { time: '7:00am-8:10am', day: 'Friday' },
          ],
        },
        {
          coursecode: 'PHYS301',
          section: 'A',
          instructor: 'Dr. Lim',
          units: 3,
          timeslots: [
            { time: '8:10am-9:20am', day: 'Monday' },    // period 1 (gap=1 from MATH301) ✓
            { time: '8:10am-9:20am', day: 'Wednesday' },
            { time: '8:10am-9:20am', day: 'Friday' },
          ],
        },
        {
          coursecode: 'FIL301',
          section: 'A',
          instructor: 'Dr. Garcia',
          units: 3,
          timeslots: [
            { time: '9:20am-10:30am', day: 'Monday' },   // period 2 (gap=1 from PHYS301) ✓
            { time: '9:20am-10:30am', day: 'Wednesday' },
          ],
        },
        // ── TTh cluster ───────────────────────────────────────────────────
        {
          coursecode: 'CS301',
          section: 'A',
          instructor: 'Dr. Cruz',
          units: 3,
          timeslots: [
            { time: '7:00am-8:10am', day: 'Tuesday' },   // period 0 (first course on Tue/Thu)
            { time: '7:00am-8:10am', day: 'Thursday' },
          ],
        },
        {
          coursecode: 'ENG301',
          section: 'A',
          instructor: 'Dr. Reyes',
          units: 3,
          timeslots: [
            { time: '8:10am-9:20am', day: 'Tuesday' },   // period 1 (gap=1 from CS301) ✓
            { time: '8:10am-9:20am', day: 'Thursday' },
          ],
        },
        {
          coursecode: 'HIS301',
          section: 'A',
          instructor: 'Dr. Bautista',
          units: 3,
          timeslots: [
            { time: '9:20am-10:30am', day: 'Tuesday' },  // period 2 (gap=1 from ENG301) ✓
            { time: '9:20am-10:30am', day: 'Thursday' },
          ],
        },
        // ── Weekend standalone ────────────────────────────────────────────
        {
          coursecode: 'PE301',
          section: 'A',
          instructor: 'Coach Dela Cruz',
          units: 2,
          timeslots: [
            { time: '7:00am-8:10am', day: 'Saturday' },  // no shared-day students → gap N/A ✓
          ],
        },
      ],
    },
  },

  // ── Joel Balagot — 7 subjects, guaranteed failure case ─────────────────────
  // Three of his courses are locked to Monday but spaced 4 periods apart:
  //   MATH302 → Mon period 0  (7:00am)
  //   ENG302  → Mon period 4  (11:40am)  gap from period 0 = 4 > 1  ✗
  //   SCI302  → Mon period 8  (4:20pm)   gap from period 4 = 4 > 1  ✗
  //
  // No matter which Monday course is added first, the next Monday course is
  // always > 1 period away → the backtracker exhausts ALL orderings and fails.
  // The remaining 4 courses (different days) can combine fine among themselves,
  // but they cannot rescue the Monday deadlock.
  {
    label: '❌ Failure Case — Joel Balagot (7 courses, Monday gap deadlock)',
    payload: {
      student: { id: 4, name: 'Joel Balagot' },
      courses: [
        // ── Monday deadlock trio (gaps of 4 → always violates gap ≤ 1) ───
        {
          coursecode: 'MATH302',
          section: 'B',
          instructor: 'Dr. Santos',
          units: 3,
          timeslots: [
            { time: '7:00am-8:10am', day: 'Monday' },    // period 0
          ],
        },
        {
          coursecode: 'ENG302',
          section: 'B',
          instructor: 'Dr. Reyes',
          units: 3,
          timeslots: [
            { time: '11:40am-12:50pm', day: 'Monday' },  // period 4 — gap 4 from MATH302 ✗
          ],
        },
        {
          coursecode: 'SCI302',
          section: 'B',
          instructor: 'Dr. Lim',
          units: 3,
          timeslots: [
            { time: '4:20pm-5:30pm', day: 'Monday' },    // period 8 — gap 4 from ENG302 ✗
          ],
        },
        // ── Valid filler courses (Tue/Wed/Thu/Fri — no internal conflicts) ─
        {
          coursecode: 'CS302',
          section: 'B',
          instructor: 'Dr. Cruz',
          units: 3,
          timeslots: [
            { time: '7:00am-8:10am', day: 'Tuesday' },
            { time: '7:00am-8:10am', day: 'Wednesday' },
          ],
        },
        {
          coursecode: 'FIL302',
          section: 'B',
          instructor: 'Dr. Garcia',
          units: 3,
          timeslots: [
            { time: '8:10am-9:20am', day: 'Tuesday' },   // gap=1 from CS302 on Tue ✓
            { time: '8:10am-9:20am', day: 'Thursday' },
          ],
        },
        {
          coursecode: 'HIS302',
          section: 'B',
          instructor: 'Dr. Bautista',
          units: 3,
          timeslots: [
            { time: '8:10am-9:20am', day: 'Wednesday' }, // gap=1 from CS302 on Wed ✓
            { time: '8:10am-9:20am', day: 'Friday' },
          ],
        },
        {
          coursecode: 'PE302',
          section: 'B',
          instructor: 'Coach Dela Cruz',
          units: 2,
          timeslots: [
            { time: '7:00am-8:10am', day: 'Saturday' },
          ],
        },
      ],
    },
  },
]
