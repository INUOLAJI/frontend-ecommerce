import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, ListGroup, Badge, Row, Col, Spinner } from 'react-bootstrap';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('https://backend-ecommerce-i0mn.onrender.com/api/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // 2. Mark a single notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`https://backend-ecommerce-i0mn.onrender.com/api/notifications/${id}/read`);
      // Update local state to reflect change
      setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (err) {
      console.error("Error updating notification", err);
    }
  };

  // 3. Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await axios.put('https://backend-ecommerce-i0mn.onrender.com/api/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    } catch (err) {
      console.error("Error updating all notifications", err);
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
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-info">Notifications</h2>
            <p className="text-secondary">Stay updated with your store's latest activity</p>
          </div>
          <Button variant="outline-info" size="sm" className="fw-bold" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        </header>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="bg-secondary bg-opacity-10 border-secondary shadow-sm">
              <ListGroup variant="flush">
                {notifications.map((notif) => (
                  <ListGroup.Item 
                    key={notif.id} 
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`bg-transparent border-secondary py-4 px-4 position-relative hover-lift-sm transition-all ${notif.unread ? 'bg-info bg-opacity-5' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-start">
                      <div className="bg-dark border border-secondary rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                        <span className="fs-4">{notif.icon || '🔔'}</span>
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className={`mb-0 ${notif.unread ? 'text-white fw-bold' : 'text-secondary'}`}>
                            {notif.title}
                          </h6>
                          <small className="text-muted">
                            {/* Simple time logic if your DB uses timestamps */}
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                        <p className={`mb-0 small ${notif.unread ? 'text-light' : 'text-secondary'}`}>
                          {notif.desc}
                        </p>
                      </div>

                      {notif.unread && (
                        <div className="ms-3">
                          <Badge pill bg="info" style={{ width: '10px', height: '10px', padding: 0 }}> </Badge>
                        </div>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
                
                {notifications.length === 0 && (
                  <div className="p-5 text-center text-secondary">No notifications yet.</div>
                )}
              </ListGroup>
              <Card.Footer className="bg-transparent border-secondary text-center py-3">
                <Button variant="link" className="text-secondary text-decoration-none small">
                  Load older notifications
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminNotifications;