import React, { useState, useEffect } from 'react';
import TelemetryDashboard from './TelemetryDashboard';

function App() {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    if (window.api && window.api.onTelemetryUpdate) {
      window.api.onTelemetryUpdate((data) => {
        setTelemetry(data);
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
      
      <main className="app-content">
        <TelemetryDashboard telemetry={telemetry} />
      </main>
    </div>
  );
}

export default App;
