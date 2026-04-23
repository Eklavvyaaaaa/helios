const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onTelemetryUpdate: (callback) => {
    // Remove all previous listeners to avoid duplicates, then add new one
    ipcRenderer.removeAllListeners('telemetry-update');
    ipcRenderer.on('telemetry-update', (event, data) => callback(data));
  }
});
