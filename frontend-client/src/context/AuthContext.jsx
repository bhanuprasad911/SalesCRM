import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser } from '../services/api.js';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // detects route changes

  const checkAuth = async () => {
    try {
      const res = await fetchCurrentUser();
      setUser(res.user);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Re-run auth check on every route change
  useEffect(() => {
    checkAuth();
  }, [location]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
