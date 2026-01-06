import LogoutButton from './LogoutButton';

function UserMenu({ user, onLogout }) {
  return (
    <div style={{ display: 'flex', gap: '10px' }}> 
      <span>Hello, {user?.name}</span>
      <LogoutButton onLogout={onLogout} />
    </div>
  );
}

export default UserMenu;