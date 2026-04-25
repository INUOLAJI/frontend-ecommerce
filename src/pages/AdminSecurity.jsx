import React from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';

const AdminSecurity = () => {
  const loginHistory = [
    { device: "Chrome on MacOS", location: "Lagos, Nigeria", date: "Oct 26, 2023 - 10:45 AM", status: "Current Session" },
    { device: "Safari on iPhone 13", location: "Lagos, Nigeria", date: "Oct 25, 2023 - 08:12 PM", status: "Recognized" },
    { device: "Firefox on Windows", location: "London, UK", date: "Oct 20, 2023 - 03:22 AM", status: "Expired" },
  ];

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        <header className="mb-4">
          <h2 className="fw-bold text-info">Security Settings</h2>
          <p className="text-secondary">Manage your password, authentication, and login activity</p>
        </header>

        <Row className="g-4">
          {/* Left Column: Password & 2FA */}
          <Col lg={7}>
            {/* Change Password */}
            <Card className="bg-secondary bg-opacity-10 border-secondary mb-4 shadow-sm">
              <Card.Header className="bg-transparent border-secondary py-3">
                <h5 className="mb-0 text-white">Change Password</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary">Current Password</Form.Label>
                    <Form.Control type="password" placeholder="••••••••" className="bg-dark border-secondary text-white" />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-secondary">New Password</Form.Label>
                        <Form.Control type="password" placeholder="Min. 8 characters" className="bg-dark border-secondary text-white" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small text-secondary">Confirm New Password</Form.Label>
                        <Form.Control type="password" placeholder="Match new password" className="bg-dark border-secondary text-white" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="info" className="fw-bold px-4 mt-2">Save New Password</Button>
                </Form>
              </Card.Body>
            </Card>

            {/* 2FA Section */}
            <Card className="bg-secondary bg-opacity-10 border-secondary">
              <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 p-3 rounded me-4">
                    <span className="text-info fs-3">🛡️</span>
                  </div>
                  <div>
                    <h5 className="mb-1 text-white">Two-Factor Authentication (2FA)</h5>
                    <p className="text-secondary mb-0 small">Add an extra layer of security to your admin account.</p>
                  </div>
                </div>
                <Button variant="outline-info" className="fw-bold">Enable</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Device History */}
          <Col lg={5}>
            <Card className="bg-secondary bg-opacity-10 border-secondary h-100 shadow-sm">
              <Card.Header className="bg-transparent border-secondary py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-white">Login History</h5>
                <Button variant="link" className="text-danger p-0 text-decoration-none small">Logout All</Button>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {loginHistory.map((item, index) => (
                    <ListGroup.Item key={index} className="bg-transparent border-secondary py-3 px-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold text-light">{item.device}</div>
                          <div className="small text-secondary">{item.location}</div>
                          <div className="extra-small text-muted" style={{fontSize: '11px'}}>{item.date}</div>
                        </div>
                        <Badge 
                          bg={item.status === 'Current Session' ? 'info' : 'secondary'} 
                          className="bg-opacity-10 text-uppercase"
                          style={{ color: item.status === 'Current Session' ? '#0dcaf0' : '#6c757d', fontSize: '10px' }}
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