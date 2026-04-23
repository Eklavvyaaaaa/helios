import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths in React/Electron
delete L.Icon.Default.prototype._getIconUrl;

// Use Base64 inline icons or standard Leaflet CDN paths if no assets are bundled
// However, since we are in Electron and might not have a public folder hooked up normally, CDN or base64 is safest.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter the map whenever the center prop changes
function RecenterAutomatically({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      map.setView([lat, lon]);
    }
  }, [lat, lon, map]);
  return null;
}

function MapPanel({ telemetry, path }) {
  const defaultLat = 18.6;
  const defaultLon = 73.8;
  const currentLat = telemetry?.lat ?? defaultLat;
  const currentLon = telemetry?.lon ?? defaultLon;
  const hasData = telemetry?.lat !== undefined && telemetry?.lon !== undefined;

  return (
    <div className="map-panel">
      <MapContainer 
        center={[currentLat, currentLon]} 
        zoom={16} 
        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {hasData && (
          <>
            <Marker position={[currentLat, currentLon]} />
            <Polyline positions={path} color="var(--accent-color)" weight={4} opacity={0.7} />
            <RecenterAutomatically lat={currentLat} lon={currentLon} />
          </>
        )}
      </MapContainer>
      
      {!hasData && (
        <div className="map-overlay">
          <span>Awaiting GPS Fix...</span>
        </div>
      )}
    </div>
  );
}

export default MapPanel;
