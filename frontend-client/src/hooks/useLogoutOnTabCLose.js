import { useEffect } from "react";

const useLogoutOnTabClose = () => {
  useEffect(() => {
    const LOGOUT_URL = `${import.meta.env.VITE_BACKEND_URL}/employee/logout`;

    const handleUnload = (event) => {
      // Use `visibilitychange` to check if tab is going away
      document.addEventListener("visibilitychange", () => {
        const navEntries = performance.getEntriesByType("navigation");
        const navType = navEntries[0]?.type;

        if (document.visibilityState === "hidden" && navType !== "reload") {
          console.log("🚪 Logging out (tab close)");
          navigator.sendBeacon(LOGOUT_URL);
        }
      });
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);
};

export default useLogoutOnTabClose;
