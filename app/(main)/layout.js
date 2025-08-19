import React from "react";

// Global error logger to catch hidden runtime crashes
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    console.error("GLOBAL WINDOW ERROR:", event.error);
  });
  window.addEventListener("unhandledrejection", (event) => {
    console.error("GLOBAL PROMISE REJECTED:", event.reason);
  });
}

const MainLayout = ({ children }) => {
  return <div className="container mx-auto my-32">{children}</div>;
};

export default MainLayout;
