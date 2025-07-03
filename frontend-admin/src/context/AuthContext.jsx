import { createContext, useContext, useEffect, useState } from 'react';
import { getAdminDetails } from '../services/api.js';
import { useLocation } from 'react-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const location = useLocation
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const path = location.pathname;

  const fetchAdmin = async () => {
    try {
      const res = await getAdminDetails();
      setAdmin(res.data.admin);
    } catch (err) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, [path]);

  return (
    <AuthContext.Provider value={{ admin, setAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
