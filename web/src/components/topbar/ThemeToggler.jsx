import { useState, useEffect } from 'react';
// import '../../styles/theme.css';
import '../../styles/layout.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

function ThemeToggler() {
  // תיקון 1: אתחול המצב לפי מה ששמור בזיכרון ולא סתם False
  const [isDark, setIsDark] = useState(() => {
  return localStorage.getItem('selected-theme') === 'dark';
  });

  // תיקון 2: כל פעם ש-isDark משתנה, נעדכן את ה-Body ואת הזיכרון
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
      // אפקט מעבר עכבר קטן (אופציונלי)
      // onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
      // onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* אייקון וטקסט שמשתנים לפי המצב */}
      {isDark ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sun-fill text-warning"></i>}
      <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
}

export default ThemeToggler;