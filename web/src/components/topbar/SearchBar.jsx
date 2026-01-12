import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authorizedFetch } from '../../App';
import { useFileActions } from '../FileContext';
import 'bootstrap-icons/font/bootstrap-icons.css'; // ייבוא האייקונים
import '../../styles/layout.css'; // ייבוא העיצוב

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
     Fetch search results
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
      const lowerQuery = query.toLowerCase();

      for (const file of data) {
        if (deletedFiles.some(df => df.id === file.id)) continue;

        const fileName = (file.name || "").toLowerCase();
            const isImageOrpdf = fileName.endsWith('.png') || 
                            fileName.endsWith('.jpg') || 
                            fileName.endsWith('.jpeg') ||
                            fileName.endsWith('.pdf');
        if (isImageOrpdf) {
                if (!fileName.includes(lowerQuery)) {
                    continue; 
                }
            }
             
        const underDeleted = await isUnderDeletedFolder(file);
        if (!underDeleted) {
          filtered.push(file);
        }
      }

      return filtered;

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
    <div style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit} className="search-container">
        <button className="search-icon-btn" type="submit">
            <i className="bi bi-search"></i>
        </button>
        <input
          className="search-input"
          type="text"
          placeholder="Search in drive"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((file) => {
            let iconClass = 'bi-file-earmark-text'; // ברירת מחדל
            let iconColor = 'var(--text-muted)';

            if (file.type === 'folder') {
                iconClass = 'bi-folder-fill';
                iconColor = '#ffc107'; // צהוב תיקייה
            } else if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
                iconClass = 'bi-image';
                iconColor = 'var(--primary)';
            } else if (file.name.endsWith('.pdf')) {
                iconClass = 'bi-file-earmark-pdf-fill';
                iconColor = '#dc3545'; // אדום PDF
            }
            return(
            <div
              key={file.id}
              onMouseDown={() => handleSuggestionClick(file)}
              className="suggestion-item"
            >
              <i className={`bi ${iconClass}`} style={{ color: iconColor, fontSize: '1.2rem' }}></i>
              <span>{file.name}</span>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;