/* eslint-disable no-console */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork, spawn } = require('child_process');
const http = require('http');

let serverProc = null;
let viteProc = null;

function waitForUrl(url, timeoutMs = 30000, intervalMs = 500) {
  const start = Date.now();
  return new Promise((resolve) => {
    const tryOnce = () => {
      const req = http.get(url, (res) => {
        res.destroy();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) return resolve(false);
        setTimeout(tryOnce, intervalMs);
      });
      req.setTimeout(intervalMs, () => {
        req.destroy();
      });
    };
    tryOnce();
  });
}

function launchServer(port) {
  const serverPath = path.join(__dirname, '..', 'server');
  const env = { ...process.env, PORT: String(port) };
  // Use fork so we don't depend on external node binary and get nice lifecycle
  const child = fork(path.join(serverPath, 'index.js'), [], {
    cwd: serverPath,
    env,
    stdio: 'inherit',
  });
  return child;
}

async function ensureVite(vitePort) {
  const viteUrl = `http://localhost:${vitePort}`;
  const up = await waitForUrl(viteUrl, 1500);
  if (up) return { viteUrl, spawned: false };

  const clientCwd = path.join(__dirname, '..', 'client', 'my-app');
  viteProc = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd: clientCwd,
    env: process.env,
    stdio: 'inherit',
  });

  const ready = await waitForUrl(viteUrl, 30000);
  if (!ready) console.warn('Vite dev server did not become ready in time.');
  return { viteUrl, spawned: true };
}

async function createMainWindow() {
  const isDev = process.env.ELECTRON_DEV === '1';
  const port = Number(process.env.PORT) || 5000;

  serverProc = launchServer(port);
  const apiBaseUrl = `http://localhost:${port}`;

  // Preload reads this to expose API base URL to the renderer
  process.env.ELECTRON_API_BASE_URL = apiBaseUrl;

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  win.once('ready-to-show', () => win.show());

  if (isDev) {
    const vitePort = Number(process.env.VITE_PORT) || 5173;
    const { viteUrl } = await ensureVite(vitePort);
    await win.loadURL(viteUrl);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexHtml = path.join(__dirname, '..', 'client', 'my-app', 'dist', 'index.html');
    await win.loadFile(indexHtml);
  }
}

function cleanup() {
  if (viteProc && !viteProc.killed) {
    try { viteProc.kill(); } catch (_) {}
  }
  if (serverProc && !serverProc.killed) {
    try { serverProc.kill(); } catch (_) {}
  }
}

app.on('before-quit', cleanup);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createMainWindow();
});

app.whenReady().then(createMainWindow).catch((err) => {
  console.error('Failed to start app:', err);
  cleanup();
  app.quit();
});