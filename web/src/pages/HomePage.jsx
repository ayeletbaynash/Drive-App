import { useEffect, useState } from 'react';

// מקבלים את user ואת searchQuery ישירות מהאבא (App.js)
// לא צריך לייבא פה את TopBar או MainLayout כי הם כבר נמצאים ב-App
function HomePage({ user, searchQuery }) {
    const [files, setFiles] = useState([]);

    // זה המקום שבו השותפה שלך תכתוב את הלוגיקה של השרת
    useEffect(() => {
        // הגנה: אם אין משתמש, לא עושים כלום
        if (!user) return;

        console.log("--- HomePage Logic ---");
        console.log("Connected User ID:", user.id);
        console.log("Current Search Query:", searchQuery);

        // פה תהיה הקריאה לשרת:
        // const fetchData = async () => { ... }
        // if (searchQuery) -> חפשי קובץ
        // else -> תביאי את כל הקבצים

    }, [searchQuery, user]); // הרשימה תתעדכן כל פעם שהחיפוש משתנה

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Files</h1>
            
            {/* בדיקה ויזואלית שזה עובד */}
            <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
                <strong>Debug Info:</strong>
                <p>User: {user.name}</p>
                <p>Searching for: {searchQuery || "(Nothing - showing all files)"}</p>
            </div>

            {/* כאן תופיע רשימת הקבצים בעתיד */}
            <div className="file-list">
                <p>File list will load here...</p>
            </div>
        </div>
    );
}

export default HomePage;