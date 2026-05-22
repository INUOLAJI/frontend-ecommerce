import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';

const AdminDashboard = () => {
  // 1. Setup state for our live data
  const [data, setData] = useState({ stats: [], recentOrders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Fetch data from your Node.js backend
    axios.get('http://localhost:5000/api/dashboard/stats')
      .then(res => {
        setData({
          stats: res.data.stats || [],
          recentOrders: res.data.recentOrders || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  // 3. Loading state guard
  if (loading) {
    return (
      <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
        <h4 className="text-info">Loading Dashboard Data...</h4>
      </div>
    );
  }

  return (
    <div className="bg-dark text-white min-vh-100">
      <Row className="g-0">
        {/* Main Content */}
        <Col md={12} className="p-4 content-fade-in">
          <header className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-bold text-info">Overview</h2>
              <p className="text-secondary">Welcome back, Admin.</p>
            </div>
          </header>

          {/* Stats Cards - Dynamically loaded from Backend */}
          <Row className="mb-5 gy-4"> 
            {data.stats.map((stat, index) => (
              <Col md={4} key={index}>
                <Card className="bg-secondary bg-opacity-10 border-secondary hover-lift h-100">
                  <Card.Body>
                    <h6 className="text-secondary text-uppercase small">{stat.title}</h6>
                    <h3 className={`fw-bold ${stat.color} `}>{stat.value}</h3>
                    <span className="small text-white-50">{stat.growth} from last month</span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Recent Orders Table - Dynamically loaded from Backend */}
          <Card className="bg-secondary bg-opacity-10 border-secondary shadow-sm">
            <Card.Header className="bg-transparent border-secondary py-3">
              <h5 className="mb-0 text-white">Recent Orders</h5>
            </Card.Header>
            <Card.Body className="p-0 p-md-3">
              <Table 
                variant="dark" 
                hover 
                className="mb-0 align-middle" 
                style={{ fontSize: 'calc(14px + (18 - 14) * ((100vw - 320px) / (1200 - 320)))' }}
              >
                <thead>
                  <tr className="text-secondary border-secondary">
                    <th className="ps-3">ID</th>
                    <th>Customer</th>
                    <th className="d-none d-md-table-cell">Status</th>
                    <th>Amount</th>
                    <th className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders?.map((order) => (
                    <tr key={order.id} className="border-secondary">
                      <td className="ps-3 text-info fw-bold">{order.id}</td>
                      {/* Note: using customer_name_cache from your Supabase query */}
                      <td className="text-truncate" style={{ maxWidth: '150px' }}>
                        {order.customer_name || "Guest"}
                      </td>
                      <td className="d-none d-md-table-cell">
                        <span className={`badge ${order.status === 'Delivered' || order.status === 'Paid' ? 'bg-success' : 'bg-warning'} bg-opacity-25 text-${order.status === 'Delivered' || order.status === 'Paid' ? 'success' : 'warning'} px-2`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="fw-bold">${order.total_amount}</td>
                      <td className="text-end pe-3">
                        <Button variant="outline-info" size="sm" className="px-3">
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {data.recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-secondary">No recent orders found.</td>
                    </tr>
                  )}
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