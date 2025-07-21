// Import React hooks for state and side effects
import { useState, useEffect } from "react";

// ThemeToggle component: toggles between dark and light theme
const ThemeToggle = ({ isMobile = false }) => {
  // State to track current theme
  const [theme, setTheme] = useState("dark");

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Toggle theme between dark and light
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  // Render theme toggle switch
  return (
    <div className={`theme-toggle ${isMobile ? "theme-toggle--mobile" : ""}`}>
      <span className="theme-toggle-label">Dark</span>
      <button
        type="button"
        className="theme-toggle-button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {/* Thumb indicator for active theme */}
        <span
          className={`theme-toggle-thumb ${theme === "light" ? "theme-toggle-thumb--active" : ""}`}
        />
      </button>
      <span className="theme-toggle-label">Light</span>
    </div>
  );
};

// Export ThemeToggle component as default
export default ThemeToggle;
// End of ThemeToggle.jsx
