import React from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
)

const LABELS = ['6AM','8AM','10AM','12PM','2PM','4PM','6PM','8PM','10PM','12AM','2AM','4AM','Now']
const DATA   = [72, 90, 110, 120, 130, 140, 135, 120, 100, 90, 85, 80, 120]

export default function AQIChart() {
  const chartData = {
    labels: LABELS,
    datasets: [{
      label: 'AQI',
      data: DATA,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      borderWidth: 2.5,
      pointRadius: 4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      tension: 0.45,
      fill: true,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#94a3b8',
        bodyColor: '#f1f5f9',
        padding: 10,
        callbacks: { label: (ctx) => ` AQI: ${ctx.parsed.y}` },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#94a3b8', font: { size: 12 } },
      },
      y: {
        min: 60, max: 160,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#94a3b8', font: { size: 12 }, stepSize: 10 },
      },
    },
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      padding: '24px 28px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      border: '1px solid #e8ecf0', marginBottom: 24,
    }}>
      <div style={{
        fontSize: 18, fontWeight: 700, color: '#0f172a',
        textAlign: 'center', marginBottom: 18,
      }}>
        AQI Trend (24 Hours)
      </div>
      <Line data={chartData} options={options} />
    </div>
  )
}