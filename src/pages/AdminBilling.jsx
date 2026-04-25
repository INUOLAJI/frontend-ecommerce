import React from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, ProgressBar } from 'react-bootstrap';

const AdminBilling = () => {
  const invoices = [
    { id: "INV-001", date: "Oct 01, 2023", amount: "$49.00", status: "Paid", method: "Visa **** 4242" },
    { id: "INV-002", date: "Sep 01, 2023", amount: "$49.00", status: "Paid", method: "Visa **** 4242" },
    { id: "INV-003", date: "Aug 01, 2023", amount: "$49.00", status: "Paid", method: "Visa **** 4242" },
  ];

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        <header className="mb-4">
          <h2 className="fw-bold text-info">Billing & Subscription</h2>
          <p className="text-secondary">Manage your plan, payment methods, and invoices</p>
        </header>

        <Row className="g-4">
          {/* Plan Overview */}
          <Col lg={8}>
            <Card className="bg-secondary bg-opacity-10 border-secondary mb-4 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <Badge bg="info" className="mb-2 text-dark fw-bold">PRO PLAN</Badge>
                    <h3 className="fw-bold text-white">$49.00 <span className="fs-6 text-secondary fw-normal">/ month</span></h3>
                  </div>
                  <Button variant="outline-info" size="sm">Change Plan</Button>
                </div>
                
                <div className="mb-4">
                  <div className="d-flex justify-content-between small mb-1 text-white">
                    <span>Storage Usage</span>
                    <span>7.5 GB of 10 GB</span>
                  </div>
                  <ProgressBar variant="info" now={75} style={{ height: '8px' }} className="bg-dark" />
                </div>

                <p className="small text-secondary mb-0">Your next billing date is <strong>November 1st, 2023</strong>.</p>
              </Card.Body>
            </Card>

            {/* Invoices Table */}
           <Card className="bg-secondary bg-opacity-10 border-secondary border-0 border-md-1 text-white">
  <Card.Header className="bg-transparent border-secondary py-3 d-flex justify-content-between align-items-center">
    <h5 className="mb-0 text-white">Invoice History</h5>
  </Card.Header>

  {/* Desktop Header: Hidden on mobile */}
  <div className="d-none d-md-block bg-dark py-3 px-4 border-bottom border-secondary">
    <Row className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '18px' }}>
      <Col md={2}>Invoice ID</Col>
      <Col md={3}>Date</Col>
      <Col md={2}>Amount</Col>
      <Col md={3}>Status</Col>
      <Col md={2} className="text-end">Download</Col>
    </Row>
  </div>

  {/* Invoice Body / Stacked Cards */}
  <div className="admin-list">
    {invoices.map((inv) => (
      <div 
        key={inv.id} 
        className="p-4 p-md-3 mb-3 mb-md-0 bg-secondary bg-opacity-10 border border-secondary rounded transition-all hover-lift-sm"
      >
        <Row className="align-items-center gy-4 g-md-0" style={{ fontSize: 'calc(14px + (18 - 14) * ((100vw - 320px) / (1200 - 320)))' }}>
          
          {/* Invoice ID */}
          <Col xs={12} md={2}>
            <div className="d-flex flex-column">
              <span className="small text-secondary d-md-none">Invoice ID</span>
              <span className="fw-bold text-info">{inv.id}</span>
            </div>
          </Col>

          {/* Date */}
          <Col xs={6} md={3}>
            <div className="d-md-none small text-secondary mb-1">Date</div>
            <div className="text-white">{inv.date}</div>
          </Col>

          {/* Amount */}
          <Col xs={6} md={2}>
            <div className="d-md-none small text-secondary mb-1">Amount</div>
            <div className="fw-bold text-white">{inv.amount}</div>
          </Col>

          {/* Status */}
          <Col xs={6} md={3}>
            <div className="d-md-none small text-secondary mb-1">Status</div>
            <Badge 
              bg="success" 
              className="bg-opacity-10 px-3 py-2 text-success border border-success"
              style={{ fontSize: '0.75rem' }}
            >
              Paid
            </Badge>
          </Col>

          {/* Download Action */}
          <Col xs={6} md={2} className="text-end">
            <div className="d-md-none small text-secondary mb-1 text-end">Action</div>
            <Button 
              variant="outline-info" 
              size="sm" 
              className="px-3"
            >
              PDF
            </Button>
          </Col>
        </Row>
      </div>
    ))}
  </div>
</Card>
          </Col>

          {/* Payment Method */}
          <Col lg={4}>
            <Card className="bg-secondary bg-opacity-10 border-secondary mb-4">
              <Card.Header className="bg-transparent border-secondary py-3">
                <h5 className="mb-0 text-white">Payment Method</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3 p-3 bg-dark rounded border border-secondary">
                  <div className="fs-2 me-3">💳</div>
                  <div>
                    <div className="fw-bold text-white">Visa Ending in 4242</div>
                    <div className="small text-secondary">Expires 12/26</div>
                  </div>
                </div>
                <Button variant="outline-light" size="sm" className="w-100 border-secondary">Update Card</Button>
              </Card.Body>
            </Card>

            <Card className="bg-info bg-opacity-10 border-info border-opacity-25 text-white">
              <Card.Body>
                <h6>Need help?</h6>
                <p className="small text-secondary">Contact our billing support if you have questions regarding your invoices.</p>
                <Button variant="info" size="sm" className="w-100 fw-bold">Contact Support</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminBilling;