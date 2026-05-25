import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form, Row, Col, Spinner, Badge } from 'react-bootstrap';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [custRes, orderRes] = await Promise.all([
        axios.get('http://localhost:5000/api/customers'),
        axios.get('http://localhost:5000/api/orders')
      ]);
      setCustomers(custRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ✅ Each customer gets their OWN orders filtered by their email
  const getCustomerStats = (email) => {
    const customerOrders = orders.filter(
      o => o.email?.toLowerCase().trim() === email?.toLowerCase().trim()
    );
    const totalSpent = customerOrders.reduce(
      (sum, o) => sum + Number(o.total_amount || 0), 0
    );
    return {
      count: customerOrders.length,
      spent: totalSpent.toFixed(2),
      orders: customerOrders // full order list per customer
    };
  };

  // ✅ Match orders by customer_name instead of email
// const getCustomerStats = (full_name) => {
//   const customerOrders = orders.filter(
//     o => o.customer_name?.toLowerCase().trim() === full_name?.toLowerCase().trim()
//   );
//   const totalSpent = customerOrders.reduce(
//     (sum, o) => sum + Number(o.total_amount || 0), 0
//   );
//   return {
//     count: customerOrders.length,
//     spent: totalSpent.toFixed(2),
//     orders: customerOrders
//   };
// };

  const filteredCustomers = customers.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Overall stats
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const avgValue = customers.length > 0 ? (totalRevenue / customers.length).toFixed(2) : "0.00";

  if (loading) return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="info" />
    </div>
  );

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-info">Customers</h2>
            <p className="text-secondary mb-0">Manage your user base and relationship history</p>
          </div>
          <Button variant="outline-info" className="fw-bold px-4" onClick={fetchData}>
            Refresh Data
          </Button>
        </header>

        {/* Stats Summary */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="bg-info bg-opacity-10 border-info border-opacity-25 p-3">
              <div className="small text-info text-uppercase fw-bold">Total Customers</div>
              <div className="h3 fw-bold text-white">{customers.length}</div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-success bg-opacity-10 border-success border-opacity-25 p-3">
              <div className="small text-success text-uppercase fw-bold">Avg. Customer Value</div>
              <div className="h3 fw-bold text-white">${avgValue}</div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-warning bg-opacity-10 border-warning border-opacity-25 p-3">
              <div className="small text-warning text-uppercase fw-bold">Total Revenue</div>
              <div className="h3 fw-bold text-white">${totalRevenue.toFixed(2)}</div>
            </Card>
          </Col>
        </Row>

        {/* Search */}
        <Card className="bg-secondary bg-opacity-10 border-secondary mb-4 p-3 border-0">
          <Row>
            <Col xs={12} md={8} lg={6}>
              <div className="d-flex shadow-sm">
                <Form.Control
                  placeholder="Search by name or email..."
                  className="bg-dark border-secondary text-white py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderTopRightRadius: '0', borderBottomRightRadius: '0' }}
                />
                <Button variant="info" className="px-4 fw-bold"
                  style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}>
                  Search
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Desktop Header */}
        <div className="d-none d-md-block bg-dark py-3 px-4 border border-secondary rounded-top">
          <Row className="text-secondary small fw-bold text-uppercase">
            <Col md={4}>Customer</Col>
            <Col md={2}>Status</Col>
            <Col md={2}>Orders</Col>
            <Col md={2}>Total Spent</Col>
            <Col md={2} className="text-end">Actions</Col>
          </Row>
        </div>

        {/* Customer List */}
        <div className="admin-list">
          {filteredCustomers.map((user) => {
            const stats = getCustomerStats(user.email); // ✅ individual stats per customer
            return (
              <div key={user.id} className="p-4 p-md-3 mb-3 mb-md-0 bg-secondary bg-opacity-10 border border-secondary rounded transition-all hover-lift-sm">
                <Row className="align-items-center gy-4 g-md-0">
                  <Col xs={12} md={4}>
                    <div className="d-flex align-items-center">
                      <div
                        className="bg-info rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                        style={{ width: '45px', height: '45px', fontSize: '16px', fontWeight: 'bold', color: '#000' }}
                      >
                        {(user.full_name || user.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold text-white">{user.full_name || "Guest Customer"}</div>
                        <div className="small text-secondary">{user.email}</div>
                        <div className="small text-secondary">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col xs={6} md={2}>
                    <div className="d-md-none small text-secondary mb-1">Status</div>
                    <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 px-2">
                      ● Active
                    </Badge>
                  </Col>

                  {/* ✅ Individual order count */}
                  <Col xs={6} md={2}>
                    <div className="d-md-none small text-secondary mb-1">Orders</div>
                    <div className="text-white fw-bold">{stats.count}</div>
                    <div className="small text-secondary">
                      {stats.count === 1 ? '1 order' : `${stats.count} orders`}
                    </div>
                  </Col>

                  {/* ✅ Individual total spent */}
                  <Col xs={12} md={2}>
                    <div className="d-md-none small text-secondary mb-1">Total Spent</div>
                    <div className="fw-bold text-info">${stats.spent}</div>
                    {stats.count > 0 && (
                      <div className="small text-secondary">
                        Avg: ${(stats.spent / stats.count).toFixed(2)}/order
                      </div>
                    )}
                  </Col>

                  <Col xs={12} md={2} className="text-md-end mt-2 mt-md-0">
                    <div className="d-flex gap-2 justify-content-md-end">
                      {/* <Button variant="outline-light" size="sm" className="border-secondary px-3">
                        Details
                      </Button> */}
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => window.open(`https://wa.me/?text=Hello ${user.full_name}, this is Pro-Shop Admin.`)}
                      >
                        Contact
                      </Button>
                    </div>
                  </Col>
                </Row>

                {/* ✅ Show individual order history per customer */}
                {stats.orders.length > 0 && (
                  <div className="mt-3 pt-3 border-top border-secondary">
                    <div className="small text-secondary fw-bold mb-2">ORDER HISTORY</div>
                    <Row className="g-2">
                      {stats.orders.map((order) => (
                        <Col xs={12} md={6} key={order.id}>
                          <div className="bg-dark rounded p-2 d-flex justify-content-between align-items-center">
                            <div>
                              <div className="small text-white fw-bold">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </div>
                              <div className="small text-secondary">
                                {new Date(order.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="small text-info fw-bold">${Number(order.total_amount).toFixed(2)}</div>
                              <Badge bg={
                                order.status === 'Delivered' ? 'success' :
                                order.status === 'Pending' ? 'warning' : 'info'
                              } className="bg-opacity-25" style={{ fontSize: '0.6rem' }}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </div>
            );
          })}

          {filteredCustomers.length === 0 && (
            <div className="text-center p-5 text-secondary border border-secondary rounded mt-3">
              No customers found.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default AdminCustomers;