import { useState } from 'react'
import './App.css'
import headerImg from './assets/headerV2_2.png'

// ─── Types ────────────────────────────────────────────────────────────────────
type CourseEntry = {
  code: string
  section: string
  room: string
}

type ScheduleData = Record<number, Record<string, CourseEntry | null>>

type Role = 'student' | 'admin'

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
  { slot: 0, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
  { slot: 1, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
  { slot: 2, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
  { slot: 0, day: 'Saturday', entry: { code: 'CSS182-01', section: 'BM1', room: 'MPO213' } },
  { slot: 1, day: 'Saturday', entry: { code: 'CSS182-01', section: 'BM1', room: 'MPO213' } },
  { slot: 2, day: 'Saturday', entry: { code: 'CSS182-01', section: 'BM1', room: 'MPO213' } },
  { slot: 3, day: 'Monday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO401' } },
  { slot: 3, day: 'Thursday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO401' } },
  { slot: 3, day: 'Saturday', entry: { code: 'FW04-2', section: 'BM8', room: 'MPOGYM1' } },
  { slot: 4, day: 'Saturday', entry: { code: 'FW04-2', section: 'BM8', room: 'MPOGYM1' } },
  { slot: 4, day: 'Monday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
  { slot: 4, day: 'Wednesday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
  { slot: 4, day: 'Friday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
  { slot: 6, day: 'Monday', entry: { code: 'CSS134-1', section: 'BM6', room: 'MPO504' } },
  { slot: 6, day: 'Wednesday', entry: { code: 'CSS134-1', section: 'BM6', room: 'MPO504' } },
  { slot: 6, day: 'Friday', entry: { code: 'CSS134-1', section: 'BM6', room: 'MPO504' } },
  { slot: 7, day: 'Monday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO605' } },
  { slot: 7, day: 'Wednesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO605' } },
  { slot: 7, day: 'Tuesday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO409' } },
  { slot: 8, day: 'Tuesday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO409' } },
  { slot: 9, day: 'Tuesday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO409' } },
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

