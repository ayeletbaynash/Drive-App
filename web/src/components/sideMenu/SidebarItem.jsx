const SidebarItem = (props) => {
  return (
    <li>
      <a href={`/${props.to}`}>
        {props.label}
      </a>
    </li>
  );
};

export default SidebarItem;