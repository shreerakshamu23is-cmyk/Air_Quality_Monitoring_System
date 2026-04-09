import React, { useState } from 'react'
import { useAirQuality } from '../hooks/useAirQuality'
import { useTheme } from '../contexts/ThemeContext'

function getColor(aqi) {
  if (aqi <= 50)  return '#22c55e'
  if (aqi <= 100) return '#84cc16'
  if (aqi <= 200) return '#f59e0b'
  if (aqi <= 300) return '#ef4444'
  return '#a855f7'
}

function getBadge(status) {
  const map = {
    'Good':         { bg: '#dcfce7', color: '#16a34a' },
    'Satisfactory': { bg: '#ecfccb', color: '#65a30d' },
    'Moderate':     { bg: '#fef9c3', color: '#ca8a04' },
    'Poor':         { bg: '#fee2e2', color: '#dc2626' },
    'Very Poor':    { bg: '#f3e8ff', color: '#9333ea' },
  }
  return map[status] || { bg: '#f1f5f9', color: '#64748b' }
}

export default function Stations() {
  const { stations, loading, error, refresh } = useAirQuality()
  const { isDark } = useTheme()
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('All')
  const [selected, setSelected] = useState(null)
  const [sortBy,   setSortBy]   = useState('aqi')

  if (loading) return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: isDark ? '#1a202c' : '#f0f2f5',
      flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontSize: 40 }}>🌀</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#cbd5e1' : '#64748b' }}>
        Loading live station data...
      </div>
    </div>
  )

  if (error) return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: isDark ? '#1a202c' : '#f0f2f5',
      flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#ef4444' }}>{error}</div>
      <button onClick={refresh} style={{
        padding: '8px 20px', borderRadius: 8,
        background: '#0f172a', color: '#fff',
        border: 'none', cursor: 'pointer', fontSize: 13,
      }}>
        Retry
      </button>
    </div>
  )

  const areas = ['All', 'North', 'South', 'East', 'West', 'Central']

  const filtered = stations
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'All' || s.area === filter)
    )
    .sort((a, b) => sortBy === 'aqi' ? b.aqi - a.aqi : a.name.localeCompare(b.name))

  const poorCount = stations.filter(s => s.aqi > 200).length
  const cityAvg   = stations.length
    ? Math.round(stations.reduce((sum, s) => sum + s.aqi, 0) / stations.length)
    : 0

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', background: isDark ? '#1a202c' : '#f0f2f5' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
          📍 Monitoring Stations
        </h1>
        <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 13, marginTop: 4 }}>
          {stations.length} active stations across Bangalore — live data
        </p>
      </div>

      {/* Summary Cards — all LIVE values */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Stations', value: stations.length,  color: '#3b82f6', icon: '🏭' },
          { label: 'Online',         value: stations.length,  color: '#22c55e', icon: '✅' },
          { label: 'Poor AQI Zones', value: poorCount,        color: '#ef4444', icon: '⚠️' },
          { label: 'Avg City AQI',   value: cityAvg,          color: '#f59e0b', icon: '📊' },
        ].map(c => (
          <div key={c.label} style={{
            background: isDark ? '#2d3748' : '#fff', borderRadius: 14,
            padding: '16px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            border: `1px solid ${isDark ? '#475569' : '#e8ecf0'}`,
            borderTop: `3px solid ${c.color}`,
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#94a3b8', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {c.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: isDark ? '#2d3748' : '#fff', borderRadius: 14, padding: '14px 20px',
        marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        border: `1px solid ${isDark ? '#475569' : '#e8ecf0'}`,
        display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="🔍  Search station..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            border: `1px solid ${isDark ? '#64748b' : '#e2e8f0'}`, borderRadius: 8,
            padding: '7px 12px', fontSize: 13, outline: 'none',
            width: 200, fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {areas.map(a => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12,
                fontWeight: 600, cursor: 'pointer', border: 'none',
              background: filter === a ? '#0f172a' : isDark ? '#475569' : '#f1f5f9',
              color: filter === a ? '#fff' : isDark ? '#cbd5e1' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              {a}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            marginLeft: 'auto', border: `1px solid ${isDark ? '#64748b' : '#e2e8f0'}`,
            borderRadius: 8, padding: '7px 12px',
            fontSize: 13, outline: 'none',
            background: isDark ? '#475569' : '#fff', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <option value="aqi">Sort by AQI</option>
          <option value="name">Sort by Name</option>
        </select>
        <button
          onClick={refresh}
          style={{
            padding: '7px 14px', borderRadius: 8, fontSize: 12,
            fontWeight: 600, cursor: 'pointer', border: 'none',
            background: '#0f172a', color: '#fff',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: isDark ? '#2d3748' : '#fff', borderRadius: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        border: `1px solid ${isDark ? '#475569' : '#e8ecf0'}`, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 80px 80px 80px 80px 80px 90px 90px 90px',
          padding: '12px 20px', background: isDark ? '#475569' : '#f8fafc',
          borderBottom: `1px solid ${isDark ? '#64748b' : '#e2e8f0'}`,
          fontSize: 11, fontWeight: 700, color: isDark ? '#cbd5e1' : '#94a3b8',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <div>Station</div>
          <div style={{ textAlign:'center' }}>AQI</div>
          <div style={{ textAlign:'center' }}>PM2.5</div>
          <div style={{ textAlign:'center' }}>PM10</div>
          <div style={{ textAlign:'center' }}>NO₂</div>
          <div style={{ textAlign:'center' }}>O₃</div>
          <div style={{ textAlign:'center' }}>Status</div>
          <div style={{ textAlign:'center' }}>Uptime</div>
          <div style={{ textAlign:'center' }}>Updated</div>
        </div>

        {/* Rows */}
        {filtered.map((s, i) => (
          <div
            key={s.id}
            onClick={() => setSelected(selected?.id === s.id ? null : s)}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 80px 80px 80px 80px 80px 90px 90px 90px',
              padding: '13px 20px',
              borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
              cursor: 'pointer',
              background: selected?.id === s.id ? (isDark ? '#1e293b' : '#f0f9ff') : (i % 2 === 0 ? (isDark ? '#2d3748' : '#fff') : (isDark ? '#334155' : '#fafafa')),
              transition: 'background 0.15s',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: getColor(s.aqi), flexShrink: 0,
              }}/>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: isDark ? '#f1f5f9' : '#0f172a' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#94a3b8' }}>{s.area} Bangalore</div>
              </div>
            </div>
            <div style={{ textAlign:'center', fontWeight: 800, fontSize: 16, color: getColor(s.aqi) }}>
              {s.aqi}
            </div>
            {[s.pm25, s.pm10, s.no2, s.o3].map((val, idx) => (
              <div key={idx} style={{ textAlign:'center', fontSize: 13, fontWeight: 600, color: isDark ? '#cbd5e1' : '#374151' }}>
                {val}
              </div>
            ))}
            <div style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '3px 8px',
                background: getBadge(s.status).bg,
                color: getBadge(s.status).color,
              }}>
                {s.status}
              </span>
            </div>
            <div style={{ textAlign:'center', fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
              {s.uptime}
            </div>
            <div style={{ textAlign:'center', fontSize: 11, color: isDark ? '#cbd5e1' : '#94a3b8' }}>
              {s.lastUpdate}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Station Detail */}
      {selected && (
        <div style={{
          marginTop: 16, background: isDark ? '#2d3748' : '#fff', borderRadius: 16,
          padding: '20px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          border: `1px solid ${getColor(selected.aqi)}40`,
          borderLeft: `4px solid ${getColor(selected.aqi)}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#94a3b8' }}>
                {selected.area} Bangalore • {selected.lat}°N, {selected.lng}°E • Live Data
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: isDark ? '#cbd5e1' : '#94a3b8' }}
            >
              ✕
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
            {[
              { label: 'AQI',    value: selected.aqi,    unit: '',       color: getColor(selected.aqi) },
              { label: 'PM2.5',  value: selected.pm25,   unit: 'μg/m³', color: '#3b82f6' },
              { label: 'PM10',   value: selected.pm10,   unit: 'μg/m³', color: '#8b5cf6' },
              { label: 'NO₂',    value: selected.no2,    unit: 'μg/m³', color: '#f59e0b' },
              { label: 'O₃',     value: selected.o3,     unit: 'μg/m³', color: '#22c55e' },
              { label: 'Uptime', value: selected.uptime, unit: '',       color: '#22c55e' },
            ].map(p => (
              <div key={p.label} style={{
                background: isDark ? '#475569' : '#f8fafc', borderRadius: 10,
                padding: '12px', textAlign: 'center',
                border: `1px solid ${isDark ? '#64748b' : '#e8ecf0'}`,
              }}>
                <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#94a3b8', fontWeight: 600, marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: p.color }}>{p.value}</div>
                <div style={{ fontSize: 10, color: isDark ? '#cbd5e1' : '#94a3b8' }}>{p.unit}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}