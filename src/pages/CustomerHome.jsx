import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, Navbar, Nav, InputGroup, Form, Modal, Carousel, Accordion, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // App States
  const [darkMode, setDarkMode] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  // Screen Width Detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Interactive Quiz States
  const [quizBudget, setQuizBudget] = useState(1000);
  const [quizCategory, setQuizCategory] = useState('All');

  // Flash Sale Countdown Logic State
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 55 });

  const { addToCart, getCartCount } = useCart();

  // ─── THE CATALOG REF FOR SCROLL TRACKING ───
  const catalogRef = useRef(null);

  // Listen to screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch Inventory
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

  // Live countdown ticker effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter Catalog Logic
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
    setShowAllProducts(false);
  }, [selectedCategory, searchTerm, products]);

  // ─── OPTIMIZED EFFECT: TIMEOUT AUTO-SCROLL FIX FOR SEARCH ───
  useEffect(() => {
    if (searchTerm.trim() !== '' && catalogRef.current) {
      const timer = setTimeout(() => {
        catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const applyQuizFilter = () => {
    let temp = products.filter(p => p.price <= quizBudget);
    if (quizCategory !== 'All') {
      temp = temp.filter(p => p.category === quizCategory);
    }
    setFilteredProducts(temp);
    setShowAllProducts(false);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const viewLimit = isMobile ? 6 : 8;
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, viewLimit);

  return (
    <div className={`${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'} min-vh-100 transition-all`}>
      
      {/* ─── 1. NAVBAR ─── */}
      <Navbar 
        bg={darkMode ? 'dark' : 'white'} 
        variant={darkMode ? 'dark' : 'light'} 
        expand="md" 
        className={`border-bottom ${darkMode ? 'border-secondary' : 'border-light'} py-3 sticky-top shadow-sm`} 
        style={{ zIndex: 1030 }}
      >
        <Container className="d-flex flex-wrap align-items-center justify-content-between">
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-info m-0">
            MARVELOUS-STORE
          </Navbar.Brand>

          {/* Mobile Cart View */}
          <div className="d-flex d-md-none align-items-center gap-3">
            <Nav.Link className={`fw-semibold position-relative p-1 ${darkMode ? 'text-white' : 'text-dark'}`} as={Link} to="/cart">
              🛒
              {getCartCount() > 0 && (
                <Badge pill bg="info" className={`position-absolute top-0 start-100 translate-middle fw-bold ${darkMode ? 'text-dark' : 'text-white'}`} style={{ fontSize: '0.65rem' }}>
                  {getCartCount()}
                </Badge>
              )}
            </Nav.Link>
            <span style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '🌙' : '☀️'}
            </span>
          </div>

          {/* Independent Mobile-Only Search Space */}
          <div className="w-100 d-block d-md-none mt-3">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search gadgets..."
                className={`shadow-none ${darkMode ? 'bg-secondary bg-opacity-10 border-secondary text-white' : 'bg-light border-light text-dark'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Desktop/Tablet collapsible block */}
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end align-items-center gap-3">
            <Nav className="align-items-center">
              <Nav.Link as={Link} to="/" className={`mx-2 fw-semibold ${darkMode ? 'text-white' : 'text-dark'}`}>Home</Nav.Link>
              <Nav.Link className={`mx-2 fw-semibold position-relative ${darkMode ? 'text-white' : 'text-dark'}`} as={Link} to="/cart">
                Cart 🛒
                {getCartCount() > 0 && (
                  <Badge pill bg="info" className={`position-absolute top-0 start-100 translate-middle fw-bold ${darkMode ? 'text-dark' : 'text-white'}`}>
                    {getCartCount()}
                  </Badge>
                )}
              </Nav.Link>

              <div className="mx-3 my-2 my-lg-0 d-flex align-items-center">
                <span className="me-2">{darkMode ? '🌙' : '☀️'}</span>
                <Form.Check type="switch" id="theme-switch" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="shadow-none" />
              </div>
            </Nav>
            <Form className="d-flex my-3 my-md-0">
              <InputGroup style={{ maxWidth: '250px' }}>
                <Form.Control
                  type="search"
                  placeholder="Search gadgets..."
                  className={`shadow-none ${darkMode ? 'bg-secondary bg-opacity-10 border-secondary text-white' : 'bg-light border-light text-dark'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ─── 2. HERO INTRO CAROUSEL ─── */}
      <Carousel interval={4000} fade className={`shadow-sm border-bottom ${darkMode ? 'border-secondary' : 'border-light'}`}>
        <Carousel.Item>
          <div className="d-flex align-items-center justify-content-center text-center px-4" 
               style={{ minHeight: '400px', background: darkMode 
               ? 'linear-gradient(rgba(15,23,42,0.85), rgba(30,41,59,0.85)), url("https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1280") center/cover no-repeat'
               : 'linear-gradient(rgba(241,245,249,0.85), rgba(226,232,240,0.85)), url("https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1280") center/cover no-repeat' }}>
            <Container>
              <Badge bg="info" className={`mb-3 px-3 py-2 fw-bold ${darkMode ? 'text-dark' : 'text-white'}`}>EXCLUSIVE DEALS</Badge>
              <h1 className="display-4 fw-bold mb-2">Upgrade Your Digital Lifestyle</h1>
              <p className={`lead max-w-md mx-auto fw-medium ${darkMode ? 'text-white-50' : 'text-secondary'}`}>Premium curated hardware and essentials tailored for the modern pro.</p>
              <Button variant="info" className={`fw-bold px-4 py-2 mt-2 ${darkMode ? 'text-dark' : 'text-white'}`} onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}>Shop Offers</Button>
            </Container>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex align-items-center justify-content-center text-center px-4" 
               style={{ minHeight: '400px', background: darkMode 
               ? 'linear-gradient(rgba(15,23,42,0.85), rgba(30,41,59,0.85)), url("https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=1280") center/cover no-repeat'
               : 'linear-gradient(rgba(239,246,255,0.85), rgba(219,234,254,0.85)), url("https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=1280") center/cover no-repeat' }}>
            <Container>
              <Badge bg="success" className="mb-3 px-3 py-2 text-white fw-bold">JUST IN</Badge>
              <h1 className="display-4 fw-bold mb-2">Fresh Stock Collection</h1>
              <p className={`lead max-w-md mx-auto fw-medium ${darkMode ? 'text-white-50' : 'text-secondary'}`}>Hand-tested elements and setups fresh on the counter.</p>
              <Button variant="success" className="fw-bold text-white px-4 py-2 mt-2" onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}>Browse New Items</Button>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* ─── 3. VALUE PROPS GRID ─── */}
      <Container className="pt-5">
        <Row className="g-4 text-center">
          <Col md={4}><div className="p-3"><h4>⚡ Fast Dispatch</h4><p className={`small ${darkMode ? 'text-white-50' : 'text-muted'}`}>Instant tracking coordinates dispatch.</p></div></Col>
          <Col md={4}><div className="p-3"><h4>🛡️ Premium Quality</h4><p className={`small ${darkMode ? 'text-white-50' : 'text-muted'}`}>Every batch checked and evaluated.</p></div></Col>
          <Col md={4}><div className="p-3"><h4>💬 24/7 Desk</h4><p className={`small ${darkMode ? 'text-white-50' : 'text-muted'}`}>Support handlers ready at any window.</p></div></Col>
        </Row>
      </Container>

      {/* ─── 4. FLASH SALE & URGENCY COUNTER ─── */}
      <Container className="my-5">
        <Card className={`p-4 border-0 rounded-3 shadow-sm ${darkMode ? 'bg-secondary bg-opacity-10 text-white' : 'bg-light text-dark'}`}>
          <Row className="align-items-center g-3">
            <Col md={6}>
              <h3 className="fw-bold text-danger mb-1">⚡ Limited Flash Sale</h3>
              <p className={`mb-0 small ${darkMode ? 'text-white-50' : 'text-muted'}`}>High-demand items tracking low stock metrics. Act fast!</p>
            </Col>
            <Col md={6} className="text-md-end">
              <span className={`fw-bold me-2 small uppercase tracking-wider ${darkMode ? 'text-white-50' : 'text-muted'}`}>Ends In:</span>
              <Badge bg="dark" className="p-2 font-monospace fs-6 text-danger me-1">{String(timeLeft.hours).padStart(2, '0')}h</Badge>
              <Badge bg="dark" className="p-2 font-monospace fs-6 text-danger me-1">{String(timeLeft.minutes).padStart(2, '0')}m</Badge>
              <Badge bg="dark" className="p-2 font-monospace fs-6 text-danger">{String(timeLeft.seconds).padStart(2, '0')}s</Badge>
            </Col>
          </Row>
          <div className="mt-3">
            <small className={`d-block mb-1 ${darkMode ? 'text-white-50' : 'text-muted'}`}>Total operational allocation claimed:</small>
            <ProgressBar now={78} variant="danger" label="78% Claimed" style={{ height: '20px' }} className="fw-bold" />
          </div>
        </Card>
      </Container>

      {/* ─── 5. INTERACTIVE FINDER QUIZ WIDGET ─── */}
      <Container className="my-5">
        <Card className={`p-4 border border-info border-opacity-25 rounded-3 ${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'}`}>
          <h4 className="fw-bold text-info mb-2">🔍 Smart Product Finder Quiz</h4>
          <p className={`small mb-4 ${darkMode ? 'text-white-50' : 'text-muted'}`}>Can't decide? Slide your budget parameters and let us map your collection coordinates instantly.</p>
          <Row className="g-3">
            <Col sm={5}>
              <Form.Label className={`small fw-semibold ${darkMode ? 'text-white-50' : 'text-muted'}`}>Max Budget Limit: <span className="text-info">${quizBudget}</span></Form.Label>
              <Form.Range min={10} max={2000} step={25} value={quizBudget} onChange={(e) => setQuizBudget(Number(e.target.value))} />
            </Col>
            <Col sm={4}>
              <Form.Label className={`small fw-semibold ${darkMode ? 'text-white-50' : 'text-muted'}`}>Target Area</Form.Label>
              <Form.Select size="sm" className={darkMode ? 'bg-secondary text-white border-secondary' : ''} value={quizCategory} onChange={(e) => setQuizCategory(e.target.value)}>
                <option value="All">Any Category</option>
                {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </Form.Select>
            </Col>
            <Col sm={3} className="d-flex align-items-end">
              <Button variant="info" size="sm" className="w-100 fw-bold py-2 text-white" onClick={applyQuizFilter}>Generate Matches</Button>
            </Col>
          </Row>
        </Card>
      </Container>

      {/* ─── 6. MAIN CATALOG BLOCK ─── */}
      <Container className="py-4" ref={catalogRef} style={{ scrollMarginTop: '140px' }}>
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-5">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "info" : "outline-secondary"}
              className={`rounded-pill px-4 transition-all ${selectedCategory === cat ? (darkMode ? 'text-dark fw-bold' : 'text-white fw-bold') : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className={`fw-bold mb-0 ${darkMode ? 'text-white' : 'text-dark'}`}>{selectedCategory === 'All' ? 'Our Catalog' : selectedCategory}</h2>
            <p className={`small ${darkMode ? 'text-white-50' : 'text-muted'}`}>Showing {displayedProducts.length} of {filteredProducts.length} items</p>
          </div>
        </div>

        <Row className="g-2 g-md-4">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => {
              const isOutOfStock = product.stock === 0;
              return (
                <Col key={product.id} xs={6} md={4} lg={3}>
                  <Card className={`h-100 hover-lift transition-all position-relative d-flex flex-column justify-content-between ${darkMode ? 'bg-secondary bg-opacity-10 border-secondary' : 'bg-light border-light'}`}>
                    {isOutOfStock && <Badge bg="danger" className="position-absolute top-0 start-0 m-2 z-3">Sold Out</Badge>}
                    
                    <div className={`d-flex align-items-center justify-content-center overflow-hidden position-relative ${darkMode ? 'bg-dark' : 'bg-white border-bottom border-light'}`} style={{ height: '160px', cursor: 'pointer' }} onClick={() => openQuickView(product)}>
                      {product.image_url ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isOutOfStock ? 0.4 : 1 }} /> : <span className="display-4 opacity-25">📦</span>}
                    </div>

                    <Card.Body className="d-flex flex-column justify-content-between p-2 p-md-3 flex-grow-1">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg={darkMode ? 'dark' : 'secondary'} className="text-white small">{product.category}</Badge>
                          <span className={`fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>${product.price}</span>
                        </div>
                        <Card.Title className={`fw-bold fs-6 mb-3 text-truncate ${darkMode ? 'text-white' : 'text-dark'}`} style={{ cursor: 'pointer' }} onClick={() => openQuickView(product)}>{product.name}</Card.Title>
                      </div>
                      <Button variant={isOutOfStock ? "outline-secondary" : (darkMode ? "outline-info" : "info")} className={`mt-auto w-100 fw-bold size-sm ${!darkMode && !isOutOfStock ? 'text-white' : ''}`} disabled={isOutOfStock} onClick={() => addToCart(product)}>
                        {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col xs={12} className="text-center py-5"><h5 className={`${darkMode ? 'text-white-50' : 'text-muted'}`}>No items match current filter criteria.</h5></Col>
          )}
        </Row>

        {/* EXPANSION TOGGLE BUTTON */}
        {filteredProducts.length > viewLimit && (
          <div className="text-center mt-5">
            <Button 
              variant={darkMode ? "info" : "outline-info"} 
              className={`px-5 py-2 rounded-pill fw-bold ${darkMode ? 'text-dark' : ''}`}
              onClick={() => setShowAllProducts(!showAllProducts)}
            >
              {showAllProducts ? 'Show Less ▲' : `Show All Products (${filteredProducts.length}) ▼`}
            </Button>
          </div>
        )}
      </Container>

      {/* ─── 7. CUSTOMER REVIEWS SLIDER ─── */}
      <Container className="my-5 py-4">
        <h3 className="text-center fw-bold mb-4">✨ Loving Customer Experiences</h3>
        <Carousel indicators={false} controls={true} className={`p-4 rounded shadow-sm text-center ${darkMode ? 'bg-secondary bg-opacity-10' : 'bg-light'}`}>
          <Carousel.Item>
            <p className="fst-italic lead">"The item arrived within two days! Incredible design attention and build stability parameters are strict."</p>
            <span className="fw-bold text-info">— Alex M. (Verified Purchase)</span>
          </Carousel.Item>
          <Carousel.Item>
            <p className="fst-italic lead">"Super high-end custom catalog options. The support grid cleared up my configuration inquiries immediately."</p>
            <span className="fw-bold text-info">— Sandra K. (Verified Purchase)</span>
          </Carousel.Item>
        </Carousel>
      </Container>

      {/* ─── 8. FAQ ACCORDION SECTION ─── */}
      <Container className="my-5 py-2">
        <h3 className="text-center fw-bold mb-4">💡 Frequently Asked Questions</h3>
        <Accordion className="shadow-sm">
          <Accordion.Item eventKey="0">
            <Accordion.Header>What are your shipment times and dispatch frames?</Accordion.Header>
            <Accordion.Body className={darkMode ? 'bg-dark text-white' : ''}>Orders enter parsing pipelines instantly and dispatch within 24-48 business hours with complete tracking links sent directly to customer contact profiles.</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Do items come backed by regular operations warranties?</Accordion.Header>
            <Accordion.Body className={darkMode ? 'bg-dark text-white' : ''}>Yes, all standard curated hardware configurations listed carry full structural protection coverage plans extending across a 12-month sequence post-delivery.</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>What is the structure for cancellation procedures?</Accordion.Header>
            <Accordion.Body className={darkMode ? 'bg-dark text-white' : ''}>If your purchase coordinates require shifting, modifications can occur seamlessly via support dashboards within a 4-hour window before fulfillment routing starts.</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>

      {/* LAYERED SAFETY FIX: QUICK VIEW MODAL */}
      {showQuickView && selectedProduct && (
        <Modal 
          show={showQuickView} 
          onHide={() => {
            setShowQuickView(false);
            setSelectedProduct(null);
          }} 
          centered 
          contentClassName={`mx-3 ${darkMode ? 'bg-dark text-white border-secondary' : 'bg-white text-dark'}`}
        >
          <Modal.Header closeButton closeVariant={darkMode ? 'white' : 'dark'} className={darkMode ? 'border-secondary' : 'border-light'}>
            <Modal.Title className="text-info fw-bold fs-5">Product Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col sm={5}>
                <div className={`rounded border overflow-hidden d-flex align-items-center justify-content-center ${darkMode ? 'bg-black border-secondary' : 'bg-light border-light'}`} style={{ height: '200px' }}>
                  {selectedProduct.image_url ? <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span className="display-4 opacity-25">📦</span>}
                </div>
              </Col>
              <Col sm={7} className="d-flex flex-column justify-content-between">
                <div>
                  <h4 className="fw-bold mb-1">{selectedProduct.name}</h4>
                  <Badge bg="secondary" className="mb-3 text-white">{selectedProduct.category}</Badge>
                  <p className={`small mb-3 ${darkMode ? 'text-white-50' : 'text-muted'}`}>Premium quality component entry curated specifically under rigorous system testing protocols.</p>
                </div>
                <div>
                  <h3 className="text-info fw-bold mb-3">${selectedProduct.price}</h3>
                  <Button 
                    variant="info" 
                    className={`w-100 fw-bold py-2 ${darkMode ? 'text-dark' : 'text-white'}`} 
                    disabled={selectedProduct.stock === 0} 
                    onClick={() => { 
                      addToCart(selectedProduct); 
                      setShowQuickView(false); 
                      setSelectedProduct(null);
                    }}
                  >
                    {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Shopping Cart'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      )}

      {/* FOOTER */}
      <footer className={`py-5 border-top text-center mt-5 ${darkMode ? 'border-secondary bg-secondary bg-opacity-10' : 'border-light bg-light'}`}>
        <p className="small mb-0">© 2026 MARVELOUS-STORE. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerHome;