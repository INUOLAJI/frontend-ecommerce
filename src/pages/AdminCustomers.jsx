import React from 'react';
import { Container, Card, Table, Button, Form, Row, Col, Image } from 'react-bootstrap';

const AdminCustomers = () => {
  const customers = [
    { id: 1, name: "Alice Freeman", email: "alice@example.com", orders: 12, spent: "$2,400.00", status: "Active" },
    { id: 2, name: "Mark Ruffalo", email: "mark.r@marvel.com", orders: 5, spent: "$890.99", status: "Active" },
    { id: 3, name: "Sarah Jenkins", email: "s.jenkins@web.com", orders: 1, spent: "$1,200.00", status: "New" },
    { id: 4, name: "Tunde Williams", email: "tunde@tech.ng", orders: 0, spent: "$0.00", status: "Inactive" },
  ];

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-info">Customers</h2>
            <p className="text-secondary mb-0">Manage your user base and relationship history</p>
          </div>
          <Button variant="info" className="fw-bold px-4 hover-lift">Invite Customer</Button>
        </header>

        {/* Stats Summary Row */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="bg-info bg-opacity-10 border-info border-opacity-25 p-3">
              <div className="small text-info text-uppercase">Total Customers</div>
              <div className="h3 fw-bold text-white">1,248</div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-success bg-opacity-10 border-success border-opacity-25 p-3">
              <div className="small text-success text-uppercase">Active This Month</div>
              <div className="h3 fw-bold text-white">856</div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-warning bg-opacity-10 border-warning border-opacity-25 p-3">
              <div className="small text-warning text-uppercase">Retention Rate</div>
              <div className="h3 fw-bold text-white">92%</div>
            </Card>
          </Col>
        </Row>

        {/* Customer Table */}
        <div className="text-white">
  {/* Search Header - Responsive width */}
 <Card className="bg-secondary bg-opacity-10 border-secondary mb-4 p-3 border-0 border-md-1">
  <Row>
    <Col xs={15} md={8} lg={6}>
      <Form.Group>
        <div className="d-flex shadow-sm">
          <Form.Control 
            placeholder="Search by name or email..." 
            className="bg-dark border-secondary text-white py-2" 
            style={{ 
              borderTopRightRadius: '0', 
              borderBottomRightRadius: '0',
              fontSize: '1rem', 
              color: 'white',
            }}
          />
          <Button 
            variant="info" 
            className="px-4 fw-bold"
            style={{ 
              borderTopLeftRadius: '0', 
              borderBottomLeftRadius: '0' 
            }}
          >
            Search
          </Button>
        </div>
      </Form.Group>
    </Col>
  </Row>
</Card>

  {/* Desktop Header: Hidden on mobile */}
  <div className="d-none d-md-block bg-dark py-3 px-4 border border-secondary rounded-top">
    <Row className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '18px' }}>
      <Col md={4}>Customer</Col>
      <Col md={2}>Status</Col>
      <Col md={2}>Orders</Col>
      <Col md={2}>Total Spent</Col>
      <Col md={2} className="text-end">Actions</Col>
    </Row>
  </div>

  {/* Customer Body / Stacked Cards */}
  <div className="admin-list">
    {customers.map((user) => (
      <div 
        key={user.id} 
        className="p-4 p-md-3 mb-3 mb-md-0 bg-secondary bg-opacity-10 border border-secondary rounded transition-all hover-lift-sm"
      >
        <Row className="align-items-center gy-4 g-md-0" style={{ fontSize: 'calc(14px + (18 - 14) * ((100vw - 320px) / (1200 - 320)))' }}>
          
          {/* Customer Info */}
          <Col xs={12} md={4}>
            <div className="d-flex align-items-center">
              <div className="bg-info rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" 
                   style={{ width: '45px', height: '45px', fontSize: '16px', fontWeight: 'bold', color: '#000' }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="fw-bold text-white fs-5 fs-md-6">{user.name}</div>
                <div className="small text-secondary">{user.email}</div>
              </div>
            </div>
          </Col>

          {/* Status */}
          <Col xs={6} md={2}>
            <div className="d-md-none small text-secondary mb-1">Status</div>
            <span className={`small fw-medium ${user.status === 'Active' ? 'text-success' : 'text-warning'}`}>
              ● {user.status}
            </span>
          </Col>

          {/* Orders count */}
          <Col xs={6} md={2}>
            <div className="d-md-none small text-secondary mb-1">Orders</div>
            <div className="text-white">{user.orders} orders</div>
          </Col>

          {/* Total Spent */}
          <Col xs={12} md={2}>
            <div className="d-md-none small text-secondary mb-1">Total Spent</div>
            <div className="fw-bold text-info">{user.spent}</div>
          </Col>

          {/* Actions */}
          <Col xs={12} md={2} className="text-md-end mt-2 mt-md-0">
            <div className="d-flex gap-2 justify-content-md-end">
              <Button variant="outline-light" size="sm" className="flex-grow-1 flex-md-grow-0 border-secondary">Profile</Button>
              <Button variant="outline-secondary" size="sm" className="flex-grow-1 flex-md-grow-0">Message</Button>
            </div>
          </Col>
        </Row>
      </div>
    ))}
  </div>
</div>
      </Container>
    </div>
  );
};

export default AdminCustomers;