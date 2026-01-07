import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from '../components/sideMenu/SideMenu';
import HomeFiles from '../components/main content/HomeFiles';
import SearchFiles from '../components/main content/SearchFiles'; // הייבוא החדש
import TopBar from '../components/topbar/TopBar';
//import DriveFiles from '../components/DriveFiles';
//import SharedFiles from '../components/SharedFiles';
//import RecentFiles from '../components/RecentFiles';
//import StarredFiles from '../components/StarredFiles';
//import TrashFiles from '../components/TrashFiles';

// מקבלים את user ואת searchQuery ישירות מהאבא (App.js)
// לא צריך לייבא פה את TopBar או MainLayout כי הם כבר נמצאים ב-App
function HomePage({ user, onLogout }) {
    const [fullUser, setFullUser] = useState(user); 

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchFullUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                // קריאה לשרת לקבלת פרטי המשתמש המלאים לפי ה-ID
                const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'user-id': user.id.toString() 
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setFullUser(userData); // עכשיו יש לנו אובייקט עם emailAddress!
                }
            } catch (error) {
                console.error("Failed to fetch full user profile", error);
            }
        };

        fetchFullUserProfile();
    }, [user]);

    const [searchResults, setSearchResults] = useState([]);
    const [items, setItems] = useState([]);
//talk with the server- and update the files
    
        const fetchFilesFromServer = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/api/files', {
            headers: { 
                'user-id': user.id.toString(),
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error("Error:", error));
    };
//load the item in the firs
    useEffect(() => {
        fetchFilesFromServer();
    }, []);

    const handleSearchResults = (results) => {
        setSearchResults(results); // שומר את התוצאות לדף החיפוש
        // אנחנו לא קוראים לשרת פה! סומכים על מה שהגיע מה-Search
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <TopBar 
                user={fullUser} 
                onLogout={onLogout} 
                onSearch={handleSearchResults} 
            />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SideMenu />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="home" element={<HomeFiles files={items} onRefresh={fetchFilesFromServer}/>} />
            {/* --- הנתיב החדש לחיפוש --- */}
            {/* הוא מקבל את searchResults שהגיעו מה-SearchBar */}
            <Route path="search" element={
                <SearchFiles results={searchResults} onRefresh={fetchFilesFromServer} />
            } />
            <Route path="my-drive" element={<div>my drive</div>} />
            <Route path="shared" element={<div>Shared with me content</div>} />
            <Route path="recent" element={<div>Recent files content</div>} />
            <Route path="starred" element={<div>Starred files content</div>} />
            <Route path="trash" element={<div>Trash content</div>} />

            <Route path="/" element={<HomeFiles files={items} onRefresh={fetchFilesFromServer}/>} />
          </Routes>
        </div>
      </div>      
        </div>
    );

};
export default HomePage;

// import { useEffect, useState, useCallback } from 'react';
// import { Routes, Route } from 'react-router-dom';

// // Components
// import SideMenu from '../components/sideMenu/SideMenu';
// import TopBar from '../components/topbar/TopBar';
// import HomeFiles from '../components/main content/HomeFiles';
// import SearchFiles from '../components/main content/SearchFiles';

// /**
//  * HomePage - רכיב הניהול המרכזי לאחר התחברות.
//  * מנהל את המידע על המשתמש המחובר ואת רשימת הקבצים הדינמית.
//  */
// function HomePage({ user, onLogout }) {
//     // --- States ---
//     const [fullUser, setFullUser] = useState(user); // משתמש מורחב הכולל אימייל מהשרת [cite: 44-45]
//     const [items, setItems] = useState([]);        // רשימת הקבצים הכללית [cite: 57]
//     const [searchResults, setSearchResults] = useState([]); // תוצאות חיפוש בלבד [cite: 67]

//     // --- API Calls ---

//     // פונקציה לשליפת פרטי משתמש מלאים (בשביל ה-Email והתמונה) [cite: 45]
//     const fetchFullUserProfile = useCallback(async () => {
//         if (!user?.id) return;
//         try {
//             const token = localStorage.getItem('token');
//             const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
//                 headers: { 
//                     'Authorization': `Bearer ${token}`, // שימוש ב-JWT כנדרש בתרגיל 4 [cite: 360-361]
//                     'user-id': user.id.toString()       // העברת מזהה משתמש כנדרש בתרגיל 3 [cite: 50]
//                 }
//             });

//             if (response.ok) {
//                 const userData = await response.json();
//                 setFullUser(userData);
//             }
//         } catch (error) {
//             console.error("Failed to fetch full user profile:", error);
//         }
//     }, [user]);

//     // פונקציה לשליפת קבצים מהשרת [cite: 56-57]
//     const fetchFilesFromServer = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await fetch('http://localhost:8080/api/files', {
//                 headers: { 
//                     'user-id': user.id.toString(),
//                     'Authorization': `Bearer ${token}` 
//                 }
//             });
//             const data = await response.json();
//             setItems(data);
//         } catch (error) {
//             console.error("Error fetching files:", error);
//         }
//     }, [user.id]);

//     // --- Effects ---

//     // טעינת פרופיל משתמש מלא בכל פעם שנתוני הבסיס משתנים
//     useEffect(() => {
//         fetchFullUserProfile();
//     }, [fetchFullUserProfile]);

//     // טעינת קבצים ראשונית עם עליית הדף [cite: 508-509]
//     useEffect(() => {
//         fetchFilesFromServer();
//     }, [fetchFilesFromServer]);

//     // --- Handlers ---

//     // עדכון תוצאות חיפוש שהגיעו מה-SearchBar ב-TopBar
//     const handleSearchResults = (results) => {
//         setSearchResults(results);
//     };

//     // --- Layout ---
//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            
//             {/* סרגל עליון - מקבל את המשתמש המלא לעדכון האוואטר והמייל [cite: 390] */}
//             <TopBar 
//                 user={fullUser} 
//                 onLogout={onLogout} 
//                 onSearch={handleSearchResults} 
//             />

//             <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
//                 {/* תפריט צדדי [cite: 343] */}
//                 <SideMenu />

//                 {/* אזור התוכן המרכזי - משתנה לפי הניתוב (Router) [cite: 395] */}
//                 <main style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: 'var(--background)' }}>
//                     <Routes>
//                         {/* דף הבית המציג את כל הקבצים [cite: 344] */}
//                         <Route path="home" element={
//                             <HomeFiles files={items} onRefresh={fetchFilesFromServer} />
//                         } />

//                         {/* דף תוצאות חיפוש [cite: 350] */}
//                         <Route path="search" element={
//                             <SearchFiles results={searchResults} onRefresh={fetchFilesFromServer} />
//                         } />

//                         {/* ניתובים נוספים (Placeholder) */}
//                         <Route path="my-drive" element={<div>My Drive Content</div>} />
//                         <Route path="shared" element={<div>Shared with me Content</div>} />
//                         <Route path="recent" element={<div>Recent Files Content</div>} />
//                         <Route path="starred" element={<div>Starred Files Content</div>} />
//                         <Route path="trash" element={<div>Trash Content</div>} />

//                         {/* ניתוב ברירת מחדל */}
//                         <Route path="/" element={
//                             <HomeFiles files={items} onRefresh={fetchFilesFromServer} />
//                         } />
//                     </Routes>
//                 </main>
//             </div>      
//         </div>
//     );
// }

// export default HomePage;