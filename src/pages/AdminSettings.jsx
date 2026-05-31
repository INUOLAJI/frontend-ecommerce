import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Nav, Badge, Spinner, Alert } from 'react-bootstrap';

const AdminSettings = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  // Fetch profile from Supabase on page load
// Move fetchProfile outside useEffect so it can be reused
const fetchProfile = async () => {
  try {
    setFetching(true);
    const res = await axios.get('https://backend-ecommerce-i0mn.onrender.com/api/settings/profile');
    if (res.data) {
      setProfile({
        full_name: res.data.full_name || '',
        email:     res.data.email     || '',
        bio:       res.data.bio       || ''
      });
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    showAlert('Failed to load profile data.', 'danger');
  } finally {
    setFetching(false);
  }
};

// Call it on page load
useEffect(() => {
  fetchProfile();
}, []);

// Call it again after update
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await axios.put('https://backend-ecommerce-i0mn.onrender.com/api/settings/profile', profile);
    await fetchProfile(); // ✅ re-fetches latest data from Supabase
    showAlert('Profile updated successfully!', 'success');
  } catch (err) {
    console.error('Update failed:', err);
    showAlert('Error updating profile.', 'danger');
  } finally {
    setLoading(false);
  }
};

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 4000);
  };

  // Update profile
//   const handleUpdateProfile = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   try {
//     const res = await axios.put('http://localhost:5000/api/settings/profile', profile);
    
//     // ✅ Update the form with the latest saved data
//     if (res.data.data && res.data.data[0]) {
//       setProfile({
//         full_name: res.data.data[0].full_name || '',
//         email:     res.data.data[0].email     || '',
//         bio:       res.data.data[0].bio       || ''
//       });
//     }

//     showAlert('Profile updated successfully!', 'success');
//   } catch (err) {
//     console.error('Update failed:', err);
//     showAlert('Error updating profile.', 'danger');
//   } finally {
//     setLoading(false);
//   }
// };

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container>
        <header className="mb-4">
          <h2 className="fw-bold text-info">Settings</h2>
          <p className="text-secondary">Configure your account and platform preferences</p>
        </header>

        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <Row>
          <Col lg={9}>
            {/* Profile Section */}
            <Card className="bg-secondary bg-opacity-10 border-secondary mb-4">
              <Card.Header className="bg-transparent border-secondary py-3">
                <h5 className="mb-0 text-white fw-bold">Admin Profile</h5>
              </Card.Header>
              <Card.Body>
                {fetching ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="info" />
                    <p className="text-secondary mt-2">Loading profile...</p>
                  </div>
                ) : (
                  <Form onSubmit={handleUpdateProfile}>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label className="small text-secondary fw-bold">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          className="bg-dark border-secondary text-white"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="small text-secondary fw-bold">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          className="bg-dark border-secondary text-white"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          placeholder="Enter email"
                        />
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-secondary fw-bold">Bio / Job Title</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="bg-dark border-secondary text-white"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Enter bio or job title"
                      />
                    </Form.Group>
                    <Button variant="info" type="submit" className="fw-bold px-4" disabled={loading}>
                      {loading ? <><Spinner size="sm" className="me-2" />Updating...</> : 'Update Profile'}
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>

            {/* Store Preferences */}
            <Card className="bg-secondary bg-opacity-10 border-secondary">
              <Card.Header className="bg-transparent border-secondary py-3">
                <h5 className="mb-0 text-white fw-bold">Store Preferences</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary fw-bold">Store Name</Form.Label>
                    <Form.Control type="text" defaultValue="My Digital Shop" className="bg-dark border-secondary text-white" />
                  </Form.Group>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Label className="small text-secondary fw-bold">Currency</Form.Label>
                      <Form.Select className="bg-dark border-secondary text-white">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>NGN (₦)</option>
                        <option>GBP (£)</option>
                      </Form.Select>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small text-secondary fw-bold">Timezone</Form.Label>
                      <Form.Select className="bg-dark border-secondary text-white">
                        <option>GMT+1 (Lagos)</option>
                        <option>UTC (London)</option>
                        <option>EST (New York)</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <div className="border-top border-secondary pt-4 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 text-white fw-bold">Maintenance Mode</h6>
                      <p className="small text-secondary mb-0">Hide the storefront while you make changes</p>
                    </div>
                    <Form.Check type="switch" id="maintenance-switch" />
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminSettings;