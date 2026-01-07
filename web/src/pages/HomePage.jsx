import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideMenu from '../components/sideMenu/SideMenu';
import HomeFiles from '../components/main content/HomeFiles';
import TopBar from '../components/topbar/TopBar';
//import DriveFiles from '../components/DriveFiles';
//import SharedFiles from '../components/SharedFiles';
//import RecentFiles from '../components/RecentFiles';
//import StarredFiles from '../components/StarredFiles';
//import TrashFiles from '../components/TrashFiles';

// מקבלים את user ואת searchQuery ישירות מהאבא (App.js)
// לא צריך לייבא פה את TopBar או MainLayout כי הם כבר נמצאים ב-App
function HomePage({ user, onLogout }) {

    const [searchQuery, setSearchQuery] = useState("");
    const [items, setItems] = useState([]);
//talk with the server- and update the files
    
    const fetchFilesFromServer = () => {
        fetch('http://localhost:8080/api/files')
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error("Error:", error));
        };
//load the item in the firs
    useEffect(() => {
        fetchFilesFromServer();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <TopBar 
                user={user} 
                onLogout={onLogout} 
                onSearch={setSearchQuery} 
            />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SideMenu />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="my-drive" element={<div>my drive</div>} />
            <Route path="shared" element={<div>Shared with me content</div>} />
            <Route path="recent" element={<div>Recent files content</div>} />
            <Route path="starred" element={<div>Starred files content</div>} />
            <Route path="trash" element={<div>Trash content</div>} />
            <Route path="home" element={<HomeFiles files={items} onRefresh={fetchFilesFromServer}/>} />
          </Routes>
        </div>
      </div>      
        </div>
    );

};
export default HomePage;

// // פונקציית שליפה מהשרת
//     const fetchFilesFromServer = () => {
//         const url = searchQuery 
//             ? `http://localhost:8080/api/search?q=${searchQuery}` 
//             : 'http://localhost:8080/api/files';

//         fetch(url, { headers: { 'user-id': user.id } })
//             .then(res => res.json())
//             .then(data => setItems(data))
//             .catch(err => console.error("Error:", err));
//     };