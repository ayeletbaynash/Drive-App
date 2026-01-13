import SearchBar from './SearchBar';
import ThemeToggler from './ThemeToggler';
import UserAvatar from './UserAvatar';
import AppLogo from './AppLogo'; 
import '../../styles/layout.css';

// Organizes the navigation, search, and user-related actions into a three-section flexbox layout.
function TopBar({ onSearch, user, onLogout }) {
  return (
    <header className="top-bar">

          <div className="top-bar-left">
            <AppLogo />
          </div>
            {/* Center Section: Global Search Functionality
            The logic for suggestions and filtering is encapsulated within the SearchBar component.
        */}
            <div className="top-bar-center">
            <SearchBar onSearch={onSearch} user={user} />
            </div>

            {/* Right Section: Utility actions including theme switching and user profile management */}
            <div className="top-bar-right">
                <ThemeToggler />
                <UserAvatar user={user} onLogout={onLogout} />
            </div>    
    </header>
  );
}

export default TopBar;
