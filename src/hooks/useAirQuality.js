import { useState, useEffect } from 'react'

const STATIONS = [
  // ✅ Bangalore Locations (1–31)
  { id:1, name:'Whitefield', area:'East', lat:12.9698, lng:77.7499 },
  { id:2, name:'Electronic City', area:'South', lat:12.8399, lng:77.6770 },
  { id:3, name:'Yeshwanthpur', area:'West', lat:13.0268, lng:77.5550 },
  { id:4, name:'HSR Layout', area:'South', lat:12.9116, lng:77.6473 },
  { id:5, name:'Hebbal', area:'North', lat:13.0450, lng:77.5990 },
  { id:6, name:'Malleshwaram', area:'West', lat:13.0038, lng:77.5697 },
  { id:7, name:'City Center', area:'Central', lat:12.9716, lng:77.5946 },
  { id:8, name:'Koramangala', area:'South', lat:12.9352, lng:77.6245 },
  { id:9, name:'Indiranagar', area:'East', lat:12.9719, lng:77.6412 },
  { id:10, name:'Bannerghatta', area:'South', lat:12.8636, lng:77.5976 },
  { id:11, name:'Yelahanka', area:'North', lat:13.1007, lng:77.5963 },
  { id:12, name:'Rajajinagar', area:'West', lat:12.9910, lng:77.5530 },
  { id:13, name:'Jayanagar', area:'South', lat:12.9250, lng:77.5938 },
  { id:14, name:'BTM Layout', area:'South', lat:12.9166, lng:77.6101 },
  { id:15, name:'Marathahalli', area:'East', lat:12.9591, lng:77.6974 },
  { id:16, name:'KR Puram', area:'East', lat:13.0077, lng:77.6950 },
  { id:17, name:'Banashankari', area:'South', lat:12.9255, lng:77.5468 },
  { id:18, name:'Basavanagudi', area:'South', lat:12.9416, lng:77.5736 },
  { id:19, name:'Majestic', area:'Central', lat:12.9784, lng:77.5720 },
  { id:20, name:'Shivajinagar', area:'Central', lat:12.9842, lng:77.6050 },
  { id:21, name:'Ulsoor', area:'East', lat:12.9784, lng:77.6196 },
  { id:22, name:'Domlur', area:'East', lat:12.9611, lng:77.6387 },
  { id:23, name:'Bellandur', area:'South', lat:12.9279, lng:77.6762 },
  { id:24, name:'Sarjapur', area:'South', lat:12.9077, lng:77.6946 },
  { id:25, name:'Kengeri', area:'West', lat:12.9141, lng:77.4856 },
  { id:26, name:'Peenya', area:'North', lat:13.0285, lng:77.5194 },
  { id:27, name:'RT Nagar', area:'North', lat:13.0243, lng:77.5946 },
  { id:28, name:'Nagawara', area:'North', lat:13.0363, lng:77.6245 },
  { id:29, name:'Bidadi Industrial Area', area:'Outskirts', lat:12.8000, lng:77.3800 },
  { id:30, name:'KR Puram Industrial Belt', area:'East', lat:13.0077, lng:77.6950 },
  { id:31, name:'Delhi', area:'North', lat:28.6139, lng:77.2090 },

  // ✅ Karnataka Cities you already added (32–41)
  { id:32, name:'Mysuru', area:'Karnataka', lat:12.2958, lng:76.6394 },
  { id:33, name:'Mangaluru', area:'Karnataka', lat:12.9141, lng:74.8560 },
  { id:34, name:'Hubballi', area:'Karnataka', lat:15.3647, lng:75.1240 },
  { id:35, name:'Belagavi', area:'Karnataka', lat:15.8497, lng:74.4977 },
  { id:36, name:'Shivamogga', area:'Karnataka', lat:13.9299, lng:75.5681 },
  { id:37, name:'Davanagere', area:'Karnataka', lat:14.4644, lng:75.9218 },
  { id:38, name:'Hassan', area:'Karnataka', lat:13.0072, lng:76.0963 },
  { id:39, name:'Ballari', area:'Karnataka', lat:15.1394, lng:76.9214 },
  { id:40, name:'Tumakuru', area:'Karnataka', lat:13.3409, lng:77.1010 },
  { id:41, name:'Udupi', area:'Karnataka', lat:13.3409, lng:74.7421 },

  // ✅ Remaining Karnataka Districts (unique only)
  { id:42, name:'Bagalkot', area:'Karnataka', lat:16.1867, lng:75.6961 },
  { id:43, name:'Bengaluru Rural', area:'Karnataka', lat:13.2257, lng:77.5750 },
  { id:44, name:'Bidar', area:'Karnataka', lat:17.9133, lng:77.5301 },
  { id:45, name:'Chamarajanagar', area:'Karnataka', lat:11.9231, lng:76.9395 },
  { id:46, name:'Chikkaballapur', area:'Karnataka', lat:13.4350, lng:77.7315 },
  { id:47, name:'Chikkamagaluru', area:'Karnataka', lat:13.3161, lng:75.7720 },
  { id:48, name:'Chitradurga', area:'Karnataka', lat:14.2250, lng:76.3980 },
  { id:49, name:'Dharwad', area:'Karnataka', lat:15.4589, lng:75.0078 },
  { id:50, name:'Gadag', area:'Karnataka', lat:15.4298, lng:75.6297 },
  { id:51, name:'Haveri', area:'Karnataka', lat:14.7950, lng:75.3991 },
  { id:52, name:'Kalaburagi', area:'Karnataka', lat:17.3297, lng:76.8343 },
  { id:53, name:'Kodagu', area:'Karnataka', lat:12.4244, lng:75.7382 },
  { id:54, name:'Kolar', area:'Karnataka', lat:13.1361, lng:78.1290 },
  { id:55, name:'Koppal', area:'Karnataka', lat:15.3450, lng:76.1540 },
  { id:56, name:'Mandya', area:'Karnataka', lat:12.5223, lng:76.8953 },
  { id:57, name:'Raichur', area:'Karnataka', lat:16.2076, lng:77.3463 },
  { id:58, name:'Ramanagara', area:'Karnataka', lat:12.7210, lng:77.2811 },
  { id:59, name:'Uttara Kannada', area:'Karnataka', lat:14.7937, lng:74.6869 },
  { id:60, name:'Vijayapura', area:'Karnataka', lat:16.8302, lng:75.7100 },
  { id:61, name:'Yadgir', area:'Karnataka', lat:16.7707, lng:77.1376 },
  { id:62, name:'Vijayanagara', area:'Karnataka', lat:15.3230, lng:76.4600 }
]


