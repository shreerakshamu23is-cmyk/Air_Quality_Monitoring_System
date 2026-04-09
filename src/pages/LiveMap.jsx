import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useAirQuality } from '../hooks/useAirQuality'
import { useTheme } from '../contexts/ThemeContext'

function getColor(aqi) {
  if (aqi <= 50)  return '#22c55e'
  if (aqi <= 100) return '#84cc16'
  if (aqi <= 200) return '#f59e0b'
  if (aqi <= 300) return '#ef4444'
  return '#a855f7'
}

function getBadgeStyle(status) {
  const map = {
    'Good':         { bg: '#dcfce7', color: '#16a34a' },
    'Satisfactory': { bg: '#ecfccb', color: '#65a30d' },
    'Moderate':     { bg: '#fef9c3', color: '#ca8a04' },
    'Poor':         { bg: '#fee2e2', color: '#dc2626' },
    'Very Poor':    { bg: '#f3e8ff', color: '#9333ea' },
  }
  return map[status] || { bg: '#f1f5f9', color: '#64748b' }
}

export default function LiveMap() {
  const { stations, loading, error } = useAirQuality()
  const { isDark } = useTheme()
  const [selected, setSelected] = useState(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (loading) return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: isDark ? '#1a202c' : '#f0f2f5',
      flexDirection: 'column', gap: 12,
      height: '100vh',
    }}>
      <div style={{ fontSize: 40 }}>🌀</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#cbd5e1' : '#64748b' }}>
        Loading live map data...
      </div>
    </div>
  )

  if (error) return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: isDark ? '#1a202c' : '#f0f2f5',
      flexDirection: 'column', gap: 12,
      height: '100vh',
    }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: '#ef4444' }}>{error}</div>
    </div>
  )

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: isDark ? '#1a202c' : '#f0f2f5',
      height: '100vh',        // ← KEY FIX
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{ padding: '24px 32px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
              🗺 Live Air Quality Map
            </h1>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 13, marginTop: 4 }}>
              Real-time AQI monitoring across {stations.length} stations in Bangalore
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#dcfce7', border: '1px solid #bbf7d0',
              borderRadius: 20, padding: '4px 12px',
              fontSize: 12, fontWeight: 700, color: '#16a34a',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#16a34a', display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }} />
              Live
            </div>
            <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#94a3b8', marginTop: 4 }}>
              {time.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Map + Right Panel */}
      <div style={{
        display: 'flex',
        flex: 1,
        gap: 16,
        padding: '0 32px 24px',
        minHeight: 0,          // ← KEY FIX — allows flex child to shrink
      }}>

        {/* Map */}
        <div style={{
          flex: 1,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
          minHeight: 0,        // ← KEY FIX
        }}>
          <MapContainer
            center={[20.5937, 78.9629]}  // India center
            zoom={5}
            style={{ height: '500px', width: '100%' }}
          >
          
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap &copy; CartoDB"
            />
            {stations.map(s => (
              <CircleMarker
                key={s.id}
                center={[s.lat, s.lng]}
                radius={s.aqi > 200 ? 22 : s.aqi > 100 ? 18 : 14}
                fillColor={getColor(s.aqi)}
                color="#fff"
                weight={2}
                fillOpacity={0.85}
                eventHandlers={{ click: () => setSelected(s) }}
              >
                <Popup>
                  <div style={{ fontFamily: 'Segoe UI, sans-serif', minWidth: 180, background: isDark ? '#334155' : '#f8fafc', color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
                      {s.name}
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', marginBottom: 8,
                    }}>
                      <div>
                        <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#64748b' }}>AQI</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: getColor(s.aqi) }}>
                          {s.aqi}
                        </div>
                      </div>
                      <div style={{
                        alignSelf: 'center',
                        background: getBadgeStyle(s.status).bg,
                        color: getBadgeStyle(s.status).color,
                        borderRadius: 6, padding: '3px 10px',
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {s.status}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {[
                        { label: 'PM2.5', value: `${s.pm25} μg/m³` },
                        { label: 'PM10',  value: `${s.pm10} μg/m³` },
                        { label: 'NO₂',   value: `${s.no2} μg/m³`  },
                        { label: 'O₃',    value: `${s.o3} μg/m³`   },
                      ].map(p => (
                        <div key={p.label} style={{
                          background: isDark ? '#475569' : '#f8fafc', borderRadius: 6,
                          padding: '6px 8px', textAlign: 'center',
                        }}>
                          <div style={{ fontSize: 10, color: isDark ? '#cbd5e1' : '#64748b', fontWeight: 600 }}>
                            {p.label}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{p.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Right Panel */}
        <div style={{
          width: 260,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflowY: 'auto',
          flexShrink: 0,       // ← KEY FIX
        }}>

          {/* Legend */}
          <div style={{
            background: isDark ? '#2d3748' : '#fff', borderRadius: 16, padding: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            border: `1px solid ${isDark ? '#475569' : '#e8ecf0'}`,
          }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: isDark ? '#f1f5f9' : '#0f172a' }}>
              🎨 AQI Legend
            </div>
            {[
              { label: 'Good',         range: '0–50',    color: '#22c55e' },
              { label: 'Satisfactory', range: '51–100',  color: '#84cc16' },
              { label: 'Moderate',     range: '101–200', color: '#f59e0b' },
              { label: 'Poor',         range: '201–300', color: '#ef4444' },
              { label: 'Very Poor',    range: '301+',    color: '#a855f7' },
            ].map(l => (
              <div key={l.label} style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: l.color, flexShrink: 0,
                }} />
                <span style={{ fontSize: 12, flex: 1 }}>{l.label}</span>
                <span style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#94a3b8', fontFamily: 'monospace' }}>
                  {l.range}
                </span>
              </div>
            ))}
          </div>

          {/* Station Rankings */}
          <div style={{
            background: isDark ? '#2d3748' : '#fff', borderRadius: 16, padding: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            border: `1px solid ${isDark ? '#475569' : '#e8ecf0'}`,
            flex: 1, minHeight: 0,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: isDark ? '#f1f5f9' : '#0f172a' }}>
              📍 Station Rankings
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {[...stations]
                .sort((a, b) => b.aqi - a.aqi)
                .map((s, i) => (
                  <div
                    key={s.id}
                    onClick={() => setSelected(s)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 8px', borderRadius: 8, cursor: 'pointer',
                      background: selected?.id === s.id ? (isDark ? '#1e293b' : '#f0f9ff') : 'transparent',
                      border: selected?.id === s.id
                        ? `1px solid ${isDark ? '#475569' : '#bae6fd'}` : '1px solid transparent',
                      marginBottom: 4, transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#94a3b8', minWidth: 16 }}>{i + 1}</span>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: getColor(s.aqi), flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 12, flex: 1, fontWeight: 500, color: isDark ? '#f1f5f9' : '#0f172a' }}>{s.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: getColor(s.aqi) }}>
                      {s.aqi}
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, borderRadius: 4, padding: '2px 5px',
                      background: getBadgeStyle(s.status).bg,
                      color: getBadgeStyle(s.status).color,
                    }}>
                      {s.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  )
}