import React, { useState, useEffect } from 'react';
import TelemetryDashboard from './TelemetryDashboard';
import MapPanel from './MapPanel';

function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (window.api && window.api.onTelemetryUpdate) {
      window.api.onTelemetryUpdate((data) => {
        setTelemetry(data);
        if (data.lat !== undefined && data.lon !== undefined) {
          setPath(prevPath => {
            const newPath = [...prevPath, [data.lat, data.lon]];
            if (newPath.length > 200) {
               newPath.shift(); // Keep only the last 200 points
            }
            return newPath;
          });
        }
      });
    } else {
      console.warn("window.api.onTelemetryUpdate is not available. Ensure preload script is loaded.");
    }
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GCS | Ground Control Station</h1>
        <div className="connection-status">
          <span className={`status-indicator ${telemetry ? 'active' : 'inactive'}`}></span>
          {telemetry ? 'Connected (Receiving)' : 'Waiting for Telemetry...'}
        </div>
      </header>
      
      <main className="app-content split-layout">
        <div className="left-panel">
          <TelemetryDashboard telemetry={telemetry} />
        </div>
        <div className="right-panel">
          <MapPanel telemetry={telemetry} path={path} />
        </div>
      </main>
    </div>
  );
}

export default App;
