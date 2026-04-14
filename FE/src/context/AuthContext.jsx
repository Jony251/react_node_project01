import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/apiClient';

const AuthContext = createContext(null);

/* ── ROLE constants (must match BE) ──────────────────────*/
export const ROLES = { CHILD: 0, ADMIN: 1, PARENT: 2 };

export const AuthProvider = ({ children }) => {
  const [user, setUser]                 = useState(null);
  const [isAuthenticated, setIsAuth]    = useState(false);
  const [isLoading, setIsLoading]       = useState(true);

  const isAdmin  = user?.role === ROLES.ADMIN;
  const isParent = user?.role === ROLES.PARENT;
  const isChild  = user?.role === ROLES.CHILD;
  const isPremium = user?.subscription === 'premium';

  /* ── hydrate from localStorage on mount ───────────────*/
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/api/auth/me')
        .then(r => {
          setUser(r.data.user);
          setIsAuth(true);
        })
        .catch(() => _clearStorage())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  /* ── listen for forced logout from interceptor ────────*/
  useEffect(() => {
    const handler = () => { setUser(null); setIsAuth(false); };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  function _persist(data) {
    localStorage.setItem('accessToken',  data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user',         JSON.stringify(data.user));
    setUser(data.user);
    setIsAuth(true);
  }

  function _clearStorage() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /* ── register ──────────────────────────────────────────*/
  const register = useCallback(async (username, email, password, role = 'child') => {
    const r = await api.post('/api/auth/register', { username, email, password, role });
    _persist(r.data);
    return { success: true };
  }, []);

  /* ── login ─────────────────────────────────────────────*/
  const login = useCallback(async (email, password) => {
    try {
      const r = await api.post('/api/auth/login', { email, password });
      _persist(r.data);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.response?.data?.error || 'Login failed' };
    }
  }, []);

  /* ── Google login ──────────────────────────────────────*/
  const googleLogin = useCallback(async (credential) => {
    try {
      const r = await api.post('/api/auth/google', { credential });
      _persist(r.data);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.response?.data?.error || 'Google login failed' };
    }
  }, []);

  /* ── logout ────────────────────────────────────────────*/
  const logout = useCallback(async () => {
    try { await api.post('/api/auth/logout'); } catch {}
    _clearStorage();
    setUser(null);
    setIsAuth(false);
  }, []);

  /* ── update profile ────────────────────────────────────*/
  const updateProfile = useCallback(async (fields) => {
    const r = await api.put('/api/auth/profile', fields);
    const updated = r.data.user;
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  }, []);

  /* ── save score ────────────────────────────────────────*/
  const saveScore = useCallback(async (gameId, score, difficulty = 'easy') => {
    if (!isAuthenticated) return;
    try {
      await api.post('/api/auth/score', { gameId, score, difficulty });
      setUser(u => u ? { ...u, total_score: (u.total_score || 0) + score, games_played: (u.games_played || 0) + 1 } : u);
    } catch {}
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isLoading,
      isAdmin, isParent, isChild, isPremium,
      ROLES,
      login, register, googleLogin, logout,
      updateProfile, saveScore,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
