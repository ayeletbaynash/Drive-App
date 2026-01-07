import LogoutButton from './LogoutButton';

function UserMenu({ user, onLogout }) {
    return (
        <div style={{ padding: '15px', minWidth: '200px' }}> 
            <p style={{ margin: 0, fontWeight: 'bold' }}>{user?.name}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</p>
            <hr />
            <LogoutButton onLogout={onLogout} />
        </div>
    );
}

export default UserMenu;