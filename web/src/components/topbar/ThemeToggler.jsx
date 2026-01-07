import { useState } from 'react';
import '../../styles/theme.css';

function ThemeToggler() {
  const [isDark, setIsDark] = useState(false);

  const toggle = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('selected-theme', nextTheme); // שמירה בזיכרון
  };

  return (
    <button onClick={toggle}>
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

export default ThemeToggler;
