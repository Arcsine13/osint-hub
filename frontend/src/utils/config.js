// API configuration
// Uses relative paths - Vercel rewrites /api/* to the backend in production
// Vite proxies /api/* to the backend in development

const API_URL = '/api';
const SOCKET_URL = window.location.origin;

export { API_URL, SOCKET_URL };
