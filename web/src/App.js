import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/topbar/TopBar'; // מכיל את ה-Search וה-UserMenu
import HomePage from './pages/HomePage';
import './styles/theme.css';

// קומפוננטת תוכן פנימית (כדי שנוכל להשתמש ב-useAuth)
const App = () => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { id: 0, name: "Guest Admin", email: "admin@test.com" };
    });
    const [searchQuery, setSearchQuery] = useState(""); // המצב היחיד ש-App מנהל: "מה מחפשים?"

    // --- הפונקציה הקריטית ---
    // זו הפונקציה שתישלח עד לתוך הכפתור האדום
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null); // זה מה שגורם להחלפת המסך!
        // navigate(`/login`);
    };

    return (
        <BrowserRouter>
            <div>
                {user && (
                    <TopBar 
                        user={user} 
                        onLogout={handleLogout} // שליחת הפונקציה לדרך
                        onSearch={setSearchQuery} 
                    />
                )}

                <Routes>                    
                    <Route path="/" element={
                        user ? (
                            <HomePage user={user} searchQuery={searchQuery} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                </Routes> 
            </div>
        </BrowserRouter>
    );
};

export default App;