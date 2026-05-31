import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, Navbar, Nav, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { addToCart, getCartCount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://backend-ecommerce-i0mn.onrender.com/api/products');
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let tempProducts = [...products];
    if (selectedCategory !== 'All') {
      tempProducts = tempProducts.filter(p => p.category === selectedCategory);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term)
      );
    }
    setFilteredProducts(tempProducts);
  }, [selectedCategory, searchTerm, products]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="bg-dark text-white min-vh-100">
      {/* Navigation */}
      <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary py-3 sticky-top shadow">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-info">
            MARVELOUS-STORE
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" className="me-auto me-lg-0 ms-lg-auto align-items-center text-white">Home</Nav.Link>
             <Nav.Link 
  className="me-auto me-lg-0 ms-lg-auto align-items-center text-white position-relative" 
  as={Link} 
  to="/cart"
>
  Cart 🛒
  {getCartCount() > 0 && (
    <Badge 
      pill 
      bg="info" 
      className="position-absolute top-0 start-100 translate-middle text-dark fw-bold"
    >
      {getCartCount()}
    </Badge>
  )}
</Nav.Link>
            </Nav>
            <Form className="d-flex my-3 mx-3 my-lg-0">
              <InputGroup style={{ maxWidth: '250px' }}>
                <Form.Control
                  type="search"
                  placeholder="Search gadgets..."
                  className="bg-secondary bg-opacity-10 border-secondary text-white shadow-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-info" className="border-secondary">🔍</Button>
              </InputGroup>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="py-5 text-center" style={{ background: 'linear-gradient(45deg, #0f172a 0%, #1e293b 100%)' }}>
        <Container className="py-5">
          <Badge bg="info" className="mb-3 px-3 py-2 text-dark fw-bold">NEW ARRIVALS 2026</Badge>
          <h1 className="display-4 fw-bold mb-3">Upgrade Your Digital Lifestyle</h1>
          <p className="lead text-white">Premium curated gadgets for the modern pro.</p>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-5">
        
        {/* Category Filters */}
        <div className="mb-5">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "info" : "outline-secondary"}
                className={`rounded-pill px-4 transition-all ${selectedCategory === cat ? 'text-dark fw-bold' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold text-white mb-0">
              {selectedCategory === 'All' ? 'Our Products' : selectedCategory}
            </h2>
            <p className="text-secondary small">Showing {filteredProducts.length} items</p>
          </div>
        </div>

        <Row className="g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col key={product.id} sm={6} md={4} lg={3}>
                <Card className="bg-secondary bg-opacity-10 border-secondary h-100 hover-lift transition-all">
                  
                  {/* ── PRODUCT IMAGE ── */}
                  <div
                    className="bg-dark d-flex align-items-center justify-content-center overflow-hidden"
                    style={{ height: '180px' }}
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="display-4 opacity-25">📦</span>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg="dark" className="border border-secondary text- small">{product.category}</Badge>
                      <span className="text-white fw-bold">${product.price}</span>
                    </div>
                    <Card.Title className="text-white fw-bold fs-6 mb-3">{product.name}</Card.Title>
                    <Button
                      variant="outline-info"
                      className="mt-auto w-100 fw-bold"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center py-5">
              <h4 className="text-secondary opacity-50">No products match your search or filter.</h4>
              <Button variant="link" className="text-info" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
                Clear all filters
              </Button>
            </Col>
          )}
        </Row>
      </Container>

      <footer className="py-5 border-top border-secondary mt-5 text-center">
        <p className="text-white small mb-0">© 2026 PRO-SHOP. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerHome;