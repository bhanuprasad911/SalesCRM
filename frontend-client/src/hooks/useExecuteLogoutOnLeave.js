// useExecuteOnUserLeave.js
import { useEffect, useRef } from "react";

function useExecuteLogoutOnUserLeave(logoutUser, delayInMs = 5 * 60 * 1000) {
  const timeoutRef = useRef(null);

  const startTimer = () => {
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(async () => {
        console.log("⏰ 5 minutes passed. Calling logoutUser...");
        try {
          if(user){
            await logoutUser();
          }
        } catch (error) {
          console.error("Error in logoutUser:", error);
        }
      }, delayInMs);
    }
  };

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        startTimer();
      } else {
        clearTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimer();
    };
  }, []);
}
export default useExecuteLogoutOnUserLeave;
