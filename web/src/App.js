import './styles/theme.css';
import './styles/authentication.css';
import './App.css';
import { useState, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/registration'; 
import Login from './pages/login';
import HomePage from './pages/HomePage';

  // One function that centralizes all server calls
  export const authorizedFetch = async (url, options = {}) => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Automatically adding headers to each request
      const headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'user-id': userId
      };

      const response = await fetch(url, { ...options, headers });

      // if the id/token not there delete them from the webpage and sent the user back to login
      if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
      }

      return response;
  };

function App() {

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;  // to check: { id: 0, name: "Guest Admin", email: "admin@test.com" };
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
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

          {/* else */}
          <Route path="/*" element={
          user ? <HomePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
        </Routes> 
      </Router>

  );
}

export default App;