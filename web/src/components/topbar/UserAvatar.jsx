import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';

const DEFAULT_AVATAR =
  'https://www.gravatar.com/avatar/?d=mp&f=y';

function UserAvatar({ user, onLogout }) {
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedImage = localStorage.getItem('userImage');
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <img
        src={image || DEFAULT_AVATAR}
        alt="avatar"
        width={40}
        height={40}
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer', borderRadius: '50%', border: '2px solid var(--primary)' }}
      />

      {open && (
        // המיקום של התפריט הצף
                <div style={{ 
                    position: 'absolute', 
                    right: 0, 
                    top: '50px', 
                    zIndex: 1000,
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                }}>
        <UserMenu user={user} onLogout={onLogout} />
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
