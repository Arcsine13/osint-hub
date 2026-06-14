// API configuration
// Import.meta.env values are replaced at build time by Vite
// NOTE: Template literals with import.meta.env can cause minifier issues, so use string concatenation

const API_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
    ? (import.meta.env.VITE_API_URL + '/api') 
    : '/api';

const SOCKET_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
    ? import.meta.env.VITE_API_URL 
    : window.location.origin;

export { API_URL, SOCKET_URL };
