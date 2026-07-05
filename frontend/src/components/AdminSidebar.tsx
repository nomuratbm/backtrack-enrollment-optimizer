import { ADMIN_NAV } from '../types'

// ─── AdminSidebar ─────────────────────────────────────────────────────────────
// Admin / Registrar sidebar navigation. Extracted from App to prevent re-renders
// of unrelated subtrees (rerender-no-inline-components).

type Props = {
  adminNav: string
  onNavChange: (id: string) => void
  onSwitchToStudent: () => void
}

export function AdminSidebar({ adminNav, onNavChange, onSwitchToStudent }: Props) {
  return (
    <ul className="sb-list">
      <li className="sb-portal-label">Registrar Portal</li>
      {ADMIN_NAV.map(item => (
        <li key={item.id}>
          <button
            id={`admin-nav-${item.id}`}
            className={['sb-item', adminNav === item.id ? 'sb-item--active' : ''].filter(Boolean).join(' ')}
            onClick={() => onNavChange(item.id)}
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
          onClick={onSwitchToStudent}
        >
          <span className="sb-role-switch__icon">🎓</span>
          <span>Switch to Student View</span>
        </button>
      </li>
    </ul>
  )
}
