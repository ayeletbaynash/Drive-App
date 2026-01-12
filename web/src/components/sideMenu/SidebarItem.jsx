const SidebarItem = (props) => {
  return (
    <li className="sidebar-item-container">
      <a href={`/${props.to}`} className="sidebar-link">
      <i className={`bi ${props.icon} sidebar-icon`}></i>
      <span className="sidebar-label">{props.label}</span>
      </a>
    </li>
  );
};

export default SidebarItem;