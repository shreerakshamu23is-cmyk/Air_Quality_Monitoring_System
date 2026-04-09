import React from 'react'

function getStatus(aqi) {
  if (aqi <= 50)  return { label: 'Good',         color: '#22c55e' }
  if (aqi <= 100) return { label: 'Satisfactory',  color: '#84cc16' }
  if (aqi <= 200) return { label: 'Moderate',      color: '#f59e0b' }
  if (aqi <= 300) return { label: 'Poor',          color: '#ef4444' }
  return             { label: 'Very Poor',        color: '#a855f7' }
}

export function AQIMainCard({ aqi }) {
  const status = getStatus(aqi)
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      padding: '22px 26px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      border: '1px solid #e8ecf0',
      borderTop: `4px solid ${status.color}`,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>
        Current AQI
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: 6 }}>
        {aqi}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: status.color }}>
        {status.label}
      </div>
    </div>
  )
}

export default function AQICard({ label, value, unit, borderColor }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      padding: '22px 26px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      border: '1px solid #e8ecf0',
      borderTop: `4px solid ${borderColor || '#3b82f6'}`,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{unit}</div>
    </div>
  )
  
}