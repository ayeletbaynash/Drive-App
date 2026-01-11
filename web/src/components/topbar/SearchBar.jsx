// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { authorizedFetch } from '../../App'; // ודאי שהנתיב נכון לקובץ App שלך
// import { useFileActions } from '../FileContext'; // ייבוא הקונטקסט כדי לסנן קבצים שנמחקו הרגע

// function SearchBar({ user, onSearch }) {
//   const [text, setText] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams(); 

//   const { deletedFiles } = useFileActions();
//   const isSelectingSuggestion = useRef(false);

//   // פונה לכתובת: http://localhost:8080/api/search/מילה
//   const fetchFromServer = async (query) => {
//   if (!query || !query.trim()) return [];

//   try {
//   const response = await authorizedFetch(
//     `http://localhost:8080/api/search/${encodeURIComponent(query)}`,
//     {
//       method: 'GET',
//       headers: { 'user-id': user.id.toString() }
//     }
//   );

//   if (!response.ok) return [];

//   const data = await response.json();
//   if (!Array.isArray(data)) return [];

//   return data.filter(file =>
//   !file.isTrash &&
//   file.location !== 'trash' &&
//   !deletedFiles.some(df => df.id === file.id) 
// );

//     } catch (err) {
//       console.error('Search error:', err);
//       return [];
//     }
// };



// //         if (response && response.ok) {
// //             const data = await response.json();
// //             // --- שלב הסינון החכם ---
// //             let finalFiles = data.filter(file => {
// //                 // 1. סינון זבל: בודקים גם בשרת וגם ברשימת המחיקות המקומית
// //                 const isServerTrash = file.location === 'trash' || file.isTrash;
// //                 const isLocalTrash = deletedFiles.some(df => df.id === file.id);
                
// //                 return !isServerTrash && !isLocalTrash;
// //                 // 2. סינון מדויק (Case Insensitive):
// //                 // זה פותר את הבעיה ש-"hi" נשאר כשכותבים "he"
// //                 // וזה פותר את הבעיה של אותיות גדולות/קטנות
// //                 //return file.name.toLowerCase().includes(query.toLowerCase());
// //             });

// //             // --- שלב 2: מיון חכם (Smart Sorting) ---
// //             // המטרה: קבצים שהשם שלהם תואם לחיפוש יופיעו למעלה.
// //             // קבצים שרק התוכן שלהם תואם (למשל חיפשת "apple" בקובץ "list.txt") יופיעו למטה.
// //             finalFiles.sort((a, b) => {
// //                 const queryLower = query.toLowerCase();
// //                 const nameA = a.name.toLowerCase();
// //                 const nameB = b.name.toLowerCase();

// //                 const matchNameA = nameA.includes(queryLower);
// //                 const matchNameB = nameB.includes(queryLower);

// //                 // אם A תואם בשם ו-B לא -> A ראשון
// //                 if (matchNameA && !matchNameB) return -1;
// //                 // אם B תואם בשם ו-A לא -> B ראשון
// //                 if (!matchNameA && matchNameB) return 1;
// //                 // אחרת, אין העדפה (שניהם תוכן או שניהם שם)
// //                 return 0;
// //             });

// //             // עדכון התוצאות ל-HomePage
// //             onSearch(finalFiles);
            
// //             // עדכון ההצעות הקופצות
// //             setSuggestions(finalFiles.slice(0, 5));
// //         }else {
// //             // אם השרת החזיר שגיאה (למשל 404 כי לא מצא כלום) - מנקים את המסך
// //             onSearch([]);
// //             setSuggestions([]);
// //         }
// //     } catch (error) {
// //         console.error("Server search error:", error);
// //         onSearch([]);
// //     }
// //   };

// //   const fetchSuggestions = async (query) => {
// //     if (!query || !query.trim()) {
// //       setSuggestions([]);
// //       return;
// //     }

// //     try {
// //       const response = await authorizedFetch(
// //         `http://localhost:8080/api/search/${encodeURIComponent(query)}`,
// //         {
// //           method: 'GET',
// //           headers: { 'user-id': user.id.toString() }
// //         }
// //       );

