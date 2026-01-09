import SidebarItem from './SidebarItem';
import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';
import CreateFolder from '../operations/CreateFolder';
import CreateFile from '../operations/CreateFile';
import FileUpload from '../operations/FileUpload';

const SideMenu = () => {
  const menuItems = [
    { id: 1, label: 'Home', to: 'home' },
    { id: 2, label: 'My Drive', to: 'my-drive' },
    { id: 3, label: 'Shared with me', to: 'shared' },
    { id: 4, label: 'Recent', to: 'recent' },
    { id: 5, label: 'Starred', to: 'starred' },
    { id: 6, label: 'Trash', to: 'trash' },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <aside>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
        + New
      </button>
      {isMenuOpen && (
                <FloatingMenu onClose={() => setIsMenuOpen(false)}>
                    <CreateFolder onSuccess={() => { setIsMenuOpen(false); }} />
                    <CreateFile onSuccess={() => { setIsMenuOpen(false); }} />
                    <FileUpload onSuccess={() => setIsMenuOpen(false)} /> 
                </FloatingMenu>
            )}
      <nav>
        <ul>
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.id} 
              label={item.label} 
              to={item.to}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;