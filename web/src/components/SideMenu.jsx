import SidebarItem from './SidebarItem';

const SideMenu = () => {
  const menuItems = [
    { id: 1, label: 'My Drive', to: 'my-drive' },
    { id: 2, label: 'Shared with me', to: 'shared' },
    { id: 3, label: 'Recent', to: 'recent' },
    { id: 4, label: 'Starred', to: 'starred' },
    { id: 5, label: 'Trash', to: 'trash' },
  ];

  return (
    <aside>
      <button onClick={() => console.log('New clicked')}>
        + New
      </button>

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