export const isElectron = Boolean(
  typeof window !== 'undefined' &&
  window.process &&
  window.process.versions &&
  window.process.versions.electron
);

export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const w = window;
    if (w.__API_BASE_URL__) return w.__API_BASE_URL__;
    if (w.appConfig && w.appConfig.apiBaseUrl) return w.appConfig.apiBaseUrl;
  }
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (process && process.env) ? process.env : {};
  const fromEnv = env.VITE_API_BASE_URL || env.API_BASE_URL || env.REACT_APP_API_BASE_URL;
  return fromEnv || 'http://localhost:5000';
}

export function apiUrl(path = '') {
  const base = getApiBaseUrl();
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path;
  return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}