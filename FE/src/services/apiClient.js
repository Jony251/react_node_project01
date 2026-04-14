import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || '';

const api = axios.create({ baseURL: BASE, withCredentials: false });

/* ── attach access token to every request ─────────────── */
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('accessToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* ── silent refresh on 401 (expired access token) ─────── */
let refreshing = null;

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    const status   = err.response?.status;
    const expired  = err.response?.data?.expired;

    if (status === 401 && expired && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = axios
          .post(`${BASE}/api/auth/refresh`, {
            refreshToken: localStorage.getItem('refreshToken'),
          })
          .then(r => {
            localStorage.setItem('accessToken',  r.data.accessToken);
            localStorage.setItem('refreshToken', r.data.refreshToken);
            return r.data.accessToken;
          })
          .catch(refreshErr => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth:logout'));
            return Promise.reject(refreshErr);
          })
          .finally(() => { refreshing = null; });
      }

      try {
        const newToken = await refreshing;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
