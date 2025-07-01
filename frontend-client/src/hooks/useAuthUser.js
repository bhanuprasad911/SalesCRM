// src/hooks/useAuthUser.js
import { useAuth } from '../context/AuthContext';

const useAuthUser = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};

export default useAuthUser;
