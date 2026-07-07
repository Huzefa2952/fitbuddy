// React context for managing FitBuddy authentication state.
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fitbuddy_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('fitbuddy_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((response) => {
        setUser(response.data.user);
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem('fitbuddy_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const nextToken = response.data.token;
    localStorage.setItem('fitbuddy_token', nextToken);
    setToken(nextToken);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('fitbuddy_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  return useContext(AuthContext);
}
