import React from 'react';
import '../../styles/layout.css';

// Displays an expanded profile card with user details and a logout action.
function UserMenu({ user, onLogout, avatarColor }) {
    if (!user) return null;

    const displayName = user.username || "Guest";
    const displayEmail = user.emailAddress || user.email || "No email found"; 
    
    return (
        <div className="user-profile-card">
            {/* Profile Header Section: Contains avatar, name, and email */}
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
            {/* Greeting with the username */}
            <h3 className="profile-name">Hi, {displayName}!</h3>
            
            {/* User email address for identification */}
            <p className="profile-email">{displayEmail}</p>
            </div>

            {/* Visual separator between user info and action buttons */}
            <hr className="menu-divider" />

            {/* Logout Action: Triggers the global logout */}
            <button className="logout-action-btn" onClick={onLogout}>
                <i className="bi bi-box-arrow-right"></i>
                Logout
            </button>
        </div>
    );
}

export default UserMenu;