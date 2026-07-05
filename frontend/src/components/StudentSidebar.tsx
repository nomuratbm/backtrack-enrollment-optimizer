import { STUDENT_NAV } from '../types'

// ─── StudentSidebar ───────────────────────────────────────────────────────────
// Student-role sidebar navigation. Extracted from App to prevent re-renders of
// unrelated subtrees (rerender-no-inline-components).

type Props = {
  activeNav: string
  profileOpen: boolean
  onNavChange: (id: string) => void
  onProfileToggle: () => void
  onSwitchToAdmin: () => void
}

export function StudentSidebar({
  activeNav,
  profileOpen,
  onNavChange,
  onProfileToggle,
  onSwitchToAdmin,
}: Props) {
  return (
    <ul className="sb-list">
      {STUDENT_NAV.map(item => {
        if (item.isGroup) {
          return (
            <li key={item.id}>
              <button
                className="sb-group"
                onClick={onProfileToggle}
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
              onClick={() => onNavChange(item.id)}
            >
              {item.icon ? <span className="sb-item__icon">{item.icon}</span> : null}
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
          onClick={onSwitchToAdmin}
        >
          <span className="sb-role-switch__icon">🔑</span>
          <span>Switch to Admin / Registrar</span>
        </button>
      </li>
    </ul>
  )
}
