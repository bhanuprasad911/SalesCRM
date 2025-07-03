import { useEffect } from "react";
import axios from "axios";

const useTabCloseLogout = () => {
  useEffect(() => {
    const isPageReload = () => {
      const entries = performance.getEntriesByType("navigation");
      if (entries.length > 0 && entries[0].type === "reload") {
        return true;
      }
      return false;
    };

    const handleBeforeUnload = (e) => {
      if (isPageReload()) {
        // It's just a refresh — skip logout
        return;
      }

      // It's likely a tab close — fire logout
      navigator.sendBeacon("http://localhost:5003/api/employee/logout"); // or use axios if cookies are needed
      localStorage.setItem("logout_time", new Date().toISOString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};

export default useTabCloseLogout;
