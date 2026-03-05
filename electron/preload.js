const { contextBridge } = require('electron');

const apiBaseUrl = process.env.ELECTRON_API_BASE_URL || 'http://localhost:5000';

contextBridge.exposeInMainWorld('appConfig', {
  apiBaseUrl,
});

// Some client code reads this directly
try {
  // eslint-disable-next-line no-undef
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-undef
    window.__API_BASE_URL__ = apiBaseUrl;
  }
} catch (_) {}