// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser } from '../services/api.js'; // should check token/cookie

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetchCurrentUser(); // backend '/me' route
        setUser(res.user);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
