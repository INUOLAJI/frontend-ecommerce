import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, Navbar, Nav, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart(); // Get the function
  const { getCartCount } = useCart();

  useEffect(() => {
    // Fetch products from the backend we just set up!
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-dark text-white min-vh-100">
      {/* Simple Navigation for Customer Side */}
      <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary py-3 sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-info">PRO-SHOP</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" className="mx-2 text-white">Home</Nav.Link>
              <Nav.Link className="mx-2">Categories</Nav.Link>
              <Nav.Link className="mx-2 position-relative" as={Link} to="/cart">
  Cart 🛒
  {getCartCount() > 0 && (
    <Badge pill bg="info" className="ms-1 position-absolute top-0 start-100 translate-middle">
      {getCartCount()}
    </Badge>
  )}
</Nav.Link>
              {/* <Button as={Link} to="/admin/dashboard" variant="outline-info" size="sm" className="ms-3 fw-bold">Admin Portal</Button> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="py-5 text-center bg-gradient" style={{ background: 'linear-gradient(45deg, #0f172a 0%, #1e293b 100%)' }}>
        <Container className="py-5 content-fade-in">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Badge bg="info" className="mb-3 px-3 py-2 text-dark fw-bold">NEW ARRIVALS 2026</Badge>
              <h1 className="display-3 fw-bold mb-4">Upgrade Your Digital Lifestyle</h1>
              <p className="lead text-secondary mb-5">Premium gadgets and software solutions curated for the modern professional.</p>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="info" size="lg" className="fw-bold px-5 py-3">Shop Now</Button>
                <Button variant="outline-light" size="lg" className="fw-bold px-5 py-3">View Deals</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="fw-bold text-white mb-0">Featured Products</h2>
            <p className="text-secondary mb-0">Handpicked items just for you</p>
          </div>
          <Button variant="link" className="text-info text-decoration-none fw-bold">View All →</Button>
        </div>

        <Row className="g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Col key={product.id} sm={6} md={4} lg={3}>
                <Card className="bg-secondary bg-opacity-10 border-secondary h-100 hover-lift transition-all overflow-hidden">
                  {/* Placeholder for Product Image */}
                  <div className="bg-dark d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                    <span className="display-4 text-secondary opacity-25">📦</span>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg="dark" className="border border-secondary text-secondary">{product.category}</Badge>
                      <span className="text-info fw-bold">${product.price}</span>
                    </div>
                    <Card.Title className="text-white fw-bold fs-5 mb-3">{product.name}</Card.Title>
                    <div className="mt-auto">
                      <Button 
    variant="outline-info" 
    className="w-100 fw-bold"
    onClick={() => addToCart(product)} // Pass the product object
  >
    Add to Cart
  </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            // Placeholder skeletons if loading
            [1, 2, 3, 4].map(n => (
              <Col key={n} sm={6} md={4} lg={3}>
                <Card className="bg-secondary bg-opacity-10 border-secondary h-100 opacity-50">
                   <div style={{ height: '200px' }} className="bg-dark"></div>
                   <Card.Body><div className="bg-dark py-3 rounded"></div></Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>

      {/* Footer */}
      <footer className="py-5 border-top border-secondary mt-5">
        <Container className="text-center">
          <p className="text-secondary small mb-0">© 2026 PRO-SHOP Ecommerce. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default CustomerHome;