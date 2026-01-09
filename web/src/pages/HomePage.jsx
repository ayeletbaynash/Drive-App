import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideMenu from '../components/sideMenu/SideMenu';
import HomeFiles from '../components/main content/HomeFiles';
import SearchFiles from '../components/main content/SearchFiles'; // הייבוא החדש
import TopBar from '../components/topbar/TopBar';
import TrashFiles from '../components/main content/TrashFiles';
import StarredFiles from '../components/main content/StarredFiles';
import MyDriveFiles from '../components/main content/MyDriveFiles';

//import DriveFiles from '../components/DriveFiles';
//import SharedFiles from '../components/SharedFiles';
//import RecentFiles from '../components/RecentFiles';
//import StarredFiles from '../components/StarredFiles';
//import TrashFiles from '../components/TrashFiles';

// מקבלים את user ואת searchQuery ישירות מהאבא (App.js)
// לא צריך לייבא פה את TopBar או MainLayout כי הם כבר נמצאים ב-App
function HomePage({ user, onLogout }) {
    const [fullUser, setFullUser] = useState(user); 
    const [searchResults, setSearchResults] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchFullUserProfile = async () => {
            try {
                const response = await authorizedFetch(`http://localhost:8080/api/users/${user.id}`)
                if (response && response.ok) {
                    const userData = await response.json();
                    setFullUser(userData);
                }
            } catch (error) {
                console.error("Failed to fetch full user profile", error);
            }
        };

        fetchFullUserProfile();
    }, [user]);

//talk with the server- and update the files
    
    const fetchFilesFromServer = async () => {
        try{
            const response = await authorizedFetch('http://localhost:8080/api/files');
            if (!response) return;
            const data = await response.json();
            if (response.ok) {
            // ודאי שאת מעדכנת את הסטייט רק אם data הוא באמת מערך
            setItems(Array.isArray(data) ? data : []); 
            } else {
            console.error("Server error:", data.error);
            }
        } catch (error) {
            console.error("Error fetching files:", error);
        }
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
                user={user} 
                onLogout={onLogout} 
                onSearch={handleSearchResults} 
            />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SideMenu />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="home" element={<HomeFiles/>} />
            <Route path="home/:folderId" element={<HomeFiles/>} />
            {/* --- הנתיב החדש לחיפוש --- */}
            {/* הוא מקבל את searchResults שהגיעו מה-SearchBar */}
            <Route path="search" element={
                <SearchFiles results={searchResults} onRefresh={fetchFilesFromServer} />
            } />
            
            <Route path="my-drive" element={<MyDriveFiles />} />
            <Route path="shared" element={<div>Shared with me content</div>} />
            <Route path="recent" element={<div>Recent files content</div>} />
            <Route path="starred" element={<StarredFiles/>} />
            <Route path="trash" element={<TrashFiles/>} />

            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>      
        </div>
    );

};
export default HomePage;
