import React from 'react';
import { Container, Card, Button, ListGroup, Badge, Row, Col } from 'react-bootstrap';

const AdminNotifications = () => {
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      desc: "Order #ORD-7725 from Tunde Williams is pending review.",
      time: "2 mins ago",
      unread: true,
      icon: "🛍️"
    },
    {
      id: 2,
      type: "security",
      title: "New Login Detected",
      desc: "Your account was accessed from a new device in London, UK.",
      time: "45 mins ago",
      unread: true,
      icon: "🔒"
    },
    {
      id: 3,
      type: "system",
      title: "Inventory Alert",
      desc: "Premium Wireless Headphones are almost out of stock (2 left).",
      time: "3 hours ago",
      unread: false,
      icon: "⚠️"
    },
    {
      id: 4,
      type: "customer",
      title: "New Customer Signup",
      desc: "Sarah Jenkins just created a new store account.",
      time: "Yesterday",
      unread: false,
      icon: "👤"
    }
  ];

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-info">Notifications</h2>
            <p className="text-secondary">Stay updated with your store's latest activity</p>
          </div>
          <Button variant="outline-info" size="sm" className="fw-bold">
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
                    className={`bg-transparent border-secondary py-4 px-4 position-relative hover-lift-sm transition-all ${notif.unread ? 'bg-info bg-opacity-5' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-start">
                      {/* Icon Circle */}
                      <div className="bg-dark border border-secondary rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                        <span className="fs-4">{notif.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className={`mb-0 ${notif.unread ? 'text-white fw-bold' : 'text-secondary'}`}>
                            {notif.title}
                          </h6>
                          <small className="text-muted">{notif.time}</small>
                        </div>
                        <p className={`mb-0 small ${notif.unread ? 'text-light' : 'text-secondary'}`}>
                          {notif.desc}
                        </p>
                      </div>

                      {/* Unread Dot */}
                      {notif.unread && (
                        <div className="ms-3">
                          <Badge pill bg="info" style={{ width: '10px', height: '10px', padding: 0 }}> </Badge>
                        </div>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
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