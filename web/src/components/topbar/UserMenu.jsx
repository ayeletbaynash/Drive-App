import React from 'react';

function UserMenu({ user, onLogout, avatarColor }) {
    if (!user) return null;

    // שליפת הנתונים להצגה (הכל מגיע מה-props, אין קריאות לשרת כאן!)
    const displayName = user.username || "Guest";
    // כאן המייל יופיע כי Avatar כבר דאג להביא אותו
    const displayEmail = user.emailAddress || user.email || "No email found"; 
    
    return (
        <div style={{
            padding: '20px',
            width: '280px',
            textAlign: 'center',
            backgroundColor: 'var(--surface)', // תואם ל-Theme
            border: '1px solid var(--border)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            color: 'var(--text-main)'
        }}>
            {/* כותרת */}
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>Hi, {displayName}!</h3>
            
            {/* אימייל */}
            <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {displayEmail}
            </p>

            {/* אוואטר גדול באמצע */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {user.image ? (
                    <img src={user.image} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', 
                        backgroundColor: avatarColor || '#ccc', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px', fontWeight: 'bold'
                    }}>
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '15px 0' }} />

            {/* כפתור יציאה */}
            <button 
                onClick={onLogout}
                style={{
                    width: '100%', padding: '10px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--error, #ff4d4d)',
                    color: 'var(--error, #ff4d4d)',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
                }}
            >
                Logout
            </button>
        </div>
    );
}

export default UserMenu;