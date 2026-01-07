import './styles/theme.css';
import './styles/authentication.css';
import './App.css';
import { useState, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/registration'; 
import Login from './pages/login';
import HomePage from './pages/HomePage';

function App() {

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;  // to check: { id: 0, name: "Guest Admin", email: "admin@test.com" };
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    useLayoutEffect(() => {
        const savedTheme = localStorage.getItem('selected-theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }, []);

  return (
    
      <Router>
        <Routes>
          <Route path="/registration" element={<Register />} />

          {/* if user already loged in go strait to home page*/}
          <Route path="/login" element={
          user ? <Navigate to="/home" /> : <Login onLogin={setUser} />
          } />

          {/* ecplicit rout to home */}
          <Route path="/home/*" element={
          user ? <HomePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } />

          {/* else */}
          <Route path="/*" element={
          user ? <HomePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
        </Routes> 
      </Router>

  );
}

export default App;