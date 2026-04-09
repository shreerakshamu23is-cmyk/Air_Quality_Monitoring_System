import React from 'react'
import { useAirQuality } from '../hooks/useAirQuality'
import { useTheme } from '../contexts/ThemeContext'
import Navbar from '../components/Navbar'
import AQICard, { AQIMainCard } from '../components/AQICard'
import AQIChart from '../components/Chart'

export default function Dashboard({ lastUpdated }) {
  const { stations, cityData: data, loading, error, refresh } = useAirQuality()
  const { isDark } = useTheme()

  // ✅ Loading UI
  if (loading) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background: isDark ? '#1a202c' : '#f0f2f5', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:40 }}>🌀</div>
      <div style={{ fontSize:16, fontWeight:600, color: isDark ? '#cbd5e1' : '#64748b' }}>Fetching live AQI data...</div>
    </div>
  )

  // ✅ Error UI
  if (error) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background: isDark ? '#1a202c' : '#f0f2f5', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:40 }}>⚠️</div>
      <div style={{ fontSize:16, fontWeight:600, color: isDark ? '#ef4444' : '#ef4444' }}>{error}</div>
      <button onClick={refresh} style={{ padding:'8px 20px', borderRadius:8, background: isDark ? '#2d3748' : '#0f172a', color:'#fff', border:'none', cursor:'pointer' }}>Retry</button>
    </div>
  )

  // ✅ REAL DATA CALCULATIONS
  const minAQI = Math.min(...stations.map(s => s.aqi))
  const maxAQI = Math.max(...stations.map(s => s.aqi))
  const avgAQI = Math.round(stations.reduce((sum, s) => sum + s.aqi, 0) / stations.length)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', background: isDark ? '#1a202c' : '#f0f2f5' }}>

      <Navbar lastUpdated={lastUpdated} />

      {/* Top Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 18,
        marginBottom: 24,
      }}>
        <AQIMainCard aqi={data.aqi} />
        <AQICard label="PM2.5" value={data.pm25} unit="μg/m³" borderColor="#3b82f6" />
        <AQICard label="PM10"  value={data.pm10} unit="μg/m³" borderColor="#8b5cf6" />
        <AQICard label="O₃"    value={data.o3}   unit="μg/m³" borderColor="#22c55e" />
      </div>

      {/* Chart */}
      <AQIChart />

      {/* ✅ REAL Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 18,
        marginBottom: 24,
      }}>
        {[
          { label: 'Min AQI', value: minAQI, color: '#22c55e', sub: 'lowest station' },
          { label: 'Max AQI', value: maxAQI, color: '#ef4444', sub: 'highest station' },
          { label: 'Average AQI', value: avgAQI, color: '#f59e0b', sub: 'all stations' },
          { label: 'Stations Active', value: `${stations.length}/${stations.length}`, color: '#3b82f6', sub: 'live data' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff',
            borderRadius: 16,
            padding: '18px 22px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            border: '1px solid #e8ecf0',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 12,
              color: '#94a3b8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 6
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 800,
              color: s.color
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: 11,
              color: '#94a3b8',
              marginTop: 2
            }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Health Advisory */}
      <div style={{
        background: isDark ? '#2d3748' : '#fff',
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        border: `1px solid ${isDark ? '#475569' : '#e8ecf0'}`,
      }}>
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: isDark ? '#f1f5f9' : '#0f172a',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          🛡 Health Advisory — Bangalore
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 12
        }}>
          {[
            {
              bg:'#fffbeb', border:'#fde68a', tc:'#92400e',
              title:'⚠️ Who is at Risk?',
              text:'Children, elderly, pregnant women and people with respiratory conditions.'
            },
            {
              bg:'#f0fdf4', border:'#bbf7d0', tc:'#166534',
              title:'✅ Recommended Actions',
              text:'Limit outdoor activity. Use masks and stay hydrated.'
            },
            {
              bg:'#eff6ff', border:'#bfdbfe', tc:'#1e40af',
              title:'💡 Air Quality Status',
              text:`Current AQI is ${data.aqi}. Take precautions if sensitive.`
            },
          ].map(h => (
            <div key={h.title} style={{
              background: h.bg,
              border: `1px solid ${h.border}`,
              borderRadius: 10,
              padding: '12px 14px',
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: h.tc,
                marginBottom: 4
              }}>
                {h.title}
              </div>
              <div style={{
                fontSize: 12,
                color: '#374151',
                lineHeight: 1.5
              }}>
                {h.text}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}