import { Routes, Route } from 'react-router-dom';
import SideMenu from '../components/sideMenu/SideMenu';
import React, { useState, useEffect } from 'react';
import HomeFiles from '../components/main content/HomeFiles';
//import DriveFiles from '../components/DriveFiles';
//import SharedFiles from '../components/SharedFiles';
//import RecentFiles from '../components/RecentFiles';
//import StarredFiles from '../components/StarredFiles';
//import TrashFiles from '../components/TrashFiles';


const HomePage = () => {
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
    <div>

      <div style={{ display: 'flex' }}>
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