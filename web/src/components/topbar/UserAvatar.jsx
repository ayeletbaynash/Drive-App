import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import FloatingMenu from '../FloatingMenu'; 
import { authorizedFetch } from '../../App'; 
import '../../styles/layout.css';

// Manages the user's profile display in the TopBar.
function UserAvatar({ user, onLogout }) {
  // State to hold the complete user profile data (merges login data with fetched details)
  const [fullUser, setFullUser] = useState(user);
  const [isOpen, setIsOpen] = useState(false);

  // Generates a consistent background color based on the username string.
  const getAvatarColor = (name) => {
    const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#e67e22', '#e74c3c'];
    let hash = 0;
    if (!name) return colors[0];
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (!user?.id || (fullUser.emailAddress || fullUser.email)) return;    
    
    const fetchFullProfile = async () => {
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/users/${user.id}`);

            if (response && response.ok) {
                const data = await response.json();
                // data מכיל עכשיו את: { id, username, email, image... }
                setFullUser(data); 
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    fetchFullProfile();
  }, [user]); 

  const displayName = fullUser?.username || "Guest";
  const bgColor = getAvatarColor(displayName);

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Avatar Trigger: Displays either a profile image or a colored initial circle */}
      <div className="user-avatar-trigger" onClick={() => setIsOpen(!isOpen)}>
        {fullUser?.image ? (
            <img src={fullUser.image} alt="avatar" className="avatar-img" />
        ) : (
            <div className="avatar-initials" style={{ backgroundColor: bgColor }}>
                {displayName.charAt(0).toUpperCase()}
            </div>
        )}
      </div>

      {/* Profile Dropdown: Rendered conditionally inside a FloatingMenu overlay */}
      {isOpen && (
        <FloatingMenu onClose={() => setIsOpen(false)}>
            <div className="user-menu-wrapper">
                <UserMenu user={fullUser} onLogout={onLogout} avatarColor={bgColor} />
            </div>
        </FloatingMenu>
      )}
    </div>
  );
}

export default UserAvatar;