// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser, logout as logoutAPI } from '../services/api.js'; // ⬅ rename logout to logoutAPI
import { useLocation } from 'react-router-dom';
import toast from "react-hot-toast"; // optional

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  const logoutUser = async () => {
    try {
      await logoutAPI(); // logout API
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    checkAuth();
  }, [location]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
