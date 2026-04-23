const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let mainWindow;
let port;
let mockInterval;

const MOCK_MODE = true; // Will fallback to this if serial connect fails
const COMM_PORT = process.platform === 'win32' ? 'COM3' : '/dev/ttyUSB0'; // Default port

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load Vite Dev Server in development or index.html in production
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    if (process.argv.includes('--vite')) {
      mainWindow.loadURL('http://localhost:5173');
    } else {
      // If we are not waiting for vite dev server (e.g. running 'start')
      mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html')).catch(() => {
        mainWindow.loadURL('http://localhost:5173');
      });
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startMockMode() {
  console.log('[Mock Mode] Generating simulated telemetry data...');
  let seq = 0;
  
  mockInterval = setInterval(() => {
    if (!mainWindow) return;

    seq++;
    const telemetry = {
      type: 'telemetry',
      device: 1,
      seq: seq,
      lat: 18.6012345 + (Math.random() - 0.5) * 0.001,
      lon: 73.8012345 + (Math.random() - 0.5) * 0.001,
      alt_m: (12.5 + Math.random() * 2).toFixed(1),
      heading: (245.3 + Math.random() * 5).toFixed(1),
      roll: ((Math.random() - 0.5) * 10).toFixed(1),
      pitch: ((Math.random() - 0.5) * 5).toFixed(1),
      gps_sats: Math.floor(6 + Math.random() * 6), // 6 to 11
      geofence_ok: Math.random() > 0.1, // 90% true
      obstacle: Math.random() > 0.9, // 10% true
      battery_pct: Math.max(0, 100 - Math.floor(seq / 10)),
      rssi: -50 - Math.floor(Math.random() * 40)
    };

    mainWindow.webContents.send('telemetry-update', telemetry);
  }, 250); // ~4 Hz
}

function initSerial() {
  console.log(`[Serial] Attempting connection on ${COMM_PORT} at 115200 baud...`);
  
  port = new SerialPort({
    path: COMM_PORT,
    baudRate: 115200,
    autoOpen: false,
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  port.open((err) => {
    if (err) {
      console.warn(`[Serial] Warning: Failed to open port ${COMM_PORT}: ${err.message}`);
      console.warn('[Serial] Falling back to Mock Mode.');
      startMockMode();
      return;
    }
    console.log('[Serial] Connection successful!');
  });

  port.on('close', () => {
    console.log('[Serial] Port closed.');
    if (!mockInterval) startMockMode();
  });

  port.on('error', (err) => {
    console.error(`[Serial] Error: ${err.message}`);
  });

  parser.on('data', (data) => {
    if (!mainWindow) return;
    try {
      const parsedData = JSON.parse(data.trim());
      if (parsedData.type === 'telemetry') {
        mainWindow.webContents.send('telemetry-update', parsedData);
      }
    } catch (e) {
      // Ignore malformed lines gracefully as required
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  initSerial();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (mockInterval) clearInterval(mockInterval);
  if (port && port.isOpen) port.close();
});
