import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideMenu from '../components/sideMenu/SideMenu';
import HomeFiles from '../components/main content/HomeFiles';
import SearchFiles from '../components/main content/SearchFiles'; // הייבוא החדש
import TopBar from '../components/topbar/TopBar';
import TrashFiles from '../components/main content/TrashFiles';
import StarredFiles from '../components/main content/StarredFiles';
import MyDriveFiles from '../components/main content/MyDriveFiles';
import { authorizedFetch } from '../App';

//import DriveFiles from '../components/DriveFiles';
//import SharedFiles from '../components/SharedFiles';
//import RecentFiles from '../components/RecentFiles';
//import StarredFiles from '../components/StarredFiles';
//import TrashFiles from '../components/TrashFiles';

// מקבלים את user ואת searchQuery ישירות מהאבא (App.js)
// לא צריך לייבא פה את TopBar או MainLayout כי הם כבר נמצאים ב-App
function HomePage({ user, onLogout }) {
    const [searchResults, setSearchResults] = useState([]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <TopBar 
                user={user} 
                onLogout={onLogout} 
                onSearch={setSearchResults} 
            />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SideMenu />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="home" element={<HomeFiles/>} />
            <Route path="home/search" element={
                <SearchFiles results={searchResults} />
            } />
            <Route path="home/:folderId" element={<HomeFiles/>} />
            
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
