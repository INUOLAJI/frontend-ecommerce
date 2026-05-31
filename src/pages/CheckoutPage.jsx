import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
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
    const phoneNumber = "1234567890"; // 👈 REPLACE WITH YOUR PHONE NUMBER (include country code, no + or 00)
    
    let message = `*NEW ORDER - PRO-SHOP*%0A%0A`;
    message += `*Customer:* ${formData.name}%0A`;
    message += `*Email:* ${formData.email}%0A`;
    message += `*Address:* ${orderData.address}%0A%0A`;
    message += `*Items:*%0A`;
    
    cart.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    
    message += `%0A*TOTAL AMOUNT: $${getCartTotal().toFixed(2)}*%0A%0A`;
    message += `Please confirm my order!`;

    // 4. Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${2348165885581}?text=${message}`;
    
    alert("Order recorded! Redirecting to WhatsApp to complete payment...");
    
    clearCart();
    window.location.href = whatsappUrl; // This opens WhatsApp

  } catch (err) {
    setError("Failed to process order. Please try again.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-dark text-white min-vh-100 py-5">
      <Container>
        <h2 className="fw-bold text-info mb-4 text-white">Checkout</h2>
        <Row className="g-4">
          {/* Shipping Form */}
          <Col lg={7}>
            <Card className="bg-secondary bg-opacity-10 border-secondary p-4">
              <h5 className="mb-4 text-white">Shipping Information</h5>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 text-white">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" required className="bg-dark text-white border-secondary"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-3 text-white">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" required className="bg-dark text-white border-secondary"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-3 text-white">
                  <Form.Label>Address</Form.Label>
                  <Form.Control 
                    type="text" required className="bg-dark text-white border-secondary"
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3 text-white">
                      <Form.Label>City</Form.Label>
                      <Form.Control 
                        type="text" required className="bg-dark text-white border-secondary"
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3 text-white">
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control 
                        type="text" required className="bg-dark text-white border-secondary"
                        onChange={(e) => setFormData({...formData, zip: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="info" type="submit" className="w-100 fw-bold mt-3 py-3" disabled={loading}>
                  {loading ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
                </Button>
              </Form>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={5}>
            <Card className="bg-secondary bg-opacity-10 border-secondary">
              <Card.Header className="bg-transparent border-secondary py-3">
                <h5 className="mb-0 text-white">Order Summary</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {cart.map(item => (
                  <ListGroup.Item key={item.id} className="bg-transparent text-white border-secondary d-flex justify-content-between">
                    <div>
                      <div className="fw-bold">{item.name}</div>
                      <small className="text-secondary">Qty: {item.quantity}</small>
                    </div>
                    <span className="text-info">${(item.price * item.quantity).toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="bg-transparent text-white border-secondary pt-4">
                  <div className="d-flex justify-content-between fs-5 fw-bold">
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