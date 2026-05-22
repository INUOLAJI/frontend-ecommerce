import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();

  return (
    <div className="bg-dark text-white min-vh-100 py-5">
      <Container>
        <h2 className="fw-bold text-info mb-4">Your Shopping Cart</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-secondary">Your cart is empty</h4>
            <Button as={Link} to="/" variant="info" className="mt-3 fw-bold">Go Shopping</Button>
          </div>
        ) : (
          <Row>
            <Col lg={8}>
              <Card className="bg-secondary bg-opacity-10 border-secondary">
                <ListGroup variant="flush">
                  {cart.map((item) => (
                    <ListGroup.Item key={item.id} className="bg-transparent border-secondary text-white py-3">
                      <Row className="align-items-center">
                        <Col md={6}>
                          <h6 className="mb-0 fw-bold">{item.name}</h6>
                          <small className="text-secondary">{item.category}</small>
                        </Col>
                        <Col md={2} className="text-center">
                          qty: {item.quantity}
                        </Col>
                        <Col md={2} className="fw-bold text-info">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Col>
                        <Col md={2} className="text-end">
                          <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="bg-secondary bg-opacity-10 border-secondary p-3">
                <h5 className="fw-bold mb-3 text-white">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2 text-white">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4 text-white">
                  <span>Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <hr className="border-secondary" />
                <div className="d-flex justify-content-between mb-4 fs-5 fw-bold text-white">
                  <span>Total</span>
                  <span className="text-info">${getCartTotal().toFixed(2)}</span>
                </div>
                <Button as={Link} to="/checkout" variant="info" >Proceed to Checkout</Button>
                <Button variant="link" className="w-100 text-secondary mt-2" onClick={clearCart}>Clear Cart</Button>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CartPage;