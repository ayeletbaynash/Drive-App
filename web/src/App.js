import './styles/theme.css';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/registration'; 
import Login from './pages/login';
import HomePage from './pages/HomePage';
import TopBar from './components/topbar/TopBar';

function App() {

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { id: 0, name: "Guest Admin", email: "admin@test.com" };  // to check: { id: 0, name: "Guest Admin", email: "admin@test.com" };
    });
    const [searchQuery, setSearchQuery] = useState(""); // המצב היחיד ש-App מנהל: "מה מחפשים?"

    // --- הפונקציה הקריטית ---
    // זו הפונקציה שתישלח עד לתוך הכפתור האדום
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null); // זה מה שגורם להחלפת המסך!
    };

  return (
    
      <Router>
        <div>
            {/* שינוי 2: ה-TopBar יופיע רק אם יש משתמש מחובר [cite: 83, 86] */}
                {user && (
                    <TopBar 
                        user={user} 
                        onLogout={handleLogout} 
                        onSearch={setSearchQuery} 
                    />
                )}
        <Routes>
          <Route path="/registration" element={<Register />} />
          <Route path="/login" element={
                user ? <Navigate to="/" /> : <Login onLogin={setUser} />
            } />
          
                    <Route path="/" element={
                        user ? (
                            <HomePage user={user} searchQuery={searchQuery} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes> 
   </div>
         </Router>


  );
}

export default App;