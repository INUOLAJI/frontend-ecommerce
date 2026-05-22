import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    // Success! Supabase automatically saves the session in LocalStorage
    navigate('/admin'); // Redirect to your dashboard
    setLoading(false);
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
      <Container style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold text-info">PRO-SHOP</h1>
          <p className="text-secondary">Admin Management Portal</p>
        </div>

        <Card className="bg-secondary bg-opacity-10 border-secondary p-4 shadow-lg">
          <Card.Body>
            <h3 className="text-center fw-bold mb-4 text-white">Login</h3>
            
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-white">Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  className="bg-dark text-white border-secondary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small text-white">Password</Form.Label>
                <Form.Control 
                  type="password" 
                  className="bg-dark text-white border-secondary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </Form.Group>

              <Button 
                variant="info" 
                type="submit" 
                className="w-100 fw-bold py-2 shadow-sm" 
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        
        <div className="text-center mt-4">
          <Button variant="link" onClick={() => navigate('/')} className="text-secondary text-decoration-none small">
            ← Back to Storefront
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default AdminLogin;