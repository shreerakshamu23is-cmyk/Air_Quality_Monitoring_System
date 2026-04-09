import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { useAirQuality } from '../hooks/useAirQuality'
import { useTheme } from '../contexts/ThemeContext'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler
)

const Analytics = () => {
  const { stations, loading, error } = useAirQuality()
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('weekly')

  // ✅ Safety checks
  if (loading) return <div style={{ padding: 40, background: isDark ? '#1a202c' : '#f8fafc', color: isDark ? '#cbd5e1' : '#64748b' }}>Loading analytics...</div>
  if (error) return <div style={{ padding: 40, background: isDark ? '#1a202c' : '#f8fafc', color: '#ef4444' }}>{error}</div>
  if (!stations.length) return <div style={{ padding: 40, background: isDark ? '#1a202c' : '#f8fafc', color: isDark ? '#cbd5e1' : '#64748b' }}>No data available</div>

  // ✅ LIVE CALCULATIONS
  const avgAQI = Math.round(
    stations.reduce((sum, s) => sum + s.aqi, 0) / stations.length
  )

  const bestStation = stations.reduce((a, b) =>
    a.aqi < b.aqi ? a : b
  )

  const worstStation = stations.reduce((a, b) =>
    a.aqi > b.aqi ? a : b
  )

  const maxPM25 = Math.max(...stations.map(s => s.pm25))

  // 📊 AQI Trend (live)
  const weeklyData = {
    labels: stations.map(s => s.name),
    datasets: [
      {
        label: 'AQI',
        data: stations.map(s => s.aqi),
        fill: true,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.1)',
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  }

  // 📊 Pollutants (live)
  const pollutantData = {
    labels: stations.map(s => s.name),
    datasets: [
      {
        label: 'PM2.5',
        data: stations.map(s => s.pm25),
        backgroundColor: '#ef4444',
      },
      {
        label: 'PM10',
        data: stations.map(s => s.pm10),
        backgroundColor: '#f59e0b',
      },
      {
        label: 'NO2',
        data: stations.map(s => s.no2),
        backgroundColor: '#eab308',
      },
      {
        label: 'O3',
        data: stations.map(s => s.o3),
        backgroundColor: '#22c55e',
      },
    ],
  }

  // 📊 AQI Category Split (live)
  const categories = {
    Good: 0,
    Satisfactory: 0,
    Moderate: 0,
    Poor: 0,
    'Very Poor': 0,
    Severe: 0,
  }

  stations.forEach(s => {
    if (categories[s.status] !== undefined) {
      categories[s.status]++
    }
  })

  const categoryData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          '#22c55e',
          '#84cc16',
          '#f59e0b',
          '#ef4444',
          '#a855f7',
          '#7f1d1d',
        ],
        borderWidth: 1,
      },
    ],
  }

  // 🎯 Stats cards (live)
  const stats = [
    { label: 'Avg AQI (Live)', value: avgAQI, color: '#f59e0b' },
    { label: 'Peak PM2.5', value: maxPM25 + ' µg/m³', color: '#ef4444' },
    { label: 'Best Zone', value: bestStation.name, color: '#22c55e' },
    { label: 'Worst Zone', value: worstStation.name, color: '#a855f7' },
  ]

  return (
    <div style={{
      padding: '28px',
      background: isDark ? '#1a202c' : '#f8fafc',
      flex: 1,
      height: '100vh',
      overflowY: 'auto'
    }}>

      {/* HEADER */}
      <h1 style={{ fontSize: 24, marginBottom: 20, color: isDark ? '#f1f5f9' : '#0f172a' }}>
        📊 Analytics
      </h1>

      {/* STATS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: isDark ? '#2d3748' : '#fff',
            padding: '20px',
            borderRadius: '12px',
            borderLeft: `5px solid ${s.color}`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}>
            <p style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#64748b' }}>{s.label}</p>
            <h2 style={{ margin: 0, color: isDark ? '#f1f5f9' : '#0f172a' }}>{s.value}</h2>
          </div>
        ))}
      </div>

      {/* AQI TREND */}
      <div style={{
        background: isDark ? '#2d3748' : '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>AQI Trend</h3>
        <Line data={weeklyData} />
      </div>

      {/* BOTTOM */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>

        {/* BAR */}
        <div style={{
          background: isDark ? '#2d3748' : '#fff',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Pollutants by Zone</h3>
          <Bar data={pollutantData} />
        </div>

        {/* DONUT */}
        <div style={{
          background: isDark ? '#2d3748' : '#fff',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>AQI Category Split</h3>
          <Doughnut data={categoryData} />
        </div>

      </div>
    </div>
  )
}

export default Analytics