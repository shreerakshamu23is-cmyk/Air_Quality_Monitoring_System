import React, { useState } from 'react'
import { useAirQuality } from '../hooks/useAirQuality'
import Chart from '../components/Chart'
import { useTheme } from '../contexts/ThemeContext'

function getColor(aqi) {
  if (aqi <= 50) return '#22c55e'
  if (aqi <= 100) return '#84cc16'
  if (aqi <= 200) return '#f59e0b'
  if (aqi <= 300) return '#ef4444'
  return '#a855f7'
}

function getStatus(aqi) {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Satisfactory'
  if (aqi <= 200) return 'Moderate'
  if (aqi <= 300) return 'Poor'
  return 'Very Poor'
}

function StatCard({ icon, label, value, unit, trend, isDark }) {
  return (
    <div style={{
      background: isDark ? '#2d3748' : '#fff',
      borderRadius: 12,
      padding: 16,
      border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      flex: 1,
      minWidth: 180,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <div style={{ fontSize: 24 }}>{icon}</div>
        {trend !== undefined && (
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 4,
            background: trend > 0 ? '#fee2e2' : '#ecfccb',
            color: trend > 0 ? '#dc2626' : '#65a30d',
          }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#64748b', fontWeight: 600, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>
        {value}
        <span style={{ fontSize: 14, color: isDark ? '#cbd5e1' : '#94a3b8', marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  )
}

function AreaCard({ area, stations, avgAqi, isDark }) {
  const status = getStatus(avgAqi)
  const statusColors = {
    Good: { bg: '#dcfce7', color: '#16a34a' },
    Satisfactory: { bg: '#ecfccb', color: '#65a30d' },
    Moderate: { bg: '#fef9c3', color: '#ca8a04' },
    Poor: { bg: '#fee2e2', color: '#dc2626' },
    'Very Poor': { bg: '#f3e8ff', color: '#9333ea' },
  }
  const colors = statusColors[status]

  return (
    <div style={{
      background: isDark ? '#2d3748' : '#fff',
      borderRadius: 12,
      padding: 16,
      border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 4 }}>
            📍 {area}
          </div>
          <div style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#64748b' }}>
            {stations.length} stations
          </div>
        </div>
        <div style={{
          background: colors.bg,
          color: colors.color,
          padding: '6px 12px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          textAlign: 'right',
        }}>
          {status}
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: getColor(avgAqi), marginBottom: 8 }}>
        {Math.round(avgAqi)}
      </div>
      <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#94a3b8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'PM2.5', value: Math.round(stations.reduce((s, st) => s + st.pm25, 0) / stations.length) },
          { label: 'PM10', value: Math.round(stations.reduce((s, st) => s + st.pm10, 0) / stations.length) },
          { label: 'NO₂', value: Math.round(stations.reduce((s, st) => s + st.no2, 0) / stations.length) },
          { label: 'O₃', value: Math.round(stations.reduce((s, st) => s + st.o3, 0) / stations.length) },
        ].map(p => (
          <div key={p.label} style={{ background: isDark ? '#475569' : '#f8fafc', padding: '6px 8px', borderRadius: 6, fontSize: 11 }}>
            <div style={{ color: isDark ? '#cbd5e1' : '#64748b' }}>{p.label}</div>
            <div style={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a' }}>{p.value} μg/m³</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Reports() {
  const { stations, loading, error } = useAirQuality()
  const { isDark } = useTheme()
  const [sortBy, setSortBy] = useState('aqi')

  if (loading) return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: isDark ? '#1a202c' : '#f0f2f5',
      flexDirection: 'column', gap: 12, height: '100vh',
    }}>
      <div style={{ fontSize: 40 }}>📊</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#cbd5e1' : '#64748b' }}>
        Generating reports...
      </div>
    </div>
  )

  if (error) return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: isDark ? '#1a202c' : '#f0f2f5',
      flexDirection: 'column', gap: 12, height: '100vh',
    }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#ef4444' }}>{error}</div>
    </div>
  )

  // Calculate statistics
  const avgAqi = Math.round(stations.reduce((s, st) => s + st.aqi, 0) / stations.length)
  const poorStations = stations.filter(s => s.aqi > 200).length
  const badStations = stations.filter(s => getStatus(s.aqi) === 'Poor' || getStatus(s.aqi) === 'Very Poor').length
  const avgPm25 = Math.round(stations.reduce((s, st) => s + st.pm25, 0) / stations.length)

  // Group by area
  const areaMap = {}
  stations.forEach(st => {
    if (!areaMap[st.area]) areaMap[st.area] = []
    areaMap[st.area].push(st)
  })

  // Sort stations
  const sortedStations = [...stations].sort((a, b) => {
    if (sortBy === 'aqi') return b.aqi - a.aqi
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'pm25') return b.pm25 - a.pm25
    return 0
  })

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: isDark ? '#1a202c' : '#f0f2f5',
      height: '100vh',
      overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{ padding: '32px', flexShrink: 0, borderBottom: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`, background: isDark ? '#2d3748' : '#fff' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
          📊 Air Quality Reports
        </h1>
        <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 14, marginTop: 8 }}>
          Real-time analytics and insights for air quality monitoring
        </p>
      </div>

      <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        {/* Summary Statistics */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 16 }}>
            📈 Summary Statistics
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}>
            <StatCard isDark={isDark}
              icon="🌍"
              label="Average AQI"
              value={avgAqi}
              unit=""
              trend={-5}
            />
            <StatCard isDark={isDark}
              icon="⚠️"
              label="Stations in Poor Condition"
              value={badStations}
              unit={`of ${stations.length}`}
              trend={2}
            />
            <StatCard isDark={isDark}
              icon="🫁"
              label="Average PM2.5"
              value={avgPm25}
              unit="μg/m³"
              trend={-3}
            />
            <StatCard isDark={isDark}
              icon="📊"
              label="Total Monitoring Points"
              value={stations.length}
              unit="active"
              trend={0}
            />
          </div>
        </section>

        {/* Health Advisory */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 16 }}>
            ⚠️ Health Advisory
          </h2>
          <div style={{
            background: avgAqi <= 100 ? '#dcfce7' : avgAqi <= 200 ? '#fef9c3' : '#fee2e2',
            border: `2px solid ${avgAqi <= 100 ? '#bbf7d0' : avgAqi <= 200 ? '#fef08a' : '#fecaca'}`,
            borderRadius: 12,
            padding: 20,
            color: avgAqi <= 100 ? '#16a34a' : avgAqi <= 200 ? '#ca8a04' : '#dc2626',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              {avgAqi <= 50 ? '✅ Good Air Quality' : avgAqi <= 100 ? '✅ Satisfactory Air Quality' : avgAqi <= 200 ? '⚠️ Moderate Air Quality' : '❌ Poor Air Quality'}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: isDark ? '#cbd5e1' : '#374151' }}>
              {avgAqi <= 50
                ? 'Air quality is Good. Enjoy outdoor activities freely.'
                : avgAqi <= 100
                ? 'Air quality is Satisfactory. Sensitive groups should consider limiting prolonged outdoor exposure.'
                : avgAqi <= 200
                ? 'Air quality is Moderate. Sensitive groups should limit outdoor activities. General population can engage in outdoor activities with caution.'
                : 'Air quality is Poor. Everyone should avoid outdoor activities. Use air purifiers indoors. Wear N95 masks if outdoors.'}
            </div>
          </div>
        </section>

        {/* Area-wise Breakdown */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 16 }}>
            📍 Area-wise Breakdown
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 16,
          }}>
            {Object.entries(areaMap).map(([area, areaStations]) => {
              const area_avg_aqi = Math.round(areaStations.reduce((s, st) => s + st.aqi, 0) / areaStations.length)
              return (
                <AreaCard isDark={isDark}
                  key={area}
                  area={area}
                  stations={areaStations}
                  avgAqi={area_avg_aqi}
                />
              )
            })}
          </div>
        </section>

        {/* Pollutant Analysis Chart */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 16 }}>
            📊 Pollutant Analysis
          </h2>
          <div style={{
            background: isDark ? '#2d3748' : '#fff',
            borderRadius: 12,
            padding: 20,
            border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 16,
            }}>
              {[
                { label: 'PM2.5', value: avgPm25, color: '#ef4444' },
                { label: 'PM10', value: Math.round(stations.reduce((s, st) => s + st.pm10, 0) / stations.length), color: '#f59e0b' },
                { label: 'NO₂', value: Math.round(stations.reduce((s, st) => s + st.no2, 0) / stations.length), color: '#84cc16' },
                { label: 'O₃', value: Math.round(stations.reduce((s, st) => s + st.o3, 0) / stations.length), color: '#22c55e' },
              ].map(p => (
                <div key={p.label} style={{
                  textAlign: 'center',
                  padding: 16,
                  background: isDark ? '#475569' : '#f8fafc',
                  borderRadius: 8,
                  border: `1px solid ${isDark ? '#64748b' : '#e2e8f0'}`,
                }}>
                  <div style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#64748b', fontWeight: 600, marginBottom: 8 }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: p.color, marginBottom: 4 }}>
                    {p.value}
                  </div>
                  <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#94a3b8' }}>
                    μg/m³
                  </div>
                  <div style={{
                    marginTop: 12,
                    height: 4,
                    background: isDark ? '#64748b' : '#e2e8f0',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      background: p.color,
                      width: `${Math.min((p.value / 200) * 100, 100)}%`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Station Health Report */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
              🏥 Station Health Report
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {['aqi', 'pm25', 'name'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                  background: sortBy === sort ? '#3b82f6' : isDark ? '#475569' : '#f1f5f9',
                  color: sortBy === sort ? '#fff' : isDark ? '#cbd5e1' : '#64748b',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => !['aqi', 'pm25', 'name'].includes(sortBy === sort ? '' : sort) && (e.target.style.background = '#f1f5f9')}
                >
                  {sort === 'aqi' ? '⬇️ AQI' : sort === 'pm25' ? '⬇️ PM2.5' : '⬇️ Name'}
                </button>
              ))}
            </div>
          </div>
          <div style={{
            background: isDark ? '#2d3748' : '#fff',
            borderRadius: 12,
            border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
              gap: 0,
              padding: '12px 16px',
              background: isDark ? '#475569' : '#f8fafc',
              fontWeight: 600,
              fontSize: 12,
              color: isDark ? '#cbd5e1' : '#64748b',
              borderBottom: `1px solid ${isDark ? '#64748b' : '#e2e8f0'}`,
            }}>
              <div>Station Name</div>
              <div>AQI</div>
              <div>PM2.5</div>
              <div>Area</div>
              <div>Status</div>
            </div>
            {sortedStations.map((station, idx) => {
              const status = getStatus(station.aqi)
              const statusColors = {
                'Good': { bg: '#dcfce7', color: '#16a34a' },
                'Satisfactory': { bg: '#ecfccb', color: '#65a30d' },
                'Moderate': { bg: '#fef9c3', color: '#ca8a04' },
                'Poor': { bg: '#fee2e2', color: '#dc2626' },
                'Very Poor': { bg: '#f3e8ff', color: '#9333ea' },
              }
              const colors = statusColors[status]
              return (
                <div
                  key={station.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
                    gap: 0,
                    padding: '12px 16px',
                    borderBottom: idx < sortedStations.length - 1 ? '1px solid #f1f5f9' : 'none',
                    alignItems: 'center',
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a' }}>{station.name}</div>
                  <div style={{ fontWeight: 700, color: getColor(station.aqi), fontSize: 14 }}>
                    {station.aqi}
                  </div>
                  <div style={{ color: isDark ? '#cbd5e1' : '#64748b' }}>{station.pm25} μg/m³</div>
                  <div style={{ color: isDark ? '#cbd5e1' : '#64748b', fontSize: 12 }}>{station.area}</div>
                  <div style={{
                    display: 'inline-block',
                    background: colors.bg,
                    color: colors.color,
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    textAlign: 'center',
                    width: 'fit-content',
                  }}>
                    {status}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: isDark ? '#cbd5e1' : '#94a3b8',
          fontSize: 12,
          marginTop: 32,
          paddingTop: 16,
          borderTop: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
        }}>
          Last updated: {new Date().toLocaleTimeString()} | Data refreshes every 10 minutes
        </div>
      </div>
    </div>
  )
} 