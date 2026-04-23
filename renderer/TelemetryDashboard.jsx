import React from 'react';

function TelemetryDashboard({ telemetry }) {
  if (!telemetry) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Awaiting Data Link...</p>
      </div>
    );
  }

  const {
    lat, lon, alt_m, heading, roll, pitch, gps_sats,
    geofence_ok, obstacle, battery_pct, rssi
  } = telemetry;

  return (
    <div className="telemetry-dashboard">
      <div className="card position-card">
        <h2>Position</h2>
        <div className="data-grid">
          <div className="data-item">
            <label>Latitude</label>
            <span>{typeof lat === 'number' ? lat.toFixed(7) : '--'}</span>
          </div>
          <div className="data-item">
            <label>Longitude</label>
            <span>{typeof lon === 'number' ? lon.toFixed(7) : '--'}</span>
          </div>
          <div className="data-item">
            <label>Altitude (m)</label>
            <span>{alt_m ?? '--'}</span>
          </div>
        </div>
      </div>

      <div className="card attitude-card">
        <h2>Attitude & Heading</h2>
        <div className="data-grid">
          <div className="data-item">
            <label>Heading</label>
            <span>{heading ?? '--'}°</span>
          </div>
          <div className="data-item">
            <label>Roll</label>
            <span>{roll ?? '--'}°</span>
          </div>
          <div className="data-item">
            <label>Pitch</label>
            <span>{pitch ?? '--'}°</span>
          </div>
        </div>
      </div>

      <div className="card status-card">
        <h2>System Status</h2>
        <div className="data-grid">
          <div className="data-item">
            <label>Battery</label>
            <span className={`battery-value ${battery_pct < 20 ? 'critical' : ''}`}>
              {battery_pct ?? '--'}%
            </span>
          </div>
          <div className="data-item">
            <label>GPS Sats</label>
            <span>{gps_sats ?? '--'}</span>
          </div>
          <div className="data-item">
            <label>RSSI</label>
            <span>{rssi ?? '--'} dBm</span>
          </div>
        </div>
      </div>

      <div className="card alerts-card">
        <h2>Safety & Alerts</h2>
        <div className="alerts-grid">
          <div className={`alert-item ${geofence_ok ? 'safe' : 'danger'}`}>
            <label>Geofence</label>
            <span>{geofence_ok ? 'INSIDE' : 'BREACH'}</span>
          </div>
          <div className={`alert-item ${obstacle ? 'danger' : 'safe'}`}>
            <label>Obstacle</label>
            <span>{obstacle ? 'DETECTED' : 'CLEAR'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelemetryDashboard;
