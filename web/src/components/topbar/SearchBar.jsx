import { useState } from 'react';

function SearchBar() {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(text);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'inline-block' }}>
      <input 
        type="text" 
        placeholder="Search files..." 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">🔍</button>
    </form>
  );
}

export default SearchBar;
// // 1. State שמחזיק את רשימת הקבצים שמוצגת על המסך
//   const [files, setFiles] = useState([]);
  
//   // הניחי שהוא רץ בפורט 3000 לפי תרגיל 3
//   const SERVER_URL = 'http://localhost:3000'; 

//   // 2. פונקציית עזר לשליפת נתונים (GET)
//   const fetchData = async (endpoint) => {
//     // הגנה: אם אין יוזר מחובר, אי אפשר לשלוח בקשה כי חסר ID
//     if (!user || user.id === undefined) {
//         console.error("No user ID found, cannot fetch files");
//         return;
//     }

//     try {
//       const response = await fetch(`${SERVER_URL}${endpoint}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           // --- התיקון הקריטי לפי ה-README והקוד ששלחת ---
//           'user-id': user.id.toString() 
//           // השרת מצפה לקבל את ה-ID של המשתמש בהדר הזה
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setFiles(data); // עדכון ה-State גורם לריאקט לצייר מחדש את המסך
//       } else {
//         console.error('Error fetching data:', response.status);
//         // כאן אפשר להציג הודעת שגיאה למשתמש
//         // טיפול במקרה של 401 (לא מורשה) - אולי להוציא ללוגאאוט?
//         if (response.status === 401) onLogout();
//       }
//     } catch (error) {
//       console.error('Network error:', error);
//     }
//   };

//   // 3. טעינה ראשונית - מביאים את כל הקבצים כשהדף עולה
//   useEffect(() => {
//     fetchData('/api/files');
//   }, [User]); // add User here!!!!!!!!!!!!!

//   // 4. הלוגיקה של החיפוש - מחוברת ל-TopBar
//   const handleSearch = (query) => {
//     console.log("Searching for:", query);

//     if (!query || query.trim() === '') {
//       // אם אין חיפוש - מביאים את הכל
//       fetchData('/api/files');
//     } else {
//       // אם יש חיפוש - פונים ל-API של החיפוש
//       // שימי לב: ה-API מוגדר כ: /api/search/:query
//       fetchData(`/api/search/${query}`);
//     }
//   };

    //   {/* 5. הצגת רשימת הקבצים בצורה דינמית */}
    //   <div className="files-container">
    //     {files.length === 0 ? (
    //       <p>No files found.</p>
    //     ) : (
    //       <ul style={{ listStyleType: "none", padding: 0 }}>
    //         {files.map((file) => (
    //           // הנחנו שלכל קובץ יש id ו-name לפי דוגמאות ה-JSON בנספח
    //           <li key={file.id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
    //             {/* כאן נציג אייקון לפי file.type (folder/file) */}
    //             <strong>{file.type === 'folder' ? '📁' : '📄'} {file.name}</strong>
    //           </li>
    //         ))}
    //       </ul>
    //     )}
    //   </div> 