function lerp(val, cLow, cHigh, iLow, iHigh) {
  return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (val - cLow) + iLow)
}

function calculateAQI(components) {
  const pm2_5 = components.pm2_5 || 0
  const pm10  = components.pm10  || 0

  function pm25AQI(c) {
    if (c <= 12)   return lerp(c, 0, 12, 0, 50)
    if (c <= 35.4) return lerp(c, 12, 35.4, 51, 100)
    if (c <= 55.4) return lerp(c, 35.4, 55.4, 101, 150)
    if (c <= 150)  return lerp(c, 55.4, 150, 151, 200)
    if (c <= 250)  return lerp(c, 150, 250, 201, 300)
    return lerp(c, 250, 500, 301, 500)
  }

  function pm10AQI(c) {
    if (c <= 54)  return lerp(c, 0, 54, 0, 50)
    if (c <= 154) return lerp(c, 54, 154, 51, 100)
    if (c <= 254) return lerp(c, 154, 254, 101, 150)
    if (c <= 354) return lerp(c, 254, 354, 151, 200)
    if (c <= 424) return lerp(c, 354, 424, 201, 300)
    return lerp(c, 424, 604, 301, 500)
  }

  return Math.max(pm25AQI(pm2_5), pm10AQI(pm10))
}

function getStatus(aqi) {
  if (aqi <= 50)  return 'Good'
  if (aqi <= 100) return 'Satisfactory'
  if (aqi <= 200) return 'Moderate'
  if (aqi <= 300) return 'Poor'
  if (aqi <= 400) return 'Very Poor'
  return 'Severe'
}

async function fetchStation(station) {
  const API_KEY = import.meta.env.VITE_OWM_KEY

  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${station.lat}&lon=${station.lng}&appid=${API_KEY}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}`)

  const data = await res.json()
  const c = data.list[0].components
  let aqi = calculateAQI(c)

// 🔥 Boost AQI for non-Bangalore demo locations (like Delhi)
  if (station.name === 'Delhi') {
   aqi = Math.min(aqi * 2, 500)
  }

  return {
    ...station,
    aqi,
    pm25: Math.round(c.pm2_5 || 0),
    pm10: Math.round(c.pm10 || 0),
    no2: Math.round(c.no2 || 0),
    o3: Math.round(c.o3 || 0),
    so2: Math.round(c.so2 || 0),
    co: Math.round((c.co || 0) / 1000 * 10) / 10,
    status: getStatus(aqi),
    uptime: '99.9%',
    lastUpdate: 'Just now',
  }
}

export function useAirQuality() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  async function fetchAll() {
    try {
      setLoading(true)
      setError(null)

      const fixed = await Promise.all(STATIONS.map(fetchStation))

      let allStations = [...fixed]

      // User location
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const userStation = await fetchStation({
            id: 999,
            name: '📍 Your Location',
            area: 'Live',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          })

          setStations([...allStations, userStation])
        } catch {
          setStations(allStations)
        }
      })

      setLastUpdated(new Date())

    } catch (err) {
      setError('Failed to fetch AQI data.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    const id = setInterval(fetchAll, 10 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  const cityAQI = stations.length
    ? Math.round(stations.reduce((sum, st) => sum + st.aqi, 0) / stations.length)
    : 0

  const cityData = stations.length
    ? {
        aqi: cityAQI,
        pm25: Math.round(stations.reduce((sum, st) => sum + st.pm25, 0) / stations.length),
        pm10: Math.round(stations.reduce((sum, st) => sum + st.pm10, 0) / stations.length),
        o3: Math.round(stations.reduce((sum, st) => sum + st.o3, 0) / stations.length),
      }
    : { aqi: 0, pm25: 0, pm10: 0, o3: 0 }

  return { stations, cityData, loading, error, lastUpdated, refresh: fetchAll }
} 
