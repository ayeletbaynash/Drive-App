import SearchBar from './SearchBar';
import ThemeToggler from './ThemeToggler';
import UserMenu from './UserMenu';

function TopBar({ onSearch, user, onLogout, onToggleTheme }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* איזור שמאלי */}
            <div>My Drive App</div>

            {/* הרכיבים שיצרנו - כל אחד עם הלוגיקה שלו */}
            <SearchBar onSearch={onSearch} />
            
            <div style={{ display: 'flex', gap: '15px' }}>
                <ThemeToggler />
                <UserMenu user={user} onLogout={onLogout} />
            </div>
    </header>
  );
}

export default TopBar;
