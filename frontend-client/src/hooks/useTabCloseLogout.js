import { useEffect } from 'react';

const useTabCloseLogout = () => {
  useEffect(() => {
    const LOGOUT_URL = `${import.meta.env.VITE_BACKEND_URL}/employee/logout`;
    let isRefresh = false;

    // Detect refresh
    const handleBeforeUnload = () => {
      isRefresh = true;
    };

    // Detect tab close
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isRefresh) {
        // Send logout request when the tab is closed
        navigator.sendBeacon(LOGOUT_URL);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

export default useTabCloseLogout;
