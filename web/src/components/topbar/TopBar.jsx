import SearchBar from './SearchBar';
import ThemeToggler from './ThemeToggler';
import UserAvatar from './UserAvatar';

function TopBar({ onSearch, user, onLogout }) {
  return (
    <header style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '10px 20px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--surface)'
        }}>
            {/* איזור שמאלי */}
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>My Drive App</div>

            {/* הרכיבים שיצרנו - כל אחד עם הלוגיקה שלו */}
            <SearchBar onSearch={onSearch} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ThemeToggler />
                <UserAvatar user={user} onLogout={onLogout} />
            </div>    
    </header>
  );
}

export default TopBar;
