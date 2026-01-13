import { useState, useEffect } from 'react';
// import '../../styles/theme.css';
import '../../styles/layout.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

// * Provides a button to toggle between Light and Dark modes.
function ThemeToggler() {
  const [isDark, setIsDark] = useState(() => {
  return localStorage.getItem('selected-theme') === 'dark';
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('selected-theme', theme);
  }, [isDark]);

  return (
    <button 
      className="theme-toggle-btn"
      onClick={() => setIsDark(!isDark)}
      title="Toggle Dark Mode"
    >
      {/* Dynamic Icon Rendering: 
          Uses Bootstrap Icons (bi) to represent the current state visually.
      */}
      {isDark ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sun-fill text-warning"></i>}
      <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
}

export default ThemeToggler;