import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { Link, useOutletContext } from 'react-router-dom'; // Grouped clean router imports together

const CartPage = () => {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
  
  // CHANGED: Hooked directly into the layout's root context instead of local state
  const { darkMode } = useOutletContext();

  return (
    <div className={`${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'} min-vh-100 py-5 transition-all`}>
      <Container>
        {/* Header Space */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Your Shopping Cart</h2>
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-5">
            <h4 className={darkMode ? 'text-white-50' : 'text-muted'}>Your cart is empty</h4>
            <Button as={Link} to="/" variant="info" className={`mt-3 fw-bold ${!darkMode ? 'text-white' : 'text-dark'}`}>Go Shopping</Button>
          </div>
        ) : (
          <Row className="g-4">
            {/* Cart Items List */}
            <Col lg={8}>
              <Card className={`border ${darkMode ? 'bg-secondary bg-opacity-10 border-secondary' : 'bg-light border-light shadow-sm'}`}>
                <ListGroup variant="flush">
                  {cart.map((item) => (
                    <ListGroup.Item 
                      key={item.id} 
                      className={`bg-transparent py-3 ${darkMode ? 'border-secondary text-white' : 'border-light text-dark'}`}
                    >
                      <Row className="align-items-center g-3">
                        <Col xs={12} md={6}>
                          <h6 className="mb-0 fw-bold">{item.name}</h6>
                          <small className={darkMode ? 'text-white-50' : 'text-muted'}>{item.category}</small>
                        </Col>
                        <Col xs={4} md={2} className="text-md-center">
                          <span className="small text-muted d-md-none">Qty: </span>{item.quantity}
                        </Col>
                        <Col xs={4} md={2} className="fw-bold text-info">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Col>
                        <Col xs={4} md={2} className="text-end">
                          <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
            
            {/* Summary Panel */}
            <Col lg={4}>
              <Card className={`p-3 border ${darkMode ? 'bg-secondary bg-opacity-10 border-secondary' : 'bg-light border-light shadow-sm'}`}>
                <h5 className={`fw-bold mb-3 ${darkMode ? 'text-white' : 'text-dark'}`}>Order Summary</h5>
                
                {/* Subtotal row with dynamic explicit text styling */}
                <div className={`d-flex justify-content-between mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>
                  <span>Subtotal</span>
                  <span className="fw-semibold">${getCartTotal().toFixed(2)}</span>
                </div>
                
                {/* Shipping row with dynamic explicit text styling */}
                <div className={`d-flex justify-content-between mb-4 ${darkMode ? 'text-white' : 'text-dark'}`}>
                  <span>Shipping</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>
                
                <hr className={darkMode ? 'border-secondary' : 'border-light'} />
                
                {/* Total row with dynamic explicit text styling */}
                <div className={`d-flex justify-content-between mb-4 fs-5 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                  <span>Total</span>
                  <span className="text-info">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <Button as={Link} to="/checkout" variant="info" className={`w-100 fw-bold py-2 ${!darkMode ? 'text-white' : 'text-dark'}`}>
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="link" 
                  className={`w-100 mt-2 text-decoration-none small ${darkMode ? 'text-white-50' : 'text-muted'}`} 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CartPage;