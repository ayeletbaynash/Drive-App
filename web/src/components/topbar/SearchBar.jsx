import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ user, onSearch }) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

// 1. שליפה ראשונית של כל הקבצים כדי שיהיו זמינים לסינון מהיר
  useEffect(() => {
    const fetchAllFiles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/files', {
                headers: {
                    'user-id': user.id.toString(),
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // סינון ראשוני של זבל - אנחנו לא רוצים לחפש שם אף פעם
                const cleanFiles = data.filter(f => f.location !== 'trash' && !f.isTrash);
                setAllItems(cleanFiles);
            }
        } catch (error) {
            console.error("Search fetch error:", error);
        }
    };

    if (user?.id) {
        fetchAllFiles();
    }
  }, [user.id]);

  // 2. סינון בזמן אמת עבור ההצעות (Suggestions)
  useEffect(() => {
    if (!text.trim()) {
        setSuggestions([]);
        return;
    }

    // סינון מתוך הרשימה שכבר יש לנו בזיכרון (הרבה יותר מהיר מלפנות לשרת כל אות)
    const matches = allItems.filter(file => 
        file.name.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(matches.slice(0, 5)); // כאן אנחנו מגבילים ל-5 רק בשביל התצוגה הקופצת!
    setShowSuggestions(true);

  }, [text, allItems]);


  // פונקציה שמטפלת בלחיצה על ENTER או על כפתור החיפוש
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false); // סגירת ההצעות
    
    const fullResults = allItems.filter(file => 
        file.name.toLowerCase().includes(text.toLowerCase())
    );
    // שליחת התוצאות (ההצעות הנוכחיות) לדף הבית כדי שיציג אותן
    onSearch(fullResults); 
    
    // מעבר לנתיב של תוצאות החיפוש
    navigate('/home/search');
  };

  // 4. טיפול בלחיצה על הצעה ספציפית מהרשימה
  const handleSuggestionClick = (file) => {
      setText(file.name); 
      setShowSuggestions(false); 
      
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
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: '0 0 8px 8px'
            }}>
                {suggestions.map(file => (
                    <div 
                        key={file.id} 
                        onClick={() => handleSuggestionClick(file)}
                        className="suggestion-item"
                        style={{ 
                            padding: '10px', 
                            cursor: 'pointer', 
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        {/* אייקון לפי סוג */}
                        <span>{file.type === 'folder' ? '📁' : '📄'}</span>
                        {/* שם הקובץ */}
                        <span>{file.name}</span>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}

export default SearchBar;