// //       if (!response.ok) return;

// //       let data = await response.json();

// //       const filtered = data.filter(file =>
// //         file.name.toLowerCase().includes(query.toLowerCase())
// //       );

// //       setSuggestions(filtered.slice(0, 5));
// //     } catch (err) {
// //       console.error('Suggestion error:', err);
// //     }
// //   };

//   // 3. מנגנון Debounce להצעות בזמן אמת
//   useEffect(() => {
//     if (!text.trim()) {
//       setSuggestions([]);
//       return;
//     }
//     const timeout = setTimeout(async () => {
//       const results = await fetchFromServer(text);
//       setSuggestions(Array.isArray(results) ? results.slice(0, 5) : []);
//       setShowSuggestions(true);
//     }, 400); // מחכה חצי שנייה אחרי סיום הקלדה

//     return () => clearTimeout(timeout);
//   }, [text]);

//     // סנכרון עם ה-URL (אם עשית רענון או ניווט)
//   useEffect(() => {
//     const q = searchParams.get('q');
//     if (!q) return;
//     if (isSelectingSuggestion.current) {
//       isSelectingSuggestion.current = false;
//       return;
//     }
//     setText(q);
//     fetchFromServer(q).then(onSearch);
//     // אם יש משהו ב-URL והוא שונה ממה שיש בתיבה - נעדכן
//     // if (queryFromUrl && queryFromUrl !== text) {
//     //     setText(queryFromUrl);
//     //     performSearch(queryFromUrl);
//     // } 
//     // else if (queryFromUrl) {
//     //     // מקרה קצה: הטקסט כבר שם אבל צריך לרענן תוצאות
//     //     searchFromServer(queryFromUrl);
//     // }
//   }, [searchParams]);

  
//   // 2. האזנה לשינויי
//   // ם גלובליים (somthingChange)
//   // אם מישהו העלה קובץ או שינה שם בזמן שאנחנו בתוצאות חיפוש - נרענן את התוצאות
// //   useEffect(() => {
// //     const handleGlobalChange = () => {
// //         if (text.trim()) {
// //             performSearch(text);
// //         }
// //     };

// //     window.addEventListener('somthingChange', handleGlobalChange);
// //     return () => window.removeEventListener('somthingChange', handleGlobalChange);
// //   }, [text, deletedFiles]); // תלוי ב-text כדי לדעת מה לחפש מחדש


//   // 4. ביצוע חיפוש (Submit)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) {
//     return;
//   }
//     setShowSuggestions(false);
//     // קריאה לשרת
//     const results = await fetchFromServer(text);
//     onSearch(results);
//     // עדכון ה-URL
//     navigate(`/home/search?q=${encodeURIComponent(text)}`);
//   };

//   const handleSuggestionClick = async (file) => {
//       isSelectingSuggestion.current = true;
//       setText(file.name); 
//       setShowSuggestions(false);

//       const results = await fetchFromServer(file.name);
//       onSearch(Array.isArray(results) ? results : []);

//       navigate(`/home/search?q=${encodeURIComponent(file.name)}`); 
//   };

//   return (
//     <div style={{ position: 'relative' }}> 
//         <form onSubmit={handleSubmit} className="d-flex">
//           <input 
//             className="form-control me-2" type="text" placeholder="Search in drive" 
//             value={text} onChange={(e) => setText(e.target.value)}
//             onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
//           />
//           <button className="btn btn-outline-primary" type="submit">🔍</button>
//         </form>
        
//         {/* תצוגת ההצעות */}
//         {showSuggestions && suggestions.length > 0 && (
//             <div className="search-suggestions" style={{
//                 position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', zIndex: 1000, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '0 0 8px 8px'
//             }}>
//                 {suggestions.map(file => (
//                     <div 
//                         key={file.id} 
//                         onMouseDown={() => handleSuggestionClick(file)}
//                         className="suggestion-item"
//                         style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}
//                         onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
//                         onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                     >
//                         <span>{file.type === 'folder' ? '📁' : '📄'}</span>
//                         <span>{file.name}</span>
//                     </div>
//                 ))}
//             </div>
//         )}
//     </div>
//   );
// }

