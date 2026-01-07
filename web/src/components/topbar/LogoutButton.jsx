function LogoutButton({ onLogout }) {
    const handleClick = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
            
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <button onClick={handleClick}>
            Logout
        </button>
    );
}

export default LogoutButton;