import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import FloatingMenu from '../FloatingMenu'; // ודאי שהנתיב נכון

function UserAvatar({ user, onLogout }) {
  // 1. State למשתמש המלא (בהתחלה הוא רק המשתמש הבסיסי שהגיע מהלוגין)
  const [fullUser, setFullUser] = useState(user);
  const [isOpen, setIsOpen] = useState(false);

  // 2. פונקציה לבחירת צבע קבוע לפי השם (כדי שיהיה יפה ומקצועי)
  const getAvatarColor = (name) => {
    const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#e67e22', '#e74c3c'];
    let hash = 0;
    if (!name) return colors[0];
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // 3. ה-Effect: אם חסר לנו מידע, ניגש לשרת להשלים אותו
  useEffect(() => {
    // אם אין יוזר או שכבר יש לנו אימייל (אולי הגיע מהלוגין?), לא צריך לפנות לשרת
    if (!user?.id) return;
    
    // פונקציה אסינכרונית בתוך ה-Effect
    const fetchFullProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            // שימי לב: הנתיב חייב להיות תואם לשרת שלכם
            const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'user-id': user.id.toString()
                }
            });

            if (response.ok) {
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


  // 4. לוגיקה מה להציג (תמונה או אות)
  const avatarStyle = {
    width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', color: 'white', border: '2px solid var(--border)', userSelect: 'none'
  };

  const displayName = fullUser?.username || "Guest";
  const bgColor = getAvatarColor(displayName);

  return (
    <div style={{ position: 'relative' }}>
      
      {/* העיגול עצמו */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {fullUser?.image ? (
            <img src={fullUser.image} alt="avatar" style={{ ...avatarStyle, objectFit: 'cover' }} />
        ) : (
            <div style={{ ...avatarStyle, backgroundColor: bgColor }}>
                {displayName.charAt(0).toUpperCase()}
            </div>
        )}
      </div>

      {/* התפריט שנפתח - אנחנו מעבירים לו את fullUser שיש בו את המייל! */}
      {isOpen && (
        <FloatingMenu onClose={() => setIsOpen(false)}>
            <div style={{ position: 'absolute', right: 0, top: '55px', zIndex: 1000 }}>
                <UserMenu user={fullUser} onLogout={onLogout} avatarColor={bgColor} />
            </div>
        </FloatingMenu>
      )}
    </div>
  );
}

export default UserAvatar;