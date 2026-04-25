import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // Mock data for the dashboard
  const stats = [
    { title: "Total Sales", value: "$12,850", growth: "+12%", color: "text-info" },
    { title: "Active Orders", value: "45", growth: "5 pending", color: "text-warning" },
    { title: "Customers", value: "1,200", growth: "+3%", color: "text-success" }
  ];

  const recentOrders = [
    { id: "#1024", customer: "John Doe", status: "Paid", amount: "$120.00" },
    { id: "#1025", customer: "Jane Smith", status: "Pending", amount: "$450.00" },
    { id: "#1026", customer: "Bob Johnson", status: "Shipped", amount: "$89.99" },
  ];

  return (
    <div className="bg-dark text-white min-vh-100">
      <Row className="g-0">
        {/* Sidebar */}
        {/* <Col md={2} className="bg-secondary bg-opacity-10 min-vh-100 p-3 border-end border-secondary d-none d-md-block">
          <h4 className="text-info mb-5 px-2">AdminPanel</h4>
          <Nav className="flex-column gap-2">
            <Nav.Link as={Link} to="/" className="text-white bg-info bg-opacity-10 rounded">Dashboard</Nav.Link>
            
<Nav.Link as={Link} to="/admin/products" className="text-secondary hover-info">
  Products
</Nav.Link>
           <Nav.Link as={Link} to="/admin/orders" className="text-secondary hover-info">
 Order
</Nav.Link>
                      <Nav.Link as={Link} to="/admin/customers" className="text-secondary hover-info">
 Customers
</Nav.Link>
            <Nav.Link as={Link} to="/admin/settings" className="text-secondary px-3">
  Settings
</Nav.Link>
          </Nav>
        </Col> */}

        {/* Main Content */}
        <Col md={10} className="p-4 content-fade-in">
          <header className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-bold">Overview</h2>
              <p className="text-secondary">Welcome back, Admin.</p>
            </div>
            <Button variant="info" className="fw-bold">+ Add Product</Button>
          </header>

          {/* Stats Cards */}
         <Row className="mb-5 gy-4"> 
  {stats.map((stat, index) => (
    <Col md={4} key={index}>
      <Card className="bg-secondary bg-opacity-10 border-secondary hover-lift h-100">
        <Card.Body>
          <h6 className="text-secondary text-uppercase small text-white">{stat.title}</h6>
          <h3 className={`fw-bold ${stat.color} `}>{stat.value}</h3>
          <span className="small text-white">{stat.growth} from last month</span>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>

          {/* Recent Orders Table */}
         <Card className="bg-secondary bg-opacity-10 border-secondary">
  <Card.Header className="bg-transparent border-secondary py-3">
    <h5 className="mb-0 text-white">Recent Orders</h5>
  </Card.Header>
  <Card.Body className="p-0 p-md-3">
    <Table 
      variant="dark" 
      hover 
      className="mb-0 align-middle" 
      /* This sets mobile to ~14px and desktop (md and up) to 18px */
      style={{ fontSize: 'calc(14px + (18 - 14) * ((100vw - 320px) / (1200 - 320)))', minFontSize: '14px', maxFontSize: '18px' }}
    >
      <thead>
        <tr className="text-secondary border-secondary">
          <th className="ps-3">ID</th>
          <th>Customer</th>
          <th className="d-none d-md-table-cell">Status</th> {/* Hidden on mobile/tablet, shown on desktop */}
          <th>Amount</th>
          <th className="text-end pe-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {recentOrders.map((order) => (
          <tr key={order.id} className="border-secondary">
            <td className="ps-3 text-info fw-bold">{order.id}</td>
            <td className="text-truncate" style={{ maxWidth: '120px' }}>{order.customer}</td>
            <td className="d-none d-md-table-cell">
              <span className={`badge ${order.status === 'Paid' ? 'bg-success' : 'bg-warning'} bg-opacity-25 text-${order.status === 'Paid' ? 'success' : 'warning'} px-2`}>
                {order.status}
              </span>
            </td>
            <td className="fw-bold">{order.amount}</td>
            <td className="text-end pe-3">
              <Button variant="outline-info" size="sm" className="px-3">
                Details
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Card.Body>
</Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;