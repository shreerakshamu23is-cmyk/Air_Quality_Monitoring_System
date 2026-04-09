 import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar({ lastUpdated }) {
  const { isDark } = useTheme()

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', marginBottom: 28,
    }}>
      <h1 style={{
        fontSize: 38, fontWeight: 800,
        color: isDark ? '#e2e8f0' : '#0f172a', margin: 0, lineHeight: 1.1,
      }}>
        Air Quality Dashboard
      </h1>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 14, color: isDark ? '#cbd5e1' : '#64748b', fontWeight: 500 }}>
          City: Bangalore
        </div>
        <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#94a3b8', marginTop: 4 }}>
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}