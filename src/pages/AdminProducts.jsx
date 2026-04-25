import React from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge } from 'react-bootstrap';

const AdminProducts = () => {
  const products = [
    { id: 1, name: "Premium Wireless Headphones", category: "Electronics", price: "$199.99", stock: 15, status: "In Stock" },
    { id: 2, name: "Minimalist Leather Watch", category: "Accessories", price: "$125.00", stock: 0, status: "Out of Stock" },
    { id: 3, name: "Smart Home Speaker", category: "Electronics", price: "$89.00", stock: 42, status: "In Stock" },
    { id: 4, name: "Ergonomic Office Chair", category: "Furniture", price: "$350.00", stock: 8, status: "Low Stock" }
  ];

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">
        {/* Header Section */}
        <header className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-info">Product Management</h2>
            <p className="text-secondary">Manage your inventory and pricing</p>
          </div>
          <Button variant="info" className="fw-bold px-4 hover-lift">+ Add New Product</Button>
        </header>

        {/* Search and Filter Bar */}
        <Card className="bg-secondary bg-opacity-10 border-secondary mb-4 p-3">
          <Row className="g-3">
            <Col md={8}>
              <InputGroup>
                <Form.Control 
                  placeholder="Search products by name or SKU..." 
                  className="bg-dark border-secondary text-white"
                />
                <Button variant="outline-info">Search</Button>
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select className="bg-dark border-secondary text-white">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Accessories</option>
                <option>Furniture</option>
              </Form.Select>
            </Col>
          </Row>
        </Card>

        {/* Product Table */}
       <Card className="bg-secondary bg-opacity-10 border-secondary border-0 border-md-1">
  {/* Desktop Header: Hidden on mobile */}
  <div className="d-none d-md-block bg-dark py-3 px-4 border-bottom border-secondary">
    <Row className="text-secondary small fw-bold text-uppercase">
      <Col md={4}>Product</Col>
      <Col md={2}>Price</Col>
      <Col md={2}>Stock</Col>
      <Col md={2}>Status</Col>
      <Col md={2} className="text-end">Actions</Col>
    </Row>
  </div>

  {/* Table Body */}
  <div className="admin-list">
    {products.map((item) => (
      <div key={item.id} className="p-3 p-md-3 border-bottom border-secondary transition-all hover-lift-sm">
        <Row className="align-items-center g-3 g-md-0">
          
          {/* Product Name & Category */}
          <Col xs={12} md={4}>
            <div className="d-flex align-items-center">
              <div className="bg-info bg-opacity-10 rounded p-2 me-3 d-none d-sm-block">
                📦
              </div>
              <div>
                <div className="fw-bold text-white fs-5 fs-md-6 ">{item.name}</div>
                <div className="small text-info">{item.category}</div>
              </div>
            </div>
          </Col>

          {/* Price: Stacked on mobile, column on desktop */}
          <Col xs={4} md={2} className="mt-3 mt-md-0">
            <div className="small text-secondary d-md-none text-white">Price</div>
            <div className="fw-bold text-white">{item.price}</div>
          </Col>

          {/* Stock: Stacked on mobile, column on desktop */}
          <Col xs={4} md={2} className="mt-3 mt-md-0">
            <div className="small text-secondary d-md-none text-white">Stock</div>
            <div style={{color:'white'}}>{item.stock} <span className="d-md-none text-lowercase text-white">units</span></div>
          </Col>

          {/* Status */}
          <Col xs={4} md={2} className="mt-3 mt-md-0">
            <div className="small text-secondary d-md-none text-white">Status</div>
            <Badge 
              bg={item.status === 'In Stock' ? 'success' : item.status === 'Low Stock' ? 'warning' : 'danger'}
              className="bg-opacity-25"
              style={{ color: 'inherit' }}
            >
              {item.status}
            </Badge>
          </Col>

          {/* Actions: Full width on mobile */}
          <Col xs={12} md={2} className="text-md-end mt-3 mt-md-0">
            <div className="d-flex gap-2 justify-content-md-end">
              <Button variant="outline-light" size="sm" className="flex-grow-1 flex-md-grow-0 border-secondary">Edit</Button>
              <Button variant="outline-danger" size="sm" className="flex-grow-1 flex-md-grow-0">Delete</Button>
            </div>
          </Col>

        </Row>
      </div>
    ))}
  </div>
</Card>
      </Container>
    </div>
  );
};

export default AdminProducts;