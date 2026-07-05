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
]
