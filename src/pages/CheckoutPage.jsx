import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom'; // Grouped clean router imports together

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  // CHANGED: Removed local state assignment and connected with root theme context
  const { darkMode } = useOutletContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Prepare the Order Data for the Database
    const orderData = {
      customer_name: formData.name,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.zip}`,
      total_amount: getCartTotal(),
      items: cart,
      status: 'Pending'
    };

    try {
      // 2. Save to your Supabase Database first
      await axios.post('https://backend-ecommerce-i0mn.onrender.com/api/orders', orderData);

      // 3. Construct the WhatsApp Message
      const phoneNumber = "2348165885581"; 
      
      let message = `*NEW ORDER - MARVELOUS-STORE*%0A%0A`;
      message += `*Customer:* ${formData.name}%0A`;
      message += `*Email:* ${formData.email}%0A`;
      message += `*Address:* ${orderData.address}%0A%0A`;
      message += `*Items:*%0A`;
      
      cart.forEach(item => {
        message += `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}%0A`;
      });
      
      message += `%0A*TOTAL AMOUNT: $${getCartTotal().toFixed(2)}*%0A%0A`;
      message += `Please confirm my order!`;

      // 4. Redirect URL Construction
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      
      alert("Order recorded! Redirecting to WhatsApp to complete payment...");
      
      // 5. Clear the shopping cart context
      clearCart();
      
      // 6. CRITICAL: Replace current history entry with Home Page before redirecting
      // This ensures hitting 'Back' from WhatsApp drops the user straight onto the Home page.
      navigate('/', { replace: true }); 

      // 7. Redirect the current window tab directly to WhatsApp
      window.location.href = whatsappUrl;

    } catch (err) {
      setError("Failed to process order. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'} min-vh-100 py-5 transition-all`}>
      <Container>
        {/* Header Space */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Checkout</h2>
          {/* Note: The physical switch is removed here because changing the theme midway inside checkout is an anti-pattern. 
              The application will automatically follow the active mode selected globally on the Home layout screen. */}
          <div className="py-2 px-3 rounded-pill border bg-secondary bg-opacity-10">
            <span className="small fw-semibold">{darkMode ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}</span>
          </div>
        </div>

        <Row className="g-4">
          {/* Shipping Form Column */}
          <Col lg={7}>
            <Card className={`p-4 border ${darkMode ? 'bg-secondary bg-opacity-10 border-secondary' : 'bg-light border-light shadow-sm'}`}>
              <h5 className={`mb-4 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Shipping Information</h5>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className={`fw-semibold small ${darkMode ? 'text-white' : 'text-dark'}`}>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    className={`shadow-none ${darkMode ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className={`fw-semibold small ${darkMode ? 'text-white' : 'text-dark'}`}>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    required 
                    className={`shadow-none ${darkMode ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className={`fw-semibold small ${darkMode ? 'text-white' : 'text-dark'}`}>Address</Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    className={`shadow-none ${darkMode ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={`fw-semibold small ${darkMode ? 'text-white' : 'text-dark'}`}>City</Form.Label>
                      <Form.Control 
                        type="text" 
                        required 
                        className={`shadow-none ${darkMode ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className={`fw-semibold small ${darkMode ? 'text-white' : 'text-dark'}`}>Zip Code</Form.Label>
                      <Form.Control 
                        type="text" 
                        required 
                        className={`shadow-none ${darkMode ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-light'}`}
                        onChange={(e) => setFormData({...formData, zip: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="info" type="submit" className={`w-100 fw-bold mt-3 py-3 ${!darkMode ? 'text-white' : 'text-dark'}`} disabled={loading}>
                  {loading ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
                </Button>
              </Form>
            </Card>
          </Col>

          {/* Order Summary Column */}
          <Col lg={5}>
            <Card className={`border ${darkMode ? 'bg-secondary bg-opacity-10 border-secondary' : 'bg-light border-light shadow-sm'}`}>
              <Card.Header className={`bg-transparent py-3 ${darkMode ? 'border-secondary' : 'border-light'}`}>
                <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Order Summary</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {cart.map(item => (
                  <ListGroup.Item 
                    key={item.id} 
                    className={`bg-transparent d-flex justify-content-between align-items-center py-3 ${darkMode ? 'text-white border-secondary' : 'text-dark border-light'}`}
                  >
                    <div>
                      <div className="fw-bold">{item.name}</div>
                      <small className={darkMode ? 'text-white-50' : 'text-muted'}>Qty: {item.quantity}</small>
                    </div>
                    <span className="fw-bold text-info">${(item.price * item.quantity).toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
                
                <ListGroup.Item className={`bg-transparent pt-4 pb-2 ${darkMode ? 'border-secondary' : 'border-light'}`}>
                  <div className={`d-flex justify-content-between mb-2 small ${darkMode ? 'text-white' : 'text-dark'}`}>
                    <span>Subtotal</span>
                    <span className="fw-semibold">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className={`d-flex justify-content-between mb-2 small ${darkMode ? 'text-white' : 'text-dark'}`}>
                    <span>Shipping</span>
                    <span className="text-success fw-bold">FREE</span>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item className="bg-transparent py-3 border-0">
                  <div className={`d-flex justify-content-between fs-5 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                    <span>Total</span>
                    <span className="text-info">${getCartTotal().toFixed(2)}</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckoutPage;