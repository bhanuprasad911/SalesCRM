import { useEffect } from "react";

const useLogoutOnTabClose = () => {
  useEffect(() => {
    const logoutOnClose = (e) => {
      const navEntries = performance.getEntriesByType("navigation");
      const type = navEntries.length ? navEntries[0].type : performance.navigation.type;

      // 1 = reload, "reload" also for newer browsers
      if (type === "reload" || type === 1) return;

      // Else, it's a tab close → send logout
      navigator.sendBeacon("http://localhost:5003/api/employee/logout");
    };

    window.addEventListener("unload", logoutOnClose);
    return () => window.removeEventListener("unload", logoutOnClose);
  }, []);
};

export default useLogoutOnTabClose;
