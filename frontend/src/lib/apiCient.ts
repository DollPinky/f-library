// typescript
// File: frontend/src/lib/apiClient.ts
import axios from 'axios';

const PUBLIC_PATHS = [
'/api/v1/books/all',
'/api/v1/books/search',
// add other public endpoints here
];

const api = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // matches your vite proxy
withCredentials: false,
});

// attach token only for non-public endpoints
api.interceptors.request.use((config) => {
  try {
    const url = config.url || '';
    const isPublic = PUBLIC_PATHS.some((p) => url.startsWith(p));
    if (!isPublic) {
      const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken') || null;
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      // ensure no stale auth header is sent
      if (config.headers) delete config.headers['Authorization'];
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// example API function used by both Dashboard and HomePage
export async function getAllBooks() {
  const resp = await api.get('/v1/books/all'); // resolves to /api/v1/books/all via baseURL
  return resp.data;
}

export default api;