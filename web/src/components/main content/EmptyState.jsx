import React from 'react';

const EmptyState = ({ type }) => {
  // פונקציה שמחזירה את ה-SVG המתאים לפי הסוג
  const getIllustration = () => {
    const commonStyle = { transform: 'rotate(-10deg)', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.1))' };
    const strokeColor = "var(--primary)";

    switch (type) {
      case 'trash':
        return (
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={commonStyle}>
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        );

      case 'starred':
        return (
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={commonStyle}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );

      case 'search':
        return (
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={commonStyle}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <path d="M11 8a3 3 0 0 1 3 3" style={{opacity: 0.5}} />
          </svg>
        );

      case 'shared':
        return (
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={commonStyle}>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <path d="M12 11a4 4 0 1 0-4-4" transform="scale(0.5) translate(20, 30)" /> 
            <circle cx="12" cy="13" r="3" />
            <path d="M12 17c-2.7 0-5-1.3-5-3" />
          </svg>
        );

      case 'drive':
      default:
        // ענן עם חץ העלאה
        return (
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={commonStyle}>
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="M16 16l-4-4-4 4" />
          </svg>
        );
    }
  };

  const titles = {
    trash: "Trash is empty",
    starred: "No starred files",
    shared: "Shared with me",
    search: "No results found",
    drive: "Your drive is empty"
  };

  const subtitles = {
    trash: "Items moved to the trash will appear here.",
    starred: "Star items to find them easily later :)",
    shared: "Files shared with you will appear here.",
    search: "Try different keywords",
    drive: "Upload files or create folders to get started!"
  };

  // אם לא הועבר type, נשתמש ב-drive כברירת מחדל
  const currentType = type || 'drive';

  return (
    <div className="empty-state-card">
      <div className="illustration-container">
        {getIllustration()}
      </div>
      <h2 className="empty-title">{titles[currentType]}</h2>
      <p className="empty-subtitle">{subtitles[currentType]}</p>
    </div>
  );
};

export default EmptyState;