import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authorizedFetch } from '../../App';
import { useFileActions } from '../FileContext';

function SearchBar({ onSearch }) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { deletedFiles } = useFileActions();

  // דגל למניעת לולאות בעת לחיצה ידנית
  const isSelectingSuggestion = useRef(false);

  const parentStatusCache = useRef(new Map());


    /* =====================================================
     🆕 HELPER: check if file is under a deleted folder
     ===================================================== */
    const isUnderDeletedFolder = async (file) => {
    let parentId = file.parent_id;

    while (parentId !== null) {
      // cache hit
      if (parentStatusCache.current.has(parentId)) {
        return parentStatusCache.current.get(parentId);
      }

      const url =
        parentId === null
          ? 'http://localhost:8080/api/files'
          : `http://localhost:8080/api/files/${parentId}`;

      try {
        const response = await authorizedFetch(url, { method: 'GET' });
        if (!response.ok) {
          parentStatusCache.current.set(parentId, false);
          return false;
        }

        const parent = await response.json();

        // אב נמחק?
        if (deletedFiles.some(df => df.id === parent.id)) {
          parentStatusCache.current.set(parentId, true);
          return true;
        }

        // ממשיכים למעלה
        parentId = parent.parent_id;
      } catch (e) {
        parentStatusCache.current.set(parentId, false);
        return false;
      }
    }

    return false;
  };

  /* ===============================
     Fetch search results (With ABORT Signal)
     =============================== */
  const fetchFromServer = async (query, signal) => {
    if (!query || !query.trim()) return [];

    try {
      // אנחנו מעבירים את ה-signal כדי שנוכל לבטל בקשות ישנות אם המשתמש מקליד מהר
      const response = await authorizedFetch(
        `http://localhost:8080/api/search/${encodeURIComponent(query)}`,
        { method: 'GET', signal }
      );

      if (!response.ok) return [];
      const data = await response.json();

      const filtered = [];

      for (const file of data) {
        if (deletedFiles.some(df => df.id === file.id)) continue;

        const underDeleted = await isUnderDeletedFolder(file);
        if (!underDeleted) {
          filtered.push(file);
        }
      }

      return filtered;
      // סינון קבצים שנמצאים בפח או נמחקו
      // return data.filter(file => !deletedFiles.some(df => df.id === file.id));
    } catch (err) {
      if (err.name === 'AbortError') {
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
    // יצירת בקר לביטול בקשות
    const controller = new AbortController();
    // אם התיבה ריקה - מנקים הצעות
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

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
  }, [text, deletedFiles]);

  /* ===============================
     Sync with URL (Refresh / Back button)
     =============================== */
  useEffect(() => {
    const performSearchFromUrl = () => {
    const q = searchParams.get('q');
    // איפוס אם ה-URL ריק
    if (!q) {
        setText('');
        onSearch([]); 
        return;
    }

    // מניעת ריצה כפולה אם אנחנו אלו ששינינו את ה-URL הרגע
    if (isSelectingSuggestion.current) {
      setText(q);
      fetchFromServer(q).then(res => res && onSearch(res));
    }
    isSelectingSuggestion.current = false;
  };

  performSearchFromUrl();

  // Global Event Listener for refreshing
    const handleRefresh = () => {
      performSearchFromUrl();
    };
    window.addEventListener('somthingChange', handleRefresh);
    return () => window.removeEventListener('somthingChange', handleRefresh);
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