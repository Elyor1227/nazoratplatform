import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { setAuthToken } from '../api.js';
import { isStaticMode } from '../config/staticMode.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'soliqnazorat_token';
const USER_KEY = 'soliqnazorat_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    setAuthToken(t || null);
    return t;
  });
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setAuthToken(token || null);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }
    if (isStaticMode()) {
      setSocket(null);
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const s = io(apiUrl, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [token]);

  const login = useCallback((data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setAuthToken(data.token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
  }, []);

  useEffect(() => {
    const onSessionLost = () => logout();
    window.addEventListener('soliqnazorat:session-expired', onSessionLost);
    return () => window.removeEventListener('soliqnazorat:session-expired', onSessionLost);
  }, [logout]);

  const value = useMemo(
    () => ({ token, user, login, logout, socket, isAuthenticated: !!token }),
    [token, user, socket]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
