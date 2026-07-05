import { STUDENTS, type StudentRow } from '../../types'
import { EmptyState } from '../../components/EmptyState'

// ─── StudentsView ─────────────────────────────────────────────────────────────
// Admin panel — Students list with search filter.

type Props = {
  studentFilter: string
  onFilterChange: (value: string) => void
}

// Filtering is derived during render (rerender-derived-state-no-effect)
function getFilteredStudents(filter: string): StudentRow[] {
  const q = filter.toLowerCase()
  return STUDENTS.filter(s =>
    s.name.toLowerCase().includes(q) || String(s.id).includes(q)
  )
}

export function StudentsView({ studentFilter, onFilterChange }: Props) {
  const filteredStudents = getFilteredStudents(studentFilter)

  return (
    <div className="adm-page">
      <div className="adm-page__topbar">
        <h1 className="adm-page__title">Students</h1>
        <input
          id="student-search"
          className="adm-search"
          type="text"
          placeholder="Search by name or ID…"
          value={studentFilter}
          onChange={e => onFilterChange(e.target.value)}
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
            {filteredStudents.length === 0 ? (
              <EmptyState message="No students available. Data will appear here once loaded." />
            ) : (
              filteredStudents.map(s => (
                <tr key={s.id}>
                  <td className="adm-tbl__id">{s.id}</td>
                  <td className="adm-tbl__name">{s.name}</td>
                  <td>{s.program}</td>
                  <td className="adm-tbl__center">{s.year}</td>
                  <td><span className="badge badge--green">{s.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
