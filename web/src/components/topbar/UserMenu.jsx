import React from 'react';

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp&f=y';

function UserMenu({ user, onLogout }) {
    // שליפת התמונה גם לכאן כדי להציג אותה בגדול
    const userImage = localStorage.getItem('userImage') || DEFAULT_AVATAR;
    const savedEmail = localStorage.getItem('userEmail');
    // הגנה: אם היוזר ריק לגמרי
    if (!user) return null;

    const displayName = user.username || "Guest";
    const displayEmail = user.emailAddress || user.email || savedEmail || "No email provided";
    
    return (
        <div style={{
            padding: '20px',
            minWidth: '260px',
            textAlign: 'center',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-main)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid var(--border)'
        }}>
            
            {/* כותרת */}
            <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>
                Hi, {displayName}!
            </h4>

            {/* תמונה גדולה במרכז */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <img 
                    src={userImage} 
                    alt="Profile" 
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid var(--primary)'
                    }}
                />
            </div>

            {/* אימייל */}
            <div style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-muted)', 
                marginBottom: '20px',
                wordBreak: 'break-all' 
            }}>
                {displayEmail}
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '15px 0' }} />

            {/* כפתור התנתקות */}
            <button 
                onClick={onLogout}
                style={{
                    width: '100%',
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: 'var(--error, #dc3545)',
                    border: '1px solid var(--error, #dc3545)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: '0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--error, #dc3545)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'var(--error, #dc3545)'}
            >
                Logout
            </button>
        </div>
    );
}

export default UserMenu;