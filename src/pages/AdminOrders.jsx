import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Badge, Form, Row, Col, Spinner } from 'react-bootstrap';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 1. Fetch real orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. NEW: Handle Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus
      });
      // Update local state so we don't have to fetch everything again
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  // 3. Logic for Search and Status Filtering
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "" || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return { bg: 'success', color: '#198754' };
      case 'Shipped': return { bg: 'info', color: '#0dcaf0' };
      case 'Pending': return { bg: 'warning', color: '#ffc107' };
      case 'Cancelled': return { bg: 'danger', color: '#dc3545' };
      default: return { bg: 'secondary', color: '#6c757d' };
    }
  };

  if (loading) return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="info" />
    </div>
  );

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        <header className="mb-4 d-flex justify-content-between align-items-end">
          <div>
            <h2 className="fw-bold text-info">Orders</h2>
            <p className="text-secondary mb-0">Track and manage customer transactions</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-info" size="sm" onClick={fetchOrders}>Refresh</Button>
            <Button variant="outline-info" size="sm">Export CSV</Button>
          </div>
        </header>

        {/* Filter Controls */}
        <Card className="bg-secondary bg-opacity-10 border-secondary mb-4 p-3 border-0">
          <Row className="gy-3 gx-2 align-items-center">
            <Col xs={12} md={6} lg={5}>
              <Form.Group>
                <div className="d-flex shadow-sm">
                  <Form.Control 
                    placeholder="Search Order ID..." 
                    className="bg-dark border-secondary text-white py-2" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ borderTopRightRadius: '0', borderBottomRightRadius: '0' }}
                  />
                  <Button variant="info" className="px-4 fw-bold" style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}>
                    Search
                  </Button>
                </div>
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={3}>
              <Form.Select 
                className="bg-dark border-secondary text-white py-2"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Col>
          </Row>
        </Card>

        {/* Orders Table */}
        <Card className="bg-transparent border-0 text-white">
          <div className="d-none d-md-block bg-dark py-3 px-4 border border-secondary rounded-top">
            <Row className="text-secondary small fw-bold text-uppercase">
              <Col md={2}>Order ID</Col>
              <Col md={3}>Customer</Col>
              <Col md={2}>Total</Col>
              <Col md={3}>Status</Col>
              <Col md={2} className="text-end">Manage</Col>
            </Row>
          </div>

          <div className="admin-list mt-md-0">
            {filteredOrders.map((order) => {
              const style = getStatusStyle(order.status);
              return (
                <div key={order.id} className="p-4 p-md-3 mb-3 mb-md-0 bg-secondary bg-opacity-10 border border-secondary rounded transition-all hover-lift-sm">
                  <Row className="align-items-center gy-4 g-md-0">
                    
                    <Col xs={12} md={2}>
                      <div className="d-flex flex-column gap-1">
                        <span className="fw-bold text-info">#{order.id.toString().slice(0, 8)}</span>
                        <span className="small text-secondary">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </Col>

                    <Col xs={12} md={3}>
                      <div className="d-md-none small text-secondary mb-1">Customer</div>
                      <div className="text-white fw-medium">{order.customer_name || "Guest"}</div>
                    </Col>

                    <Col xs={6} md={2}>
                      <div className="d-md-none small text-secondary mb-1">Total</div>
                      <div className="fw-bold text-white">${order.total_amount}</div>
                    </Col>

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

                    <Col xs={12} md={2} className="text-md-end mt-2 mt-md-0">
                      {/* NEW: Action Dropdown to change status */}
                      <Form.Select 
                        size="sm" 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-dark text-info border-info fw-bold"
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="Pending">Set Pending</option>
                        <option value="Shipped">Set Shipped</option>
                        <option value="Delivered">Set Delivered</option>
                        <option value="Cancelled">Set Cancelled</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </div>
              );
            })}
            
            {filteredOrders.length === 0 && (
              <div className="text-center p-5 text-secondary border border-secondary border-dashed rounded mt-3">
                No orders found.
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AdminOrders;