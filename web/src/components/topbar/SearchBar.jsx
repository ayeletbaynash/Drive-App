import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authorizedFetch } from '../../App';
import { useFileActions } from '../FileContext';

function SearchBar({ user, onSearch }) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { deletedFiles } = useFileActions();

  // דגל למניעת לולאות בעת לחיצה ידנית
  const isSelectingSuggestion = useRef(false);

  /* ===============================
     Fetch search results (With ABORT Signal)
     =============================== */
  const fetchFromServer = async (query, signal) => {
    if (!query || !query.trim()) return [];

    try {
      // אנחנו מעבירים את ה-signal כדי שנוכל לבטל בקשות ישנות אם המשתמש מקליד מהר
      const response = await authorizedFetch(
        `http://localhost:8080/api/search/${encodeURIComponent(query)}`,
        { method: 'GET', signal: signal }
      );

      if (!response.ok) return [];
      const data = await response.json();

      // סינון קבצים שנמצאים בפח או נמחקו
      return data.filter(
        (file) =>
          !file.isTrash &&
          file.location !== 'trash' &&
          !deletedFiles.some((df) => df.id === file.id)
      );
    } catch (err) {
      if (err.name === 'AbortError') {
        // זה תקין - זה אומר שביטלנו בקשה ישנה לטובת חדשה
        return null; 
      }
      console.error('Search error:', err);
      return [];
    }
  };

  /* ===============================
     Suggestions (Debounced + Abort)
     =============================== */
  useEffect(() => {
    // אם התיבה ריקה - מנקים הצעות
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    // יצירת בקר לביטול בקשות
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      // שליחת בקשה לשרת עם יכולת ביטול
      const results = await fetchFromServer(text, controller.signal);
      
      // אם התוצאה היא null זה אומר שהבקשה בוטלה -> לא עושים כלום
      if (results !== null) {
        setSuggestions(results.slice(0, 5));
        setShowSuggestions(true);
      }
    }, 400);

    // בפעם הבאה שהמשתמש מקליד, הפונקציה הזו רצה ומבטלת את הקודמת!
    return () => {
      clearTimeout(timeout);
      controller.abort(); 
    };
  }, [text]);

  /* ===============================
     Sync with URL (Refresh / Back button)
     =============================== */
  useEffect(() => {
    const q = searchParams.get('q');
    
    // איפוס אם ה-URL ריק
    if (!q) {
        setText('');
        onSearch([]); 
        return;
    }

    // מניעת ריצה כפולה אם אנחנו אלו ששינינו את ה-URL הרגע
    if (isSelectingSuggestion.current) {
      isSelectingSuggestion.current = false;
      return;
    }

    // --- התיקון החשוב: השורות האלו היו בהערה בקוד שלך! ---
    setText(q);
    // כאן לא צריך AbortController כי זה קורה פעם אחת בטעינה
    fetchFromServer(q).then(res => res && onSearch(res));
  }, [searchParams]);

  /* ===============================
     Submit (Enter)
     =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setShowSuggestions(false);
    
    // מביאים את כל התוצאות
    const results = await fetchFromServer(text);
    if (results) onSearch(results);

    navigate(`/home/search?q=${encodeURIComponent(text)}`);
  };

  /* ===============================
     Click on suggestion
     =============================== */
  const handleSuggestionClick = (file) => {
    // מסמנים שבחרנו ידנית כדי שה-URL Effect לא ירוץ שוב
    isSelectingSuggestion.current = true;
    
    setText(file.name);
    setShowSuggestions(false);

    // מציגים מיד את הקובץ שבחרנו (חוסך קריאה לשרת)
    onSearch([file]);

    navigate(`/home/search?q=${encodeURIComponent(file.name)}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      <form onSubmit={handleSubmit} className="d-flex">
        <input
          className="form-control me-2"
          type="text"
          placeholder="Search in drive"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <button className="btn btn-outline-primary" type="submit">🔍</button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--surface)', border: '1px solid var(--border)', zIndex: 1000,
        }}>
          {suggestions.map((file) => (
            <div
              key={file.id}
              // שימוש ב-onMouseDown הוא קריטי כדי שהלחיצה תעבוד לפני ה-Blur
              onMouseDown={() => handleSuggestionClick(file)}
              style={{ padding: '10px', cursor: 'pointer', display: 'flex', gap: '10px' }}
            >
              <span>{file.type === 'folder' ? '📁' : '📄'}</span>
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;