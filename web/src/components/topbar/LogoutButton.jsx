function LogoutButton({ onLogout }) {
    const handleClick = () => {
        // 1. ניקוי הזיכרון המקומי (החלק הטכני)
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log("Storage cleared.");

        // 2. הודעה לבוס (App) שיעדכן את המסך
        // אם לא נקרא לפונקציה הזו - המסך לא יתחלף!
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <button 
            onClick={handleClick}
            style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                padding: '6px 12px', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
            }}
        >
            Logout
        </button>
    );
}

export default LogoutButton;