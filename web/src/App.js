import './styles/theme.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/registration'; 
import Login from './pages/login';


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/registration" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
      </Routes>
    </Router>
    </div>
    
  );
}

export default App;
