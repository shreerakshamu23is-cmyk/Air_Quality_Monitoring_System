import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setLastUpdated(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0, padding: 0 }}>
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {activeNav === 'Dashboard' && <Dashboard lastUpdated={lastUpdated} />}

      {activeNav !== 'Dashboard' && (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#f0f2f5',
          flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontSize: 48 }}>🚧</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{activeNav}</div>
          <div style={{ color: '#64748b' }}>This page is coming soon</div>
        </div>
      )}
    </div>
  )
}
