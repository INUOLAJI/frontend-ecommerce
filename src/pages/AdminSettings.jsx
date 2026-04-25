import React from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminSettings = () => {
  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        <header className="mb-4">
          <h2 className="fw-bold text-info">Settings</h2>
          <p className="text-secondary">Configure your account and platform preferences</p>
        </header>

        <Row>
          {/* Settings Navigation */}
          {/* <Col lg={3} className="mb-4">
            <Card className="bg-secondary bg-opacity-10 border-secondary">
              <Nav className="flex-column p-2">
                <Nav.Link as={Link} to="/admin/settings" className="text-info bg-info bg-opacity-10 rounded mb-1">General</Nav.Link>
                <Nav.Link as={Link} to="/admin/security" className="text-secondary mb-1">Security</Nav.Link>
                <Nav.Link as={Link} to="/admin/notifications" className="text-secondary px-3 hover-info d-flex justify-content-between align-items-center">
                 Notifications
                <Badge pill bg="info" className="ms-2">2</Badge>
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/billing" className="text-secondary">Billing</Nav.Link>
              </Nav>
            </Card>
          </Col> */}

          {/* Settings Forms */}
          <Col lg={9}>
            {/* Profile Section */}
            <Card className="bg-secondary bg-opacity-10 border-secondary mb-4">
              <Card.Header className="bg-transparent border-secondary py-3">
                <h5 className="mb-0 text-white">Admin Profile</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Label className="small text-secondary">Full Name</Form.Label>
                      <Form.Control type="text" defaultValue="Admin User" className="bg-dark border-secondary text-white" />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small text-secondary">Email Address</Form.Label>
                      <Form.Control type="email" defaultValue="admin@pro-ecommerce.com" className="bg-dark border-secondary text-white" />
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary">Bio / Job Title</Form.Label>
                    <Form.Control as="textarea" rows={2} defaultValue="Full-Stack Developer & Store Manager" className="bg-dark border-secondary text-white" />
                  </Form.Group>
                  <Button variant="info" className="fw-bold px-4">Update Profile</Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Store Configuration */}
            <Card className="bg-secondary bg-opacity-10 border-secondary">
              <Card.Header className="bg-transparent border-secondary py-3">
                <h5 className="mb-0 text-white">Store Preferences</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary">Store Name</Form.Label>
                    <Form.Control type="text" defaultValue="My Digital Shop" className="bg-dark border-secondary text-white" />
                  </Form.Group>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Label className="small text-secondary">Currency</Form.Label>
                      <Form.Select className="bg-dark border-secondary text-white">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>NGN (₦)</option>
                        <option>GBP (£)</option>
                      </Form.Select>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small text-secondary">Timezone</Form.Label>
                      <Form.Select className="bg-dark border-secondary text-white">
                        <option>GMT+1 (Lagos)</option>
                        <option>UTC (London)</option>
                        <option>EST (New York)</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  
                  <div className="border-top border-secondary pt-4 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 text-white">Maintenance Mode</h6>
                      <p className="small text-secondary mb-0 text-white">Hide the storefront while you make changes</p>
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