// export default SearchBar;

// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { authorizedFetch } from '../../App';
// import { useFileActions } from '../FileContext';

// function SearchBar({ user, onSearch }) {
//   const [text, setText] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { deletedFiles } = useFileActions();

//   const isSelectingSuggestion = useRef(false);
//   const lastRequestId = useRef(0);

//   /* ===============================
//      Fetch search results from server
//      =============================== */
//   const fetchFromServer = async (query) => {
//     if (!query || !query.trim()) return [];

//     try {
//       const response = await authorizedFetch(
//         `http://localhost:8080/api/search/${encodeURIComponent(query)}`,
//         {
//           method: 'GET'
//         }
//       );

//       if (!response.ok) return [];

//       const data = await response.json();

//       // Only filter deleted / trash files
//       return data.filter(
//         (file) =>
//           !file.isTrash &&
//           file.location !== 'trash' &&
//           !deletedFiles.some((df) => df.id === file.id)
//       );
//     } catch (err) {
//       console.error('Search error:', err);
//       return [];
//     }
//   };

//   /* ===============================
//      Suggestions (debounced)
//      =============================== */
//   useEffect(() => {
//     if (!text.trim()) {
//       setSuggestions([]);
//       setShowSuggestions(false);
//       return;
//     }

//     const requestId = ++lastRequestId.current;

//     const timeout = setTimeout(async () => {
//       const results = await fetchFromServer(text);
//       if (requestId !== lastRequestId.current) return;

//       setSuggestions(results.slice(0, 5));
//       setShowSuggestions(true);
//     }, 400);

//     return () => clearTimeout(timeout);
//   }, [text]);

//   /* ===============================
//      Sync with URL (?q=...)
//      =============================== */
//   useEffect(() => {
//     const q = searchParams.get('q');
//     if (!q) {
//         setText(''); // מאפס את הטקסט בתיבה ל"Search in drive"
//         onSearch([]); // מנקה את התוצאות הישנות (לסדר טוב)
//         return;
//     }

//     if (isSelectingSuggestion.current) {
//       isSelectingSuggestion.current = false;
//       return;
//     }

//     //setText(q);
//     //fetchFromServer(q).then(onSearch);
//   }, [searchParams]);

//   /* ===============================
//      Submit search (Enter / 🔍)
//      =============================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;

//     setShowSuggestions(false);

//     const results = await fetchFromServer(text);
//     onSearch(results);

//     navigate(`/home/search?q=${encodeURIComponent(text)}`);
//   };

//   /* ===============================
//      Click on suggestion
//      =============================== */
//   const handleSuggestionClick = async (file) => {
//     //isSelectingSuggestion.current = true;

//     setText(file.name);
//     setShowSuggestions(false);

//     //const results = await fetchFromServer(file.name);
//     onSearch([file]);

//     navigate(`/home/search?q=${encodeURIComponent(file.name)}`);
//   };

//   return (
//     <div style={{ position: 'relative' }}>
//       <form onSubmit={handleSubmit} className="d-flex">
//         <input
//           className="form-control me-2"
//           type="text"
//           placeholder="Search in drive"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//         />
//         <button className="btn btn-outline-primary" type="submit">
//           🔍
//         </button>
//       </form>

//       {showSuggestions && suggestions.length > 0 && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             right: 0,
//             background: 'var(--surface)',
//             border: '1px solid var(--border)',
//             zIndex: 1000,
//           }}
//         >
//           {suggestions.map((file) => (
//             <div
//               key={file.id}
//               onMouseDown={() => handleSuggestionClick(file)}
//               style={{
//                 padding: '10px',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 gap: '10px',
//               }}
//             >
//               <span>{file.type === 'folder' ? '📁' : '📄'}</span>
//               <span>{file.name}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default SearchBar;

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