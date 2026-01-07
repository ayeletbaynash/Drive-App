import { useState, useEffect } from 'react';
import '../../styles/theme.css';

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
      onClick={() => setIsDark(!isDark)}
      style={{ 
        // שימוש במשתנים מה-theme.css שלך בלבד
        backgroundColor: 'var(--surface)', 
        border: '1px solid var(--border)',
        color: 'var(--text-main)',
        
        // עיצוב כללי
        cursor: 'pointer',
        padding: '6px 12px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}
      // אפקט מעבר עכבר קטן (אופציונלי)
      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* אייקון וטקסט שמשתנים לפי המצב */}
      <span>{isDark ? '🌙' : '☀️'}</span>
      <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
}

export default ThemeToggler;