import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by attempting to fetch their accounts
    // (There is no dedicated /me route, so we use accounts as a proxy for being authenticated)
    const checkAuth = async () => {
      try {
        await api.get('/accounts');
        setUser({ loggedIn: true });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password });
    setUser({ loggedIn: true });
  };

  const register = async (name, email, password) => {
    await api.post('/auth/register', { name, email, password });
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
