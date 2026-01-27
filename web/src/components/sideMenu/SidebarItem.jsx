import { Link, useLocation } from 'react-router-dom';

const SidebarItem = (props) => {
  const location = useLocation();
  
  const isActive = location.pathname === `/${props.to}`;

  return (
    <li className={`sidebar-item-container ${isActive ? 'active' : ''}`}>
      <Link to={`/${props.to}`} className="sidebar-link">
        <i className={`bi ${props.icon} sidebar-icon`}></i>
        <span className="sidebar-label">{props.label}</span>
      </Link>
    </li>
  );
};

export default SidebarItem;