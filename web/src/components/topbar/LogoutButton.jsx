/**
 * LogoutButton Component
 * Handles the user logout process by clearing local storage and 
 * executing an optional cleanup callback.
 */
function LogoutButton({ onLogout }) {
    const handleClick = () => {
        // Remove user profile and authentication token from persistent storage
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