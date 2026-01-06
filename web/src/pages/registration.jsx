import React, { useState , useEffect } from 'react';
import { Form, Button, Container, Alert, Image, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/authentication.css';

const Register = () => {
    // State for form data - matches model/users
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        emailAddress: '', 
        image: ''
    });

    const [imagePreview, setImagePreview] = useState(null); // Saves a temporary address of the image so we can show it to the user immediately after they select it
    const [error, setError] = useState(''); // Saves a text message if there was an error
    const navigate = useNavigate(); // Defining the tool that will navigate between pages

    // Helper function to convert Image File to Base64 string
    // Since servers accept JSON (text), we need to turn the image file into a long text string
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Dynamically updates the State for all form fields while preserving existing data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Handle image selection and preview
            const base64 = await convertToBase64(file);
            setFormData({ ...formData, image: base64 }); // Convert it to Base64 and save it in formData
            setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for the preview in imagePreview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing
        setError(''); // Resets previous errors

        // Client-side validation (matching server logic)
        // No spaces
        if (formData.username.includes(' ')) {
            setError("Username cannot contain spaces");
            return;
        }

        // Password = confirm
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Password at least 8 char
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        // Password contains capital lowercase and number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password must include at least one uppercase letter, one lowercase letter, and one number.");
            return;
        }

        // The call to server
        try {
            // API Integration - POST /api/users
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Sending the same keys the controller expects
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    emailAddress: formData.emailAddress,
                    //image: formData.image
                    image: "test-image-string" //////////////////////////////// for testing
                }),
            });

            // Handling the server response
            const data = await response.json();

            if (response.ok) {
                // Success
                console.log("Registered successfully!");
                navigate('/login'); 
            } else {
                // Display server error 
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Connection to server failed. Make sure the server is running.");
        }
    };

    useEffect(() => {
        if (error) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [error]);

    return (
    <Container className="auth-page-container">
        <Card className="auth-card shadow-sm">
            <Card.Body>
                <h1 className="auth-title">Create Account</h1>
                    <div className="auth-required-container">
                        <span className="required-star">*</span>
                        <span className="required-note"> All marked fields are required</span>
                    </div>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Username <span className="required-star">*</span>
                        </Form.Label>
                        <Form.Control 
                            type="text" name="username" required
                            onChange={handleChange} 
                            placeholder="Pick a username"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Email Address <span className="required-star">*</span>
                        </Form.Label>
                        <Form.Control 
                            type="email" name="emailAddress" required
                            onChange={handleChange} 
                            placeholder="example@mail.com"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Password <span className="required-star">*</span>
                        </Form.Label>
                        <Form.Control 
                            type="password" name="password" required
                            onChange={handleChange} 
                            placeholder="At least 8 characters"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Confirm Password <span className="required-star">*</span>
                        </Form.Label>
                        <Form.Control 
                            type="password" name="confirmPassword" required
                            onChange={handleChange} 
                            placeholder="Repeat your password"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>
                            Profile Picture <span className="required-star">*</span>
                        </Form.Label>
                        <Form.Control 
                            type="file" accept="image/*" required
                            onChange={handleImageChange} 
                            className="auth-file-input"
                        />
                        {imagePreview && (
                            <div className="mt-3 text-center">
                                <Image src={imagePreview} className="auth-image-preview" roundedCircle />
                            </div>
                        )}
                    </Form.Group>

                    <Button className="w-100 auth-button" type="submit">
                        Register
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <small style={{ color: 'var(--text-muted)' }}>
                        Already have an account? {' '}
                        <span className="auth-link" onClick={() => navigate('/login')}>
                            Login here
                        </span>
                    </small>
                </div>
            </Card.Body>
        </Card>
    </Container>
);
};

export default Register;