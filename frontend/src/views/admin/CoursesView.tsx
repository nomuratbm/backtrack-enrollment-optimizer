import { COURSES, type CourseRow } from '../../types'
import { EmptyState } from '../../components/EmptyState'

// ─── CoursesView ──────────────────────────────────────────────────────────────
// Admin panel — Courses & Sections list with search filter.

type Props = {
  courseFilter: string
  onFilterChange: (value: string) => void
}

// Filtering is derived during render (rerender-derived-state-no-effect)
function getFilteredCourses(filter: string): CourseRow[] {
  const q = filter.toLowerCase()
  return COURSES.filter(c =>
    c.courseCode.toLowerCase().includes(q) ||
    c.section.toLowerCase().includes(q) ||
    c.instructor.toLowerCase().includes(q)
  )
}

export function CoursesView({ courseFilter, onFilterChange }: Props) {
  const filteredCourses = getFilteredCourses(courseFilter)

  return (
    <div className="adm-page">
      <div className="adm-page__topbar">
        <h1 className="adm-page__title">Courses &amp; Sections</h1>
        <input
          id="course-search"
          className="adm-search"
          type="text"
          placeholder="Search by code, section, instructor…"
          value={courseFilter}
          onChange={e => onFilterChange(e.target.value)}
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
            {filteredCourses.length === 0 ? (
              <EmptyState message="No courses available. Data will appear here once loaded." />
            ) : (
              filteredCourses.map(c => {
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
