import './styles/theme.css';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/registration'; 
import Login from './pages/login';
import HomePage from './pages/HomePage';

function App() {

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
      <Router>
        <Routes>
          <Route path="/registration" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>

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
}}

export default App;