import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '32px 36px',
      background: isDark ? '#1a202c' : '#f0f2f5',
      color: isDark ? '#e2e8f0' : '#0f172a'
    }}>
      <h1 style={{
        fontSize: 38,
        fontWeight: 800,
        color: isDark ? '#e2e8f0' : '#0f172a',
        marginBottom: 28,
        lineHeight: 1.1,
      }}>
        Settings
      </h1>

      <div style={{
        background: isDark ? '#2d3748' : '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{
          fontSize: 24,
          fontWeight: 600,
          marginBottom: 16,
          color: isDark ? '#e2e8f0' : '#0f172a'
        }}>
          Appearance
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{
            fontSize: 16,
            fontWeight: 500,
            color: isDark ? '#cbd5e1' : '#64748b'
          }}>
            Theme:
          </span>

          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: isDark ? '#4a5568' : '#e2e8f0',
              color: isDark ? '#e2e8f0' : '#0f172a',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>
    </div>
  )
}
