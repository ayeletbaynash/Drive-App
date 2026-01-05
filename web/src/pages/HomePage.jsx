import { Routes, Route } from 'react-router-dom';
import SideMenu from '../components/SideMenu';
//import HomeFiles from '../components/HomeFiles';
//import DriveFiles from '../components/DriveFiles';
//import SharedFiles from '../components/SharedFiles';
//import RecentFiles from '../components/RecentFiles';
//import StarredFiles from '../components/StarredFiles';
//import TrashFiles from '../components/TrashFiles';


const HomePage = () => {
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
            <Route path="home" element={<div>home</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default HomePage;