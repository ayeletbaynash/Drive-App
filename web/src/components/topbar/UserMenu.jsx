import React from 'react';
import '../../styles/layout.css';

function UserMenu({ user, onLogout, avatarColor }) {
    if (!user) return null;

    // שליפת הנתונים להצגה (הכל מגיע מה-props, אין קריאות לשרת כאן!)
    const displayName = user.username || "Guest";
    // כאן המייל יופיע כי Avatar כבר דאג להביא אותו
    const displayEmail = user.emailAddress || user.email || "No email found"; 
    
    return (
        <div className="user-profile-card">
            {/* פרטי משתמש */}
            <div className="profile-header">
                <div className="large-avatar">
                    {user.image ? (
                        <img src={user.image} alt="Profile" className="avatar-img-large" />
                    ) : (
                        <div className="avatar-initials-large" style={{ backgroundColor: avatarColor }}>
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            {/* כותרת */}
            <h3 className="profile-name">Hi, {displayName}!</h3>
            
            {/* אימייל */}
            <p className="profile-email">{displayEmail}</p>
            </div>

            <hr className="menu-divider" />

            {/* כפתור יציאה */}
            <button className="logout-action-btn" onClick={onLogout}>
                <i className="bi bi-box-arrow-right"></i>
                Logout
            </button>
        </div>
    );
}

export default UserMenu;