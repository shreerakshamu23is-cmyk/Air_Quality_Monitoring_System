🌍 Air Quality Monitoring System

A real-time air quality dashboard built with React and Vite. It pulls live pollutant data from the OpenWeatherMap Air Pollution API for 60+ stations across Bengaluru and Karnataka, calculates AQI, and visualizes it through an interactive dashboard, live map, station explorer, analytics charts, and exportable reports.

Features

Live Dashboard — City-wide AQI, PM2.5, PM10, and O₃ summary cards that auto-refresh every 30 seconds, plus min/max/average AQI across all stations.

Interactive Live Map — Leaflet-based map with color-coded circle markers (Good → Severe) for every monitoring station, with popups showing pollutant breakdowns.

Stations Explorer — Searchable, filterable, sortable list of all stations with AQI, status badges, and pollutant details.

Analytics — Chart.js-powered bar, line, and doughnut charts (via react-chartjs-2) for weekly trends and pollutant comparisons.

Reports — Area-wise AQI breakdowns and stat cards with trend indicators; supports exporting reports (PDF generation via jspdf + html2canvas).
Location Search — Search any place using the OpenStreetMap Nominatim API and fetch live AQI for that location.

Geolocation — Automatically detects the user's current location and adds a "📍 Your Location" station with live AQI.
Dark / Light Theme — Toggleable theme persisted to localStorage via a React Context provider.

AQI Calculation — Converts raw PM2.5/PM10 concentrations into standard AQI values and status labels (Good, Satisfactory, Moderate, Poor, Very Poor, Severe) using EPA breakpoint interpolation.

Tech Stack

Layer	Tech                  Framework	React 18 + Vite 5
Mapping                    	Leaflet, React-Leaflet
Charts	                    Chart.js, react-chartjs-2
PDF                         Export	jsPDF, html2canvas
Data Source                	OpenWeatherMap Air Pollution API
Geocoding                  	OpenStreetMap Nominatim API
Linting	                    ESLint 9

Monitored Locations

The app tracks 60+ locations, including major Bengaluru neighborhoods (Whitefield, Koramangala, Indiranagar, HSR Layout, Electronic City, etc.) and Karnataka districts (Mysuru, Mangaluru, Hubballi, Belagavi, and more), plus a demo comparison point (Delhi).

How AQI Is Calculated

For each station, the app fetches raw PM2.5 and PM10 concentrations (µg/m³) from OpenWeatherMap and converts them to a US EPA-style AQI using standard breakpoint interpolation, taking the higher of the two sub-indices as the final AQI:

AQI Range	Status
0–50	  Good
51–100	Satisfactory
101–200	Moderate
201–300	Poor
301–400	Very Poor
400+	  Severe
Notes
Live data refreshes automatically every 10 minutes; dashboard timestamps refresh every 30 seconds.
Requires browser geolocation permission to show AQI for "Your Location."
Requires a valid OpenWeatherMap API key — without it, station data calls will fail.
## Live Demo

🔗 [airqualitymonitoringsystemm.vercel.app](https://airqualitymonitoringsystemm.vercel.app/)
