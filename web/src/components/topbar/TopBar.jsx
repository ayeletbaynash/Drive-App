import SearchBar from './SearchBar';
import ThemeToggler from './ThemeToggler';
import UserAvatar from './UserAvatar';
import AppLogo from './AppLogo'; 
import '../../styles/layout.css';

function TopBar({ onSearch, user, onLogout }) {
  return (
    <header className="top-bar">

          <div className="top-bar-left">
            <AppLogo />
          </div>
            <div className="top-bar-center">
            <SearchBar onSearch={onSearch} user={user} />
            </div>

            <div className="top-bar-right">
                <ThemeToggler />
                <UserAvatar user={user} onLogout={onLogout} />
            </div>    
    </header>
  );
}

export default TopBar;
