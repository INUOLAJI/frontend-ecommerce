import React, { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import { useNavigate } from 'react-router-dom'; // ✅ Essential for immediate redirect
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap';

const AdminSecurity = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Get current user info on load
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      } else {
        // If no user is found at all, boot to login immediately
        navigate('/admin-login', { replace: true });
      }
    };
    getUser();
  }, [navigate]);

  // --- LOGOUT LOGIC ---
  const handleSignOut = async (scope = 'local') => {
    try {
      setLoading(true);
      // 'global' scope logs out of all devices, 'local' is just this one
      await supabase.auth.signOut({ scope });
      
      // Immediate redirect to login page
      navigate('/admin-login', { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      // Even if there's an error, we usually want to force the user to login again
      navigate('/admin-login', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // --- PASSWORD UPDATE LOGIC ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      return setMessage({ type: 'danger', text: 'Password must be at least 8 characters!' });
    }
    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'danger', text: 'Passwords do not match!' });
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: 'danger', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  const loginHistory = [
    { device: "Current Session", location: "Active Now", date: new Date().toLocaleString(), status: "Online" },
    { device: "Recognized Device", location: "Lagos, Nigeria", date: "Yesterday", status: "Recognized" },
  ];

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-info">Security Settings</h2>
            <p className="text-secondary small">Account: <span className="text-white fw-bold">{userEmail}</span></p>
          </div>
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={() => handleSignOut('local')}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Sign Out"}
          </Button>
        </header>

        {message.text && (
          <Alert variant={message.type} onClose={() => setMessage({type:'', text:''})} dismissible className="border-0 shadow">
            {message.text}
          </Alert>
        )}

        <Row className="g-4">
          <Col lg={7}>
            {/* Change Password Card */}
            <Card className="bg-secondary bg-opacity-10 border-secondary mb-4 shadow-sm">
              <Card.Header className="bg-transparent border-secondary py-3">
                <h5 className="mb-0 text-white">Update Password</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handlePasswordUpdate}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-secondary">New Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 8 characters" 
                          className="bg-dark border-secondary text-white" 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-secondary">Confirm Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password" 
                          className="bg-dark border-secondary text-white" 
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="info" type="submit" className="fw-bold px-4" disabled={loading}>
                    {loading ? "Processing..." : "Update Password"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Card className="bg-secondary bg-opacity-10 border-secondary">
              <Card.Body className="d-flex align-items-center justify-content-between p-4 text-white">
                <div className="d-flex align-items-center">
                   <span className="fs-2 me-3">🛡️</span>
                   <div>
                      <h6 className="mb-0">Session Protection</h6>
                      <small className="text-secondary">Supabase is actively managing your secure session tokens.</small>
                   </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            {/* Login History Card */}
            <Card className="bg-secondary bg-opacity-10 border-secondary h-100 shadow-sm">
              <Card.Header className="bg-transparent border-secondary py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-white">Login History</h5>
                <Button 
                  variant="link" 
                  onClick={() => handleSignOut('global')} 
                  className="text-danger p-0 text-decoration-none small fw-bold"
                >
                  Logout All Devices
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {loginHistory.map((item, index) => (
                    <ListGroup.Item key={index} className="bg-transparent border-secondary py-3 px-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold text-light">{item.device}</div>
                          <div className="small text-secondary">{item.location}</div>
                          <div className="text-muted" style={{fontSize: '11px'}}>{item.date}</div>
                        </div>
                        <Badge 
                          bg="info" 
                          className="bg-opacity-10 px-2 py-1"
                          style={{ color: '#0dcaf0', fontSize: '9px', border: '1px solid #0dcaf0' }}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminSecurity;