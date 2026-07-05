import { useState } from 'react'
import './App.css'
import headerImg from './assets/headerV2_2.png'

import { type Role } from './types'
import { StudentSidebar } from './components/StudentSidebar'
import { AdminSidebar } from './components/AdminSidebar'
import { ScheduleView } from './views/student/ScheduleView'
import { StudentsView } from './views/admin/StudentsView'
import { CoursesView } from './views/admin/CoursesView'
import { OptimizerView } from './views/admin/OptimizerView'
import { ResultsView } from './views/admin/ResultsView'

// ─── App ──────────────────────────────────────────────────────────────────────
// Slim orchestrator: owns only routing/navigation state and delegates all
// rendering to focused sub-components (rerender-no-inline-components).
function App() {
  // Default: open directly in Registrar Portal — Algorithm Results
  const [role, setRole] = useState<Role>('admin')

  // Student state
  const [activeTerm, setActiveTerm] = useState('TERM 3')
  const [activeNav, setActiveNav] = useState('schedule')
  const [schoolYear, setSchoolYear] = useState('2025-2026')
  const [profileOpen, setProfileOpen] = useState(true)

  // Admin state — default to Algorithm Results
  const [adminNav, setAdminNav] = useState('results')
  const [courseFilter, setCourseFilter] = useState('')
  const [studentFilter, setStudentFilter] = useState('')

  // Stable callbacks using functional setState (rerender-functional-setstate)
  const handleSwitchToAdmin = () => { setRole('admin'); setAdminNav('results') }
  const handleSwitchToStudent = () => { setRole('student'); setActiveNav('schedule') }
  const handleProfileToggle = () => setProfileOpen(o => !o)

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
          {role === 'student' ? (
            <StudentSidebar
              activeNav={activeNav}
              profileOpen={profileOpen}
              onNavChange={setActiveNav}
              onProfileToggle={handleProfileToggle}
              onSwitchToAdmin={handleSwitchToAdmin}
            />
          ) : (
            <AdminSidebar
              adminNav={adminNav}
              onNavChange={setAdminNav}
              onSwitchToStudent={handleSwitchToStudent}
            />
          )}
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="p-main">

          {/* ════════════ STUDENT VIEW ════════════ */}
          {role === 'student' && (
            <ScheduleView
              activeNav={activeNav}
              activeTerm={activeTerm}
              schoolYear={schoolYear}
              onTermChange={setActiveTerm}
              onYearChange={setSchoolYear}
              onBack={() => setActiveNav('schedule')}
            />
          )}

          {/* ════════════ ADMIN / REGISTRAR VIEW ════════════ */}
          {role === 'admin' && (
            <>
              {adminNav === 'students' && (
                <StudentsView
                  studentFilter={studentFilter}
                  onFilterChange={setStudentFilter}
                />
              )}
              {adminNav === 'courses' && (
                <CoursesView
                  courseFilter={courseFilter}
                  onFilterChange={setCourseFilter}
                />
              )}
              {adminNav === 'optimizer' && <OptimizerView />}
              {adminNav === 'results' && <ResultsView />}
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
