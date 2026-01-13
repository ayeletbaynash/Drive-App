import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SideMenu from '../components/sideMenu/SideMenu'
import HomeFiles from '../components/main content/HomeFiles'
import SearchFiles from '../components/main content/SearchFiles'
import TopBar from '../components/topbar/TopBar'
import TrashFiles from '../components/main content/TrashFiles'
import StarredFiles from '../components/main content/StarredFiles'
import MyDriveFiles from '../components/main content/MyDriveFiles'
import SharedWithMe from '../components/main content/SharedWithMe'
import FileDetailsPanel from '../components/fileDetails/FileDetailsPanel'
import RecentFiles from '../components/main content/RecentFiles'


function HomePage({ user, onLogout }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFileDetails, setSelectedFileDetails] = useState(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <TopBar 
                user={user} 
                onLogout={onLogout} 
                onSearch={setSearchResults} 
            />
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <SideMenu />

                <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <Routes>
                            <Route path="home" element={<HomeFiles onSelectFile={setSelectedFileDetails}/>} />
                            <Route path="home/search" element={<SearchFiles results={searchResults} onSelectFile={setSelectedFileDetails} />} />
                            <Route path="home/:folderId" element={<HomeFiles onSelectFile={setSelectedFileDetails}/>} />
                            <Route path="my-drive" element={<MyDriveFiles onSelectFile={setSelectedFileDetails}/>} />
                            <Route path="shared" element={<SharedWithMe onSelectFile={setSelectedFileDetails}/>} />
                            <Route path="recent" element={<RecentFiles onSelectFile={setSelectedFileDetails}/>} />
                            <Route path="starred" element={<StarredFiles onSelectFile={setSelectedFileDetails}/>} />
                            <Route path="trash" element={<TrashFiles onSelectFile={setSelectedFileDetails}/>} />
                            <Route path="/" element={<Navigate to="/home" replace />} />
                        </Routes>
                    </div>

                    {selectedFileDetails && (
                        <FileDetailsPanel 
                            file={selectedFileDetails} 
                            onClose={() => setSelectedFileDetails(null)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

export default HomePage;