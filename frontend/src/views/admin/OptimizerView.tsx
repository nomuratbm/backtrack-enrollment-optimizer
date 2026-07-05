import { CONSTRAINTS } from '../../types'

// ─── OptimizerView ────────────────────────────────────────────────────────────
// Admin panel — Backtracking Algorithm constraints table.
// CONSTRAINTS array is module-level (rendering-hoist-jsx), so no per-render
// allocation occurs.

export function OptimizerView() {
  return (
    <div className="adm-page">
      <h1 className="adm-page__title">Backtracking Algorithm</h1>
      <p className="adm-page__sub">
        Constraints enforced by the backtracking scheduler on each student's schedule.
      </p>

      <div className="adm-tbl-wrap">
        <table className="adm-tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Constraint</th>
              <th>Rule</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {CONSTRAINTS.map(c => (
              <tr key={c.num}>
                <td className="adm-tbl__center">{c.num}</td>
                <td className="adm-tbl__code">{c.name}</td>
                <td>{c.rule}</td>
                <td>{c.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
