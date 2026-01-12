import SidebarItem from './SidebarItem';
import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';
import CreateFolder from '../operations/CreateFolder';
import CreateFile from '../operations/CreateFile';
import FileUpload from '../operations/FileUpload';
import '../../styles/layout.css';

const SideMenu = () => {
  const menuItems = [
    { id: 1, label: 'Home', to: 'home', icon: 'bi-house-door' },
    { id: 2, label: 'My Drive', to: 'my-drive', icon: 'bi-hdd-network' },
    { id: 3, label: 'Shared with me', to: 'shared', icon: 'bi-people' },
    { id: 4, label: 'Recent', to: 'recent', icon: 'bi-clock-history' },
    { id: 5, label: 'Starred', to: 'starred', icon: 'bi-star' },
    { id: 6, label: 'Trash', to: 'trash', icon: 'bi-trash3' },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <aside className="sidebar-wrapper">
      <div className="new-button-container">
      <button className="btn-new" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <i className="bi bi-plus-lg"></i>
        <span>New</span>
      </button>
      </div>
      {isMenuOpen && (
                <FloatingMenu onClose={() => setIsMenuOpen(false)}>
                  <div className="floating-new-menu">
                    <CreateFolder onSuccess={() => { setIsMenuOpen(false); }} />
                    <CreateFile onSuccess={() => { setIsMenuOpen(false); }} />
                    <FileUpload onSuccess={() => setIsMenuOpen(false)} /> 
                  </div>
                </FloatingMenu>
            )}
      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.id} 
              label={item.label} 
              to={item.to}
              icon={item.icon}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;