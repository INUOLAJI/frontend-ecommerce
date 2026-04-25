import React from 'react';
import { Container, Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap';

const AdminOrders = () => {
  const orders = [
    { id: "#ORD-7721", date: "Oct 24, 2023", customer: "Alice Freeman", total: "$240.00", status: "Delivered", method: "PayPal" },
    { id: "#ORD-7722", date: "Oct 25, 2023", customer: "Mark Ruffalo", total: "$89.99", status: "Shipped", method: "Visa" },
    { id: "#ORD-7723", date: "Oct 25, 2023", customer: "Sarah Jenkins", total: "$1,200.00", status: "Pending", method: "Mastercard" },
    { id: "#ORD-7724", date: "Oct 26, 2023", customer: "Tunde Williams", total: "$45.50", status: "Cancelled", method: "Stripe" },
  ];

  // Helper to color-code statuses
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return { bg: 'success', color: '#198754' };
      case 'Shipped': return { bg: 'info', color: '#0dcaf0' };
      case 'Pending': return { bg: 'warning', color: '#ffc107' };
      case 'Cancelled': return { bg: 'danger', color: '#dc3545' };
      default: return { bg: 'secondary', color: '#6c757d' };
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        <header className="mb-4 d-flex justify-content-between align-items-end">
          <div>
            <h2 className="fw-bold text-info">Orders</h2>
            <p className="text-secondary mb-0">Track and manage customer transactions</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-info" size="sm">Export CSV</Button>
            <Button variant="outline-info" size="sm">Print Invoice</Button>
          </div>
        </header>

        {/* Filter Controls */}
       <Card className="bg-secondary bg-opacity-10 border-secondary mb-4 p-3 border-0 border-md-1">
  <Row className="gy-3 gx-2 align-items-center">
    {/* Search Bar with Button */}
    <Col xs={12} md={6} lg={5}>
      <Form.Group>
        <div className="d-flex shadow-sm">
          <Form.Control 
            placeholder="Search Order ID..." 
            className="bg-dark border-secondary text-white py-2" 
            style={{ 
              borderTopRightRadius: '0', 
              borderBottomRightRadius: '0',
              fontSize: '1rem' 
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

    {/* Filter Dropdown */}
    <Col xs={12} md={4} lg={3}>
      <Form.Select 
        className="bg-dark border-secondary text-white py-2"
        style={{ fontSize: '1rem', cursor: 'pointer' }}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </Form.Select>
    </Col>

    {/* Optional: Clear Filters link for desktop/tablet */}
    {/* <Col xs={12} md={2} className="text-md-start text-center">
      <Button variant="link" className="text-secondary text-decoration-none small p-0">
        Clear Filters
      </Button>
    </Col> */}
  </Row>
</Card>

        {/* Orders Table */}
      <Card className="bg-transparent border-0 text-white">
  {/* Desktop Header: Still hidden on mobile, visible on desktop */}
  <div className="d-none d-md-block bg-dark py-3 px-4 border border-secondary rounded-top">
    <Row className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '18px' }}>
      <Col md={2}>Order ID</Col>
      <Col md={3}>Customer</Col>
      <Col md={2}>Total</Col>
      <Col md={3}>Status</Col>
      <Col md={2} className="text-end">Action</Col>
    </Row>
  </div>

  {/* Table Body / Stacked List */}
  <div className="admin-list mt-md-0">
    {orders.map((order) => {
      const style = getStatusStyle(order.status);
      return (
        /* This div now acts as an individual "Card" on mobile */
        <div 
          key={order.id} 
          className="p-4 p-md-3 mb-3 mb-md-0 bg-secondary bg-opacity-10 border border-secondary rounded transition-all hover-lift-sm"
        >
          <Row className="align-items-center gy-4 g-md-0" style={{ fontSize: 'calc(14px + (18 - 14) * ((100vw - 320px) / (1200 - 320)))' }}>
            
            {/* Order ID & Date */}
            <Col xs={12} md={2}>
              <div className="d-flex flex-column gap-1">
                <span className="fw-bold text-info">{order.id}</span>
                <span className="small text-secondary">{order.date}</span>
              </div>
            </Col>

            {/* Customer */}
            <Col xs={12} md={3}>
              <div className="d-md-none small text-secondary mb-1">Customer</div>
              <div className="text-white fw-medium">{order.customer}</div>
            </Col>

            {/* Total */}
            <Col xs={6} md={2}>
              <div className="d-md-none small text-secondary mb-1">Total</div>
              <div className="fw-bold text-white">{order.total}</div>
            </Col>

            {/* Status */}
            <Col xs={6} md={3}>
              <div className="d-md-none small text-secondary mb-1">Status</div>
              <Badge 
                bg={style.bg} 
                className="bg-opacity-10 px-3 py-2" 
                style={{ color: style.color, border: `1px solid ${style.color}`, fontSize: '0.75rem' }}
              >
                {order.status}
              </Badge>
            </Col>

            {/* Action Button */}
            <Col xs={12} md={2} className="text-md-end mt-2 mt-md-0">
              <Button 
                variant="outline-info" 
                size="sm" 
                className="w-100 w-md-auto px-4 py-2 py-md-1"
              >
                View Details
              </Button>
            </Col>
          </Row>
        </div>
      );
    })}
  </div>
</Card>
      </Container>
    </div>
  );
};

export default AdminOrders;