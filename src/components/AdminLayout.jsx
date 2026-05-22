import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button, Offcanvas, Navbar, Badge, Collapse } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // ✅ add this

const AdminLayout = ({ children }) => {
  const [show, setShow] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // ✅ add this

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path) => location.pathname === path ? 'bg-info bg-opacity-10 text-white' : 'text-secondary';

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      navigate('/admin-login'); // ✅ redirect after logout
    }
  };

  const SidebarContent = () => (
    <Nav className="flex-column gap-2 mt-4">
      <Nav.Link as={Link} to="/admin/dashboard" onClick={handleClose} className={`px-3 py-2 rounded transition-all ${isActive('/admin/dashboard')}`}>
        Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/admin/products" onClick={handleClose} className={`px-3 py-2 rounded transition-all ${isActive('/admin/products')}`}>
        Products
      </Nav.Link>
      <Nav.Link as={Link} to="/admin/orders" onClick={handleClose} className={`px-3 py-2 rounded ${isActive('/admin/orders')}`}>
        Orders
      </Nav.Link>
      <Nav.Link as={Link} to="/admin/customers" onClick={handleClose} className={`px-3 py-2 rounded ${isActive('/admin/customers')}`}>
        Customers
      </Nav.Link>

      <div>
        <div
          onClick={() => setOpenSettings(!openSettings)}
          className="px-3 py-2 rounded d-flex justify-content-between align-items-center text-secondary"
          style={{ cursor: 'pointer' }}
        >
          <span>Settings</span>
          <span style={{
            transform: openSettings ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: '0.3s',
            fontSize: '0.8rem'
          }}>▼</span>
        </div>

        <Collapse in={openSettings}>
          <div className="ms-3 mt-1 border-start border-secondary border-opacity-25">
            <Nav.Link as={Link} to="/admin/settings" onClick={handleClose} className={`ps-4 py-1 small ${isActive('/admin/settings')}`}>
              General
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/security" onClick={handleClose} className={`ps-4 py-1 small ${isActive('/admin/security')}`}>
              Security
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/notifications" onClick={handleClose} className={`ps-4 py-1 small d-flex justify-content-between align-items-center ${isActive('/admin/notifications')}`}>
              Notifications
              {/* <Badge pill bg="info" style={{ fontSize: '0.6rem' }}>2</Badge> */}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/billing" onClick={handleClose} className={`ps-4 py-1 small ${isActive('/admin/billing')}`}>
              Billing
            </Nav.Link>
          </div>
        </Collapse>

        <Button variant="outline-danger" onClick={handleLogout} className="m-3">
          Logout
        </Button>
      </div>
    </Nav>
  );

  return (
    <div className="bg-dark text-white min-vh-100">
      <Navbar
        bg="dark"
        variant="dark"
        fixed="top"
        className="d-md-none border-bottom border-secondary px-3 justify-content-between"
      >
        <Navbar.Brand className="text-info fw-bold">AdminPanel</Navbar.Brand>
        <Button variant="outline-info" onClick={handleShow} className="border-0 p-1">
          <span className="navbar-toggler-icon"></span>
        </Button>
      </Navbar>

      <Row className="g-0 pt-5 pt-md-0">
        {/* Desktop Sidebar */}
        <Col
          md={3} lg={2}
          className="bg-secondary bg-opacity-10 p-3 border-end border-secondary d-none d-md-block"
          style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 1020 }}
        >
          <h4 className="text-info mb-5 px-2 fw-bold">AdminPanel</h4>
          <SidebarContent />
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="p-0">
          {children}
        </Col>
      </Row>

      {/* Mobile Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-dark text-white">
        <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-secondary">
          <Offcanvas.Title className="text-info">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default AdminLayout;