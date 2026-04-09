import React from 'react'

const navItems = [
  { label: 'Dashboard', icon: '🏠' },
  { label: 'Live Map',  icon: '🗺' },
  { label: 'Stations',  icon: '📍' },
  { label: 'Analytics', icon: '📈' },
  { label: 'Reports',   icon: '📋' },
  { label: 'Settings',  icon: '⚙️' },
]

export default function Sidebar({ active, setActive }) {
  return (
    <aside style={{
      width: 230, background: '#0f172a', color: '#fff',
      display: 'flex', flexDirection: 'column',
      height: '100vh', flexShrink: 0,
    }}>
      <div style={{
        padding: '24px 24px 20px',
        fontSize: 20, fontWeight: 700, color: '#f59e0b',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        marginBottom: 12,
      }}>
        AQI Monitor
      </div>

      {navItems.map(item => (
        <div
          key={item.label}
          onClick={() => setActive(item.label)}
          style={{
            padding: '12px 24px', cursor: 'pointer',
            fontSize: 15, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 10,
            borderLeft: active === item.label
              ? '3px solid #f59e0b' : '3px solid transparent',
            background: active === item.label
              ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: active === item.label ? '#f59e0b' : '#cbd5e1',
            transition: 'all 0.15s',
          }}
        >
          <span>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </aside>
  )
}