import React, { useState, useRef } from 'react'

export default function LocationSearch({ onLocationFound, loading }) {
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const debounceTimer = useRef(null)

  const handleSearch = async (query) => {
    setSearchInput(query)
    
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    // Debounce the search
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      setSearching(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
        )
        const data = await response.json()
        setSuggestions(data.map(item => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        })))
      } catch (err) {
        console.error('Search failed:', err)
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 500)
  }

  const handleSelect = (suggestion) => {
    onLocationFound(suggestion)
    setSearchInput('')
    setSuggestions([])
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 12,
      }}>
        <div style={{
          flex: 1,
          position: 'relative',
        }}>
          <input
            type="text"
            placeholder="🔍 Search location (e.g., 'Delhi', 'Times Square')"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 13,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: loading ? '#f8fafc' : '#fff',
              cursor: loading ? 'not-allowed' : 'text',
              ':focus': {
                borderColor: '#3b82f6',
              },
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              marginTop: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 10,
              maxHeight: 200,
              overflowY: 'auto',
            }}>
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(suggestion)}
                  style={{
                    padding: '10px 14px',
                    borderBottom: idx < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: '#334155',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f8fafc'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
                >
                  📍 {suggestion.name.split(',')[0]}
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    {suggestion.lat.toFixed(4)}, {suggestion.lng.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {searching && (
            <div style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 12,
              color: '#64748b',
            }}>
              🔄
            </div>
          )}
        </div>
      </div>
    </div>
  )
}