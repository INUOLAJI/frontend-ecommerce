import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Make sure this path is correct!
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up the user in Supabase Auth
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    // 2. Success! Redirect to login or dashboard
    alert("Signup successful! Check your email for a confirmation link.");
    navigate('/admin-login'); // We will build this next
    setLoading(false);
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
      <Container style={{ maxWidth: '450px' }}>
        <Card className="bg-secondary bg-opacity-10 border-secondary p-4 shadow-lg">
          <Card.Body>
            <h2 className="text-center fw-bold text-info mb-4">Create Admin Account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3 text-white">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="admin@proshop.com" 
                  className="bg-dark text-white border-secondary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-4 text-white">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Min. 6 characters" 
                  className="bg-dark text-white border-secondary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </Form.Group>

              <Button 
                variant="info" 
                type="submit" 
                className="w-100 fw-bold py-2" 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register as Admin'}
              </Button>
            </Form>
            
            <div className="text-center mt-3">
               <small className="text-white">Already have an account? <Link to="/admin-login" className="text-info">Login</Link></small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AdminSignup;