// ─── Student sidebar nav ──────────────────────────────────────────────────────
const STUDENT_NAV: {
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

const ADMIN_NAV: { id: string; label: string; icon: string }[] = [
  { id: 'students', label: 'Students', icon: '👥' },
  { id: 'courses', label: 'Courses & Sections', icon: '📚' },
  { id: 'optimizer', label: 'Backtracking Algorithm', icon: '⚙️' },
  { id: 'results', label: 'Algorithm Results', icon: '📊' },
]

// ─── Mock data (mirroring the backend example) ────────────────────────────────
const MOCK_STUDENTS = [
  { id: 1, name: 'Lara Abadilla', program: 'BS Computer Science', year: 2, status: 'Enrolled' },
  { id: 2, name: 'Nico Bautista', program: 'BS Computer Science', year: 2, status: 'Enrolled' },
  { id: 3, name: 'Sofia Castro', program: 'BS Information Technology', year: 3, status: 'Enrolled' },
  { id: 4, name: 'Diego Dela Cruz', program: 'BS Computer Science', year: 2, status: 'Enrolled' },
  { id: 5, name: 'Mia Enriquez', program: 'BS Information Technology', year: 2, status: 'Enrolled' },
  { id: 6, name: 'Carlos Flores', program: 'BS Computer Science', year: 1, status: 'Enrolled' },
  { id: 7, name: 'Pia Garcia', program: 'BS Computer Science', year: 2, status: 'Enrolled' },
  { id: 8, name: 'Leo Herrera', program: 'BS Information Technology', year: 2, status: 'Enrolled' },
  { id: 9, name: 'Ana Ignacio', program: 'BS Computer Science', year: 3, status: 'Enrolled' },
  { id: 10, name: 'Jake Jimenez', program: 'BS Computer Science', year: 1, status: 'Enrolled' },
  { id: 11, name: 'Kim Lim', program: 'BS Information Technology', year: 2, status: 'Enrolled' },
  { id: 12, name: 'Roy Mendoza', program: 'BS Computer Science', year: 2, status: 'Enrolled' },
  { id: 13, name: 'Cara Natividad', program: 'BS Computer Science', year: 1, status: 'Enrolled' },
  { id: 14, name: 'Dan Ocampo', program: 'BS Information Technology', year: 3, status: 'Enrolled' },
  { id: 15, name: 'Leanna Roque', program: 'BS Computer Science', year: 2, status: 'Enrolled' },
  { id: 16, name: 'Ricuel Santos', program: 'BS Computer Science', year: 2, status: 'Enrolled' },
  { id: 17, name: 'Robin Soliman', program: 'BS Information Technology', year: 2, status: 'Enrolled' },
  { id: 18, name: 'Mico Tazarte', program: 'BS Computer Science', year: 2, status: 'Enrolled' },
  { id: 19, name: 'John Vida', program: 'BS Computer Science', year: 1, status: 'Enrolled' },
  { id: 20, name: 'Nigel Zomil', program: 'BS Information Technology', year: 2, status: 'Enrolled' },
]

type CourseRow = {
  id: number; courseCode: string; section: string; instructor: string
  units: number; enrolled: number; capacity: number; schedule: string
}
const MOCK_COURSES: CourseRow[] = [
  { id: 1, courseCode: 'CSS133-1', section: 'BM1', instructor: 'Dr. DeGoma', units: 3, enrolled: 38, capacity: 40, schedule: 'MWF 11:40AM–12:50PM' },
  { id: 2, courseCode: 'CSS133-1', section: 'BM17', instructor: 'Dr. DeGoma', units: 3, enrolled: 21, capacity: 40, schedule: 'TTh 8:10AM–9:20AM' },
  { id: 3, courseCode: 'CSS133-1', section: 'BM2', instructor: 'Dr. DeGoma', units: 3, enrolled: 40, capacity: 40, schedule: 'MWF 2:00PM–3:10PM' },
  { id: 4, courseCode: 'CSS133-1', section: 'BM3', instructor: 'Dr. Monreal', units: 3, enrolled: 35, capacity: 40, schedule: 'TTh 10:30AM–11:40AM' },
  { id: 5, courseCode: 'CSS133-1', section: 'BM4', instructor: 'Dr. DeGoma', units: 3, enrolled: 29, capacity: 40, schedule: 'MWF 7:00AM–8:10AM' },
  { id: 6, courseCode: 'CSS133-1', section: 'BM5', instructor: 'Dr. DeGoma', units: 3, enrolled: 33, capacity: 40, schedule: 'TTh 1:00PM–2:10PM' },
  { id: 7, courseCode: 'CSS133-1', section: 'BM6', instructor: 'Dr. Monreal', units: 3, enrolled: 40, capacity: 40, schedule: 'MWF 3:10PM–4:20PM' },
  { id: 8, courseCode: 'CSS134-1', section: 'BM1', instructor: 'Dr. Dadigan', units: 3, enrolled: 37, capacity: 40, schedule: 'MWF 2:00PM–3:10PM' },
  { id: 9, courseCode: 'CSS134-1', section: 'BM2', instructor: 'Dr. Dadigan', units: 3, enrolled: 40, capacity: 40, schedule: 'TTh 7:00AM–8:10AM' },
  { id: 10, courseCode: 'CSS134-1', section: 'BM3', instructor: 'Prof. Castillo', units: 3, enrolled: 18, capacity: 40, schedule: 'MWF 9:20AM–10:30AM' },
  { id: 11, courseCode: 'CSS134-1', section: 'BM5', instructor: 'Dr. Dadigan', units: 3, enrolled: 39, capacity: 40, schedule: 'TTh 4:20PM–5:30PM' },
  { id: 12, courseCode: 'CSS134-1', section: 'BM6', instructor: 'Dr. Dadigan', units: 3, enrolled: 40, capacity: 40, schedule: 'MWF 2:00PM–3:10PM' },
  { id: 13, courseCode: 'CSS134-1', section: 'BM7', instructor: 'Prof. Castillo', units: 3, enrolled: 26, capacity: 40, schedule: 'TTh 6:40PM–7:50PM' },
  { id: 14, courseCode: 'CSS134-1', section: 'BM8', instructor: 'Prof. Castillo', units: 3, enrolled: 31, capacity: 40, schedule: 'Sat 7:00AM–9:20AM' },
  { id: 15, courseCode: 'CSS152P', section: 'BM1', instructor: 'Dr. Serrano', units: 3, enrolled: 40, capacity: 40, schedule: 'Tue 7:00AM–9:20AM' },
  { id: 16, courseCode: 'CSS152P', section: 'BM2', instructor: 'Dr. Serrano', units: 3, enrolled: 38, capacity: 40, schedule: 'Wed 9:20AM–11:40AM' },
  { id: 17, courseCode: 'CSS152P', section: 'BM3', instructor: 'Dr. Serrano', units: 3, enrolled: 25, capacity: 40, schedule: 'Thu 9:20AM–11:40AM' },
  { id: 18, courseCode: 'CSS152P', section: 'BM5', instructor: 'Prof. Gamboa', units: 3, enrolled: 34, capacity: 40, schedule: 'Fri 2:00PM–4:20PM' },
  { id: 19, courseCode: 'CSS152P', section: 'BM6', instructor: 'Dr. Serrano', units: 3, enrolled: 40, capacity: 40, schedule: 'Mon 3:10PM–5:30PM' },
  { id: 20, courseCode: 'CSS152P', section: 'BM7', instructor: 'Prof. Reyes', units: 3, enrolled: 22, capacity: 40, schedule: 'Sat 9:20AM–11:40AM' },
  { id: 21, courseCode: 'CSS152P', section: 'BM8', instructor: 'Prof. Reyes', units: 3, enrolled: 19, capacity: 40, schedule: 'Tue 4:20PM–6:40PM' },
  { id: 22, courseCode: 'ITS150P', section: 'BM1', instructor: 'Prof. Genidina', units: 3, enrolled: 36, capacity: 40, schedule: 'MWF 10:30AM–11:40AM' },
  { id: 23, courseCode: 'ITS150P', section: 'BM2', instructor: 'Prof. Mazo', units: 3, enrolled: 40, capacity: 40, schedule: 'TTh 3:10PM–4:20PM' },
  { id: 24, courseCode: 'ITS150P', section: 'BM3', instructor: 'Prof. Mazo', units: 3, enrolled: 33, capacity: 40, schedule: 'MWF 3:10PM–4:20PM' },
  { id: 25, courseCode: 'ITS150P', section: 'BM4', instructor: 'Dr. Lopez', units: 3, enrolled: 27, capacity: 40, schedule: 'TTh 8:10AM–9:20AM' },
  { id: 26, courseCode: 'ITS150P', section: 'BM5', instructor: 'Prof. Genidina', units: 3, enrolled: 38, capacity: 40, schedule: 'MWF 7:00AM–8:10AM' },
  { id: 27, courseCode: 'ITS150P', section: 'BM7', instructor: 'Prof. PrimoJr', units: 3, enrolled: 14, capacity: 40, schedule: 'TTh 6:40PM–7:50PM' },
  { id: 28, courseCode: 'ITS150P', section: 'BM8', instructor: 'Prof. Morla', units: 3, enrolled: 20, capacity: 40, schedule: 'Sat 10:30AM–11:40AM' },
]

type AssignmentRow = {
  studentId: number; studentName: string
  courseCode: string; section: string; instructor: string; schedule: string
}
const MOCK_ASSIGNMENTS: AssignmentRow[] = [
  { studentId: 1, studentName: 'Lara Abadilla', courseCode: 'CSS133-1', section: 'BM1', instructor: 'Dr. DeGoma', schedule: 'MWF 11:40AM–12:50PM' },
  { studentId: 1, studentName: 'Lara Abadilla', courseCode: 'CSS134-1', section: 'BM3', instructor: 'Prof. Castillo', schedule: 'MWF 9:20AM–10:30AM' },
  { studentId: 1, studentName: 'Lara Abadilla', courseCode: 'CSS152P', section: 'BM1', instructor: 'Dr. Serrano', schedule: 'Tue 7:00AM–9:20AM' },
  { studentId: 1, studentName: 'Lara Abadilla', courseCode: 'ITS150P', section: 'BM1', instructor: 'Prof. Genidina', schedule: 'MWF 10:30AM–11:40AM' },
  { studentId: 2, studentName: 'Nico Bautista', courseCode: 'CSS133-1', section: 'BM4', instructor: 'Dr. DeGoma', schedule: 'MWF 7:00AM–8:10AM' },
  { studentId: 2, studentName: 'Nico Bautista', courseCode: 'CSS134-1', section: 'BM5', instructor: 'Dr. Dadigan', schedule: 'TTh 4:20PM–5:30PM' },
  { studentId: 2, studentName: 'Nico Bautista', courseCode: 'CSS152P', section: 'BM2', instructor: 'Dr. Serrano', schedule: 'Wed 9:20AM–11:40AM' },
  { studentId: 2, studentName: 'Nico Bautista', courseCode: 'ITS150P', section: 'BM4', instructor: 'Dr. Lopez', schedule: 'TTh 8:10AM–9:20AM' },
  { studentId: 18, studentName: 'Mico Tazarte', courseCode: 'CSS133-1', section: 'BM1', instructor: 'Dr. DeGoma', schedule: 'MWF 11:40AM–12:50PM' },
  { studentId: 18, studentName: 'Mico Tazarte', courseCode: 'CSS134-1', section: 'BM6', instructor: 'Dr. Dadigan', schedule: 'MWF 2:00PM–3:10PM' },
  { studentId: 18, studentName: 'Mico Tazarte', courseCode: 'CSS152P', section: 'BM1', instructor: 'Dr. Serrano', schedule: 'Tue 7:00AM–9:20AM' },
  { studentId: 18, studentName: 'Mico Tazarte', courseCode: 'ITS150P', section: 'BM3', instructor: 'Prof. Mazo', schedule: 'MWF 3:10PM–4:20PM' },
]

// ─── Per-student schedule data (before / after optimization) ─────────────────
type SchedEntry = { code: string; section: string; room: string; conflict?: boolean; gap?: boolean }
type StudentSched = Record<number, Record<string, SchedEntry | null>>   // slot → day → entry

function makeEmpty(): StudentSched {
  const d: StudentSched = {}
  TIME_SLOTS.forEach((_, i) => {
    d[i] = {}
    DAYS.forEach(day => { d[i][day] = null })
  })
  return d
}

function fillSched(raw: { slot: number; day: string; entry: SchedEntry }[]): StudentSched {
  const d = makeEmpty()
  raw.forEach(({ slot, day, entry }) => { d[slot][day] = entry })
  return d
}


// AFTER optimization — all conflicts resolved
const AFTER_SCHEDS: Record<number, StudentSched> = {
  18: fillSched([
    { slot: 0, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
    { slot: 1, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
    { slot: 2, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
    { slot: 4, day: 'Monday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
    { slot: 4, day: 'Wednesday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
    { slot: 4, day: 'Friday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
    { slot: 6, day: 'Monday', entry: { code: 'CSS134-1', section: 'BM6', room: 'MPO504' } },
    { slot: 6, day: 'Wednesday', entry: { code: 'CSS134-1', section: 'BM6', room: 'MPO504' } },
    { slot: 6, day: 'Friday', entry: { code: 'CSS134-1', section: 'BM6', room: 'MPO504' } },
    { slot: 7, day: 'Monday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO401' } },
    { slot: 7, day: 'Wednesday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO401' } },
    { slot: 7, day: 'Friday', entry: { code: 'ITS150P', section: 'BM3', room: 'MPO401' } },
  ]),
  1: fillSched([
    { slot: 0, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
    { slot: 1, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
    { slot: 2, day: 'Tuesday', entry: { code: 'CSS152P', section: 'BM1', room: 'MPO304' } },
    { slot: 3, day: 'Monday', entry: { code: 'CSS134-1', section: 'BM3', room: 'MPO401' } },
    { slot: 3, day: 'Wednesday', entry: { code: 'CSS134-1', section: 'BM3', room: 'MPO401' } },
    { slot: 3, day: 'Friday', entry: { code: 'CSS134-1', section: 'BM3', room: 'MPO401' } },
    { slot: 4, day: 'Monday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
    { slot: 4, day: 'Wednesday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
    { slot: 4, day: 'Friday', entry: { code: 'CSS133-1', section: 'BM1', room: 'MPO602' } },
    { slot: 5, day: 'Monday', entry: { code: 'ITS150P', section: 'BM1', room: 'MPO409' } },
    { slot: 5, day: 'Wednesday', entry: { code: 'ITS150P', section: 'BM1', room: 'MPO409' } },
    { slot: 5, day: 'Friday', entry: { code: 'ITS150P', section: 'BM1', room: 'MPO409' } },
  ]),
  2: fillSched([
    { slot: 0, day: 'Monday', entry: { code: 'CSS133-1', section: 'BM4', room: 'MPO602' } },
    { slot: 0, day: 'Wednesday', entry: { code: 'CSS133-1', section: 'BM4', room: 'MPO602' } },
    { slot: 0, day: 'Friday', entry: { code: 'CSS133-1', section: 'BM4', room: 'MPO602' } },
    { slot: 1, day: 'Tuesday', entry: { code: 'ITS150P', section: 'BM4', room: 'MPO401' } },
    { slot: 1, day: 'Thursday', entry: { code: 'ITS150P', section: 'BM4', room: 'MPO401' } },
    { slot: 2, day: 'Wednesday', entry: { code: 'CSS152P', section: 'BM2', room: 'MPO304' } },
    { slot: 3, day: 'Wednesday', entry: { code: 'CSS152P', section: 'BM2', room: 'MPO304' } },
    { slot: 4, day: 'Wednesday', entry: { code: 'CSS152P', section: 'BM2', room: 'MPO304' } },
    { slot: 5, day: 'Tuesday', entry: { code: 'CSS134-1', section: 'BM5', room: 'MPO504' } },
    { slot: 5, day: 'Thursday', entry: { code: 'CSS134-1', section: 'BM5', room: 'MPO504' } },
  ]),
}

// Fill remaining students generically for AFTER
MOCK_STUDENTS.forEach(s => {
  if (AFTER_SCHEDS[s.id]) return
  const seed = s.id
  const raw: { slot: number; day: string; entry: SchedEntry }[] = []
  const base = seed % 4
  raw.push({ slot: base, day: 'Monday', entry: { code: 'CSS133-1', section: `BM${seed % 6 + 1}`, room: 'MPO602' } })
  raw.push({ slot: base + 1, day: 'Monday', entry: { code: 'CSS133-1', section: `BM${seed % 6 + 1}`, room: 'MPO602' } })
  raw.push({ slot: base + 2, day: 'Monday', entry: { code: 'CSS133-1', section: `BM${seed % 6 + 1}`, room: 'MPO602' } })
  raw.push({ slot: seed % 3, day: 'Tuesday', entry: { code: 'ITS150P', section: `BM${seed % 5 + 1}`, room: 'MPO401' } })
  raw.push({ slot: seed % 3 + 1, day: 'Tuesday', entry: { code: 'ITS150P', section: `BM${seed % 5 + 1}`, room: 'MPO401' } })
  raw.push({ slot: 2, day: 'Wednesday', entry: { code: 'CSS152P', section: `BM${seed % 7 + 1}`, room: 'MPO304' } })
  raw.push({ slot: 3, day: 'Wednesday', entry: { code: 'CSS152P', section: `BM${seed % 7 + 1}`, room: 'MPO304' } })
  raw.push({ slot: 4, day: 'Wednesday', entry: { code: 'CSS152P', section: `BM${seed % 7 + 1}`, room: 'MPO304' } })
  raw.push({ slot: 5, day: 'Monday', entry: { code: 'CSS134-1', section: `BM${seed % 4 + 1}`, room: 'MPO504' } })
  raw.push({ slot: 5, day: 'Wednesday', entry: { code: 'CSS134-1', section: `BM${seed % 4 + 1}`, room: 'MPO504' } })
  raw.push({ slot: 5, day: 'Friday', entry: { code: 'CSS134-1', section: `BM${seed % 4 + 1}`, room: 'MPO504' } })
  AFTER_SCHEDS[s.id] = fillSched(raw)
})

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [role, setRole] = useState<Role>('student')

  // Student state
  const [activeTerm, setActiveTerm] = useState('TERM 3')
  const [activeNav, setActiveNav] = useState('schedule')
  const [schoolYear, setSchoolYear] = useState('2025-2026')
  const [profileOpen, setProfileOpen] = useState(true)

  // Admin state
  const [adminNav, setAdminNav] = useState('students')
  const [courseFilter, setCourseFilter] = useState('')
  const [studentFilter, setStudentFilter] = useState('')
  const [optimizerState, setOptimizerState] = useState<'idle' | 'running' | 'done'>('done')
  const [optimizerLog, setOptimizerLog] = useState<string[]>([])
  const [assignFilter, setAssignFilter] = useState('')
  const [activeStudentCompId, setActiveStudentCompId] = useState<number>(18)
  // API results: keyed by studentId → StudentSched
  const [apiSchedules, setApiSchedules] = useState<Record<number, StudentSched>>({})
  const [apiError, setApiError] = useState<string | null>(null)

    // Helper: get courses and their schedules for any student
    function getStudentCourses(sid: number) {
      const assigned = MOCK_ASSIGNMENTS.filter(a => a.studentId === sid)
      if (assigned.length > 0) return assigned

      const student = MOCK_STUDENTS.find(s => s.id === sid)
      const studentName = student ? student.name : 'Unknown'
      
      const courseKeys = [
        { code: 'CSS133-1', sec: `BM${(sid % 6) + 1}` },
        { code: 'ITS150P', sec: `BM${(sid % 5) + 1}` },
        { code: 'CSS152P', sec: `BM${(sid % 7) + 1}` },
        { code: 'CSS134-1', sec: `BM${(sid % 4) + 1}` },
      ]

      return courseKeys.map(({ code, sec }) => {
        const found = MOCK_COURSES.find(c => c.courseCode === code && c.section === sec)
        return {
          studentId: sid,
          studentName,
          courseCode: code,
          section: sec,
          instructor: found ? found.instructor : 'TBA',
          schedule: found ? found.schedule : 'MWF 7:00AM-8:10AM'
        }
      })
    }

    // Helper: parse schedule string like "MWF 9:20AM-10:30AM" or "Tue 7:00AM-9:20AM"
    // into timeslots array for the API
    function parseScheduleToTimeslots(schedStr: string): { time: string; day: string }[] {
      const DAY_MAP: Record<string, string[]> = {
        'M': ['Monday'], 'T': ['Tuesday'], 'W': ['Wednesday'],
        'Th': ['Thursday'], 'F': ['Friday'], 'Sat': ['Saturday'],
        'MWF': ['Monday', 'Wednesday', 'Friday'],
        'TTh': ['Tuesday', 'Thursday'],
        'Mon': ['Monday'], 'Tue': ['Tuesday'], 'Wed': ['Wednesday'],
        'Thu': ['Thursday'], 'Fri': ['Friday'],
      }
      const parts = schedStr.split(' ')
      const dayPart = parts[0]
      const timePart = parts.slice(1).join(' ').replace('–', '-').replace('—', '-')
      const days = DAY_MAP[dayPart] ?? [dayPart]
      return days.map(day => ({ time: timePart.toLowerCase(), day }))
    }

    // Helper: parse API response row string "COURSECODE-SECTION" -> { code, section }
    function parseCellStr(cell: string): { code: string; section: string } | null {
      if (!cell || cell === 'Free' || cell === 'free') return null
      const lastDash = cell.lastIndexOf('-')
      if (lastDash === -1) return { code: cell, section: '' }
      return { code: cell.slice(0, lastDash), section: cell.slice(lastDash + 1) }
    }

    try {
      const steps = [
        '⟶ Initializing state-space tree …',
        '⟶ Loading 20 students, 28 course sections …',
        '⟶ Sending data to backtracking optimizer …',
      ]
      for (const step of steps) {
        setOptimizerLog(prev => [...prev, step])
        await new Promise(r => setTimeout(r, 150))
      }

      const newApiSchedules: Record<number, StudentSched> = {}

      // Call API for all 20 students dynamically
      const studentIds = MOCK_STUDENTS.map(s => s.id)

      for (const sid of studentIds) {
        const student = MOCK_STUDENTS.find(s => s.id === sid)
        if (!student) continue

        const studentAssignments = getStudentCourses(sid)
        const coursesPayload = studentAssignments.map(a => ({
          coursecode: a.courseCode,
          section: a.section,
          instructor: a.instructor,
          units: 3,
          timeslots: parseScheduleToTimeslots(a.schedule),
        }))

        setOptimizerLog(prev => [...prev, `⟶ Scheduling ${student.name} (${coursesPayload.length} courses) …`])

        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student: { id: student.id, name: student.name }, courses: coursesPayload }),
        })

        if (!res.ok) throw new Error(`HTTP ${res.status} for student ${student.name}`)

        const data = await res.json()
        if (!data.success || !Array.isArray(data.schedule)) {
          throw new Error(`Unexpected API response for ${student.name}`)
        }

        // Parse the 13×7 grid into StudentSched
        const sched = makeEmpty()
        const apiGrid: string[][] = data.schedule
        apiGrid.forEach((row, si) => {
          DAYS.forEach((day, di) => {
            const cell = row[di] ?? 'Free'
            const parsed = parseCellStr(cell)
            if (parsed) {
              sched[si][day] = { code: parsed.code, section: parsed.section, room: '' }
            }
          })
        })
        newApiSchedules[sid] = sched
      }

      setApiSchedules(newApiSchedules)
      setOptimizerLog(prev => [...prev,
        '⟶ All constraints satisfied …',
        `✅ Optimization complete — ${studentIds.length} students scheduled.`,
      ])
      setOptimizerState('done')

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setApiError(`API error: ${msg}`)
      setOptimizerLog(prev => [...prev, `❌ Error: ${msg}`])
      setOptimizerState('done')
    }
  }

  const filteredStudents = MOCK_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(studentFilter.toLowerCase()) ||
    String(s.id).includes(studentFilter)
  )
  const filteredCourses = MOCK_COURSES.filter(c =>
    c.courseCode.toLowerCase().includes(courseFilter.toLowerCase()) ||
    c.section.toLowerCase().includes(courseFilter.toLowerCase()) ||
    c.instructor.toLowerCase().includes(courseFilter.toLowerCase())
  )
  const filteredAssignments = MOCK_ASSIGNMENTS.filter(a =>
    a.studentName.toLowerCase().includes(assignFilter.toLowerCase()) ||
    a.courseCode.toLowerCase().includes(assignFilter.toLowerCase())
  )

  const fullSections = MOCK_COURSES.filter(c => c.enrolled >= c.capacity).length

  return (
    <div className="p-root">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="p-header">
        <img src={headerImg} className="p-header__logo-img" alt="myMAPUA" />
        {role === 'admin' && (
          <div className="p-header__role-badge">
            <span className="p-header__role-text">Registrar Portal</span>
          </div>
        )}
      </header>

      <div className="p-body">

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className="p-sidebar">

          {/* ── STUDENT SIDEBAR ─────────────────────────────────────────── */}
          {role === 'student' && (
            <ul className="sb-list">
              {STUDENT_NAV.map(item => {
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

              {/* Role switcher */}
              <li className="sb-divider" />
              <li>
                <button
                  id="btn-switch-to-admin"
                  className="sb-role-switch"
                  onClick={() => { setRole('admin'); setAdminNav('students') }}
                >
                  <span className="sb-role-switch__icon">🔑</span>
                  <span>Switch to Admin / Registrar</span>
                </button>
              </li>
            </ul>
          )}

          {/* ── ADMIN SIDEBAR ────────────────────────────────────────────── */}
          {role === 'admin' && (
            <ul className="sb-list">
              <li className="sb-portal-label">Registrar Portal</li>
              {ADMIN_NAV.map(item => (
                <li key={item.id}>
                  <button
                    id={`admin-nav-${item.id}`}
                    className={['sb-item', adminNav === item.id ? 'sb-item--active' : ''].filter(Boolean).join(' ')}
                    onClick={() => setAdminNav(item.id)}
                  >
                    <span className="sb-item__icon">{item.icon}</span>
                    <span className="sb-item__label">{item.label}</span>
                  </button>
                </li>
              ))}

              {/* Role switcher */}
              <li className="sb-divider" />
              <li>
                <button
                  id="btn-switch-to-student"
                  className="sb-role-switch"
                  onClick={() => { setRole('student'); setActiveNav('schedule') }}
                >
                  <span className="sb-role-switch__icon">🎓</span>
                  <span>Switch to Student View</span>
                </button>
              </li>
            </ul>
          )}
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="p-main">

          {/* ════════════════════════════════════════
              STUDENT VIEW
          ════════════════════════════════════════ */}
          {role === 'student' && (
            <>
              {activeNav === 'schedule' && (
                <div className="sched-page">
                  <h1 className="sched-page__title">My Schedule</h1>

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
                                const entry = apiSchedules[18]?.[si]?.[day] ?? SCHEDULE[si][day]
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

              {activeNav !== 'schedule' && (
                <div className="ph-page">
                  <div className="ph-inner">
                    <div className="ph-icon">📅</div>
                    <h2 className="ph-heading">
                      {STUDENT_NAV.find(n => n.id === activeNav)?.label ?? 'Page'}
                    </h2>
                    <p className="ph-body">This section is under development.</p>
                    <button className="ph-btn" onClick={() => setActiveNav('schedule')}>
                      ← Back to My Schedule
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════
              ADMIN / REGISTRAR VIEW
          ════════════════════════════════════════ */}
          {role === 'admin' && (
            <>



              {/* ── Students ──────────────────────────────── */}
              {adminNav === 'students' && (
                <div className="adm-page">
                  <div className="adm-page__topbar">
                    <h1 className="adm-page__title">Students</h1>
                    <input
                      id="student-search"
                      className="adm-search"
                      type="text"
                      placeholder="Search by name or ID…"
                      value={studentFilter}
                      onChange={e => setStudentFilter(e.target.value)}
                    />
                  </div>
                  <p className="adm-page__count">{filteredStudents.length} student(s) found</p>
                  <div className="adm-tbl-wrap">
                    <table className="adm-tbl">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Program</th>
                          <th>Year</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map(s => (
                          <tr key={s.id}>
                            <td className="adm-tbl__id">{s.id}</td>
                            <td className="adm-tbl__name">{s.name}</td>
                            <td>{s.program}</td>
                            <td className="adm-tbl__center">{s.year}</td>
                            <td><span className="badge badge--green">{s.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Courses & Sections ────────────────────── */}
              {adminNav === 'courses' && (
                <div className="adm-page">
                  <div className="adm-page__topbar">
                    <h1 className="adm-page__title">Courses &amp; Sections</h1>
                    <input
                      id="course-search"
                      className="adm-search"
                      type="text"
                      placeholder="Search by code, section, instructor…"
                      value={courseFilter}
                      onChange={e => setCourseFilter(e.target.value)}
                    />
                  </div>
                  <p className="adm-page__count">{filteredCourses.length} section(s) found</p>
                  <div className="adm-tbl-wrap">
                    <table className="adm-tbl">
                      <thead>
                        <tr>
                          <th>Course Code</th>
                          <th>Section</th>
                          <th>Instructor</th>
                          <th>Units</th>
                          <th>Schedule</th>
                          <th>Enrolled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map(c => {
                          const pct = Math.round((c.enrolled / c.capacity) * 100)
                          const isFull = c.enrolled >= c.capacity
                          return (
                            <tr key={c.id}>
                              <td className="adm-tbl__code">{c.courseCode}</td>
                              <td>{c.section}</td>
                              <td>{c.instructor}</td>
                              <td className="adm-tbl__center">{c.units}</td>
                              <td className="adm-tbl__sched">{c.schedule}</td>
                              <td className="adm-tbl__center">
                                <span className={isFull ? 'badge badge--red' : 'badge badge--blue'}>
                                  {c.enrolled}/{c.capacity}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Backtracking Algorithm ────────────────── */}
              {adminNav === 'optimizer' && (
                <div className="adm-page">
                  <h1 className="adm-page__title">Backtracking Algorithm</h1>
                  <p className="adm-page__sub">Configure constraints and run the state-space backtracking optimizer.</p>

                  <div className="opt-config opt-config--standalone">
                    <h2 className="opt-config__title">Constraints Configuration</h2>
                    <div className="opt-config__grid">
                      <div className="opt-cfg-item">
                        <label className="opt-cfg-item__label">Max Gap Between Classes</label>
                        <input className="opt-cfg-item__input" type="text" defaultValue="70 min" readOnly />
                      </div>
                      <div className="opt-cfg-item">
                        <label className="opt-cfg-item__label">Max Consecutive Duration</label>
                        <input className="opt-cfg-item__input" type="text" defaultValue="210 min" readOnly />
                      </div>
                      <div className="opt-cfg-item">
                        <label className="opt-cfg-item__label">Max Section Capacity</label>
                        <input className="opt-cfg-item__input" type="text" defaultValue="40 students" readOnly />
                      </div>
                      <div className="opt-cfg-item">
                        <label className="opt-cfg-item__label">Max Daily Load</label>
                        <input className="opt-cfg-item__input" type="text" defaultValue="280 min" readOnly />
                      </div>
                      <div className="opt-cfg-item">
                        <label className="opt-cfg-item__label">School Hours</label>
                        <input className="opt-cfg-item__input" type="text" defaultValue="7:00 AM – 9:00 PM" readOnly />
                      </div>
                      <div className="opt-cfg-item">
                        <label className="opt-cfg-item__label">Students to Process</label>
                        <input className="opt-cfg-item__input" type="text" defaultValue={`${MOCK_STUDENTS.length} students`} readOnly />
                      </div>
                    </div>
                    <button
                      id="btn-run-optimizer"
                      className="opt-run-btn"
                      onClick={runOptimizer}
                      disabled={optimizerState === 'running'}
                    >
                      {optimizerState === 'running' ? '⏳ Running…' : '▶ Run Backtracking Optimizer'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Algorithm Results ───────────────────────── */}
              {adminNav === 'results' && (
                <div className="adm-page">
                  <h1 className="adm-page__title">Algorithm Results</h1>
                  <p className="adm-page__sub">View how the Backtracking Algorithm resolved conflicts for each student's schedule.</p>

                  {optimizerState !== 'done' ? (
                    <div className="adm-notice">
                      ℹ️ Run the backtracking algorithm first to calculate optimized results.
                      <button className="adm-notice__btn" onClick={() => setAdminNav('optimizer')}>
                        Go to Backtracking Algorithm →
                      </button>
                    </div>
                  ) : (
                    <div className="sched-page" style={{ padding: 0 }}>

                      {/* Controls row — student picker + before/after toggle */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>

                        {/* Student dropdown */}
                        <div className="sched-controls" style={{ margin: 0 }}>
                          <label className="sched-controls__label" htmlFor="res-student-sel">Student</label>
                          <select
                            id="res-student-sel"
                            className="sched-controls__select"
                            value={activeStudentCompId}
                            onChange={e => setActiveStudentCompId(Number(e.target.value))}
                          >
                            {MOCK_STUDENTS.map(s => (
                              <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Schedule table — identical structure to student "My Schedule" */}
                      <div className="tbl-wrap">
                        <div className="tbl-scroll">
                          <table className="sched-tbl" aria-label="Student Schedule">
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
                              {TIME_SLOTS.map((slot, si) => {
                                // Prefer real API data; fall back to mock
                                const sched = apiSchedules[activeStudentCompId] ?? AFTER_SCHEDS[activeStudentCompId]
                                return (
                                  <tr key={si} className="tbl-tr">
                                    <td className="tbl-td--time">
                                      <span className="tbl-time-from">{slot.start}</span>
                                      <span className="tbl-time-to">{slot.end}</span>
                                    </td>
                                    {DAYS.map(day => {
                                      const entry = sched?.[si]?.[day] ?? null
                                      const isConflict = entry?.conflict === true
                                      const isGap = entry?.gap === true
                                      return (
                                        <td
                                          key={day}
                                          className={[
                                            'tbl-td',
                                            day === 'Saturday' ? 'tbl-td--sat' : '',
                                            entry ? 'tbl-td--filled' : '',
                                          ].filter(Boolean).join(' ')}
                                          style={
                                            isConflict ? { background: '#ffebee' } :
                                              isGap ? { background: '#fff8e1' } :
                                                undefined
                                          }
                                        >
                                          {entry && (
                                            <div className="cc">
                                              <span className="cc__code" style={isConflict ? { color: '#c62828', fontWeight: 700 } : isGap ? { color: '#e65100', fontWeight: 700 } : undefined}>
                                                {entry.code}
                                              </span>
                                              <span className="cc__section">{entry.section}</span>
                                              <span className="cc__room" style={isConflict ? { color: '#c62828' } : isGap ? { color: '#e65100' } : undefined}>
                                                {entry.room}
                                              </span>
                                            </div>
                                          )}
                                        </td>
                                      )
                                    })}
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* API error notice */}
                      {apiError && (
                        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fff3e0', border: '1px solid #ffcc80', borderRadius: '6px', fontSize: '12px', color: '#e65100' }}>
                          ⚠️ {apiError} — showing mock schedule data instead.
                        </div>
                      )}

                    </div>
                  )}
                </div>
              )}

            </>
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
