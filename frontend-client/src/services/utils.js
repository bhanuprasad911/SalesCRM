function setupLogoutOnTabClose(logoutUrl) {
  // Mark refresh in localStorage before the tab is unloaded
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("isRefresh", "true");
  });

  // Clear the refresh flag when the page is loaded
  window.addEventListener("load", () => {
    localStorage.removeItem("isRefresh");
  });

  // Detect tab close via pagehide (fires after beforeunload)
  window.addEventListener("pagehide", (event) => {
    const isRefresh = localStorage.getItem("isRefresh");

    // Important: event.persisted is true on bfcache (browser forward/back cache)
    if (!isRefresh && !event.persisted) {
      // Debug log
      console.log("Logging out because tab is being closed");

      fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
    }
  });
}

export default setupLogoutOnTabClose;
