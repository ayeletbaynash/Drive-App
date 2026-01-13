const SidebarItem = (props) => {

  // Check if the current browser path matches this item's destination
  const isActive = window.location.pathname === `/${props.to}`;

  return (
    <li className={`sidebar-item-container ${isActive ? 'active' : ''}`}>
      <a href={`/${props.to}`} className="sidebar-link">
      <i className={`bi ${props.icon} sidebar-icon`}></i>
      {/* Text label for the navigation item */}
      <span className="sidebar-label">{props.label}</span>
      </a>
    </li>
  );
};

export default SidebarItem;