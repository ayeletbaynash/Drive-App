import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/authentication.css'

const Login = () => {
    // State to manage input fields
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(''); // State to manage error messages
    const navigate = useNavigate(); // Hook to redirect users after successful login

    // Update state whenever an input field changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing
        setError(''); // Reset error state before starting request

        try {
            // Sending login credentials to the Node.js API server
            const response = await fetch('http://localhost:3000/api/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            // Handling the server response
            const data = await response.json();

            if (response.ok) {
                /* SUCCESS: The server verified the credentials and sent back a JWT.
                   We store the token in LocalStorage so it persists even if the page refreshes.
                */
                localStorage.setItem('token', data.token);
                
                // Store the username to personalize the UI later
                if (data.username) {
                    localStorage.setItem('username', data.username);
                }

                alert('Login successful!');
                
                // Redirect user to the home page
                navigate('/home'); 
            } else {
                // SERVER ERROR: e.g., Wrong password or user not found
                setError(data.message || 'Invalid username or password');
            }
        } catch (err) {
            // NETWORK ERROR: The server is down or unreachable
            setError('Connection to server failed. Please try again later.');
        }
    };

    return (
        <Container className="auth-page-container">
            <Card className="auth-card shadow-sm">
                <Card.Body>
                    <h1 className="auth-title">Login</h1>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="username" 
                                placeholder="Enter your username"
                                required 
                                onChange={handleChange} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                name="password" 
                                placeholder="Enter your password"
                                required 
                                onChange={handleChange} 
                            />
                        </Form.Group>

                        <Button className="w-100 button.auth-button.btn" type="submit">
                            Log In
                        </Button>
                    </Form>

                    <div className="text-center mt-3">
                        <small style={{ color: 'var(--text-muted)' }}>
                            Don't have an account? {' '}
                            <span className="auth-link" onClick={() => navigate('/registration')}>
                                Register here
                            </span>
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;