import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ user, onSearch }) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // פונקציה לשליפת כל הקבצים וסינון בזמן אמת
  useEffect(() => {
    // אם אין טקסט, ננקה את ההצעות
    if (!text.trim()) {
        setSuggestions([]);
        return;
    }

    const fetchAndFilter = async () => {
        try {
            const token = localStorage.getItem('token'); // שליפת הטוקן
            const response = await fetch('http://localhost:8080/api/files', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id.toString(), // לפי דרישות תרגיל 3
                    'Authorization': `Bearer ${token}` // שליחת הטוקן החדש
                }
            });

            if (response.ok) {
                const allFiles = await response.json();
                
                // --- הסינון החכם שביקשת ---
                const filtered = allFiles.filter(file => {
                    // 1. בדיקה שהקובץ לא באשפה (בהנחה שיש שדה כזה או לפי מיקום)
                    // תצטרכי להתאים את התנאי הזה לאיך שהשרת שומר "אשפה"
                    const isTrash = file.location === 'trash' || file.isTrash === true; 
                    
                    // 2. בדיקה שהשם מכיל את הטקסט (ללא רגישות לאותיות גדולות)
                    const matchesText = file.name.toLowerCase().includes(text.toLowerCase());

                    return !isTrash && matchesText;
                });

                const top5Suggestions = filtered.slice(0, 5);

                setSuggestions(top5Suggestions);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    // Debounce - כדי לא להפציץ את השרת על כל אות, מחכים קצת
    const timeoutId = setTimeout(() => {
        fetchAndFilter();
    }, 300);

    return () => clearTimeout(timeoutId);

  }, [text, user.id]);


  // פונקציה שמטפלת בלחיצה על ENTER או על כפתור החיפוש
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false); // סגירת ההצעות
    
    // שליחת התוצאות (ההצעות הנוכחיות) לדף הבית כדי שיציג אותן
    onSearch(suggestions); 
    
    // מעבר לנתיב של תוצאות החיפוש
    navigate('/home/search');
  };

  // פונקציה שמטפלת בלחיצה על הצעה ספציפית מהרשימה
  const handleSuggestionClick = (file) => {
      setText(file.name);
      setShowSuggestions(false);
      // במקרה של לחיצה על קובץ ספציפי, נציג רק אותו או את כל התוצאות
      onSearch([file]); 
      navigate('/home/search');
  };

  return (
    <div style={{ position: 'relative' }}> 
        <form onSubmit={handleSubmit} className="d-flex">
          <input 
            className="form-control me-2"
            type="text" 
            placeholder="Search files..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // סגירה בהשהייה כדי לאפשר קליק
          />
          <button className="btn btn-outline-primary" type="submit">🔍</button>
        </form>

        {/* --- התפריט הקופץ (Dropdown) --- */}
        {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                {suggestions.map(file => (
                    <div 
                        key={file.id} 
                        onClick={() => handleSuggestionClick(file)}
                        style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                        className="suggestion-item"
                    >
                        {file.type === 'folder' ? '📁' : '📄'} {file.name}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}

export default SearchBar;