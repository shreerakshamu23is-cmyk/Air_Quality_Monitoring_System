import './App.css'
import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import LiveMap from './pages/LiveMap'
import Stations from './pages/Stations'
import Reports from './pages/Reports'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

import { useAirQuality } from './hooks/useAirQuality'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
function ComingSoon({ activeNav }) {
  const { isDark } = useTheme()
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: isDark ? '#1a202c' : '#f0f2f5',
      flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: isDark ? '#e2e8f0' : '#0f172a' }}>{activeNav}</div>
      <div style={{ color: isDark ? '#cbd5e1' : '#64748b' }}>This page is coming soon</div>
    </div>
  )
}

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setLastUpdated(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <ThemeProvider>
      <div style={{ display: 'flex', height: '100vh', margin: 0, padding: 0 }}>
        <Sidebar active={activeNav} setActive={setActiveNav} />

        {activeNav === 'Dashboard' && <Dashboard lastUpdated={lastUpdated} />}
        {activeNav === 'Live Map' && <LiveMap />}
        {activeNav === 'Stations' && <Stations />}
        {activeNav === 'Reports' && <Reports />}
        {activeNav === 'Analytics' && <Analytics />}
        {activeNav === 'Settings' && <Settings />}

        {!['Dashboard','Live Map','Stations','Reports','Analytics','Settings'].includes(activeNav) && (
          <ComingSoon activeNav={activeNav} />
        )}
      </div>
    </ThemeProvider>
  )
}