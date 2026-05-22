import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Spinner, Modal, Alert } from 'react-bootstrap';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  // Add Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Electronics', price: '', stock: '' });

  // Edit Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({ id: '', name: '', category: 'Electronics', price: '', stock: '' });

  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState({ id: '', name: '' });
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Fetch products ──────────────────────────────
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
      showAlertMsg('Failed to load products.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const showAlertMsg = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 4000);
  };

  // ── Add Product ─────────────────────────────────
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/products', newProduct);
      setShowAddModal(false);
      setNewProduct({ name: '', category: 'Electronics', price: '', stock: '' });
      fetchProducts();
      showAlertMsg('Product added successfully!', 'success');
    } catch (err) {
      console.error("Error adding product:", err);
      showAlertMsg('Failed to add product.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit Product ────────────────────────────────
  const handleOpenEdit = (product) => {
    setEditProduct({
      id:       product.id,
      name:     product.name,
      category: product.category,
      price:    product.price,
      stock:    product.stock
    });
    setShowEditModal(true);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/products/${editProduct.id}`, {
        name:     editProduct.name,
        category: editProduct.category,
        price:    editProduct.price,
        stock:    editProduct.stock
      });
      setShowEditModal(false);
      fetchProducts();
      showAlertMsg('Product updated successfully!', 'success');
    } catch (err) {
      console.error("Error updating product:", err);
      showAlertMsg('Failed to update product.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete Product ──────────────────────────────
  const handleOpenDelete = (product) => {
    setDeleteProduct({ id: product.id, name: product.name });
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/products/${deleteProduct.id}`);
      setShowDeleteModal(false);
      fetchProducts();
      showAlertMsg('Product deleted successfully!', 'success');
    } catch (err) {
      console.error("Error deleting product:", err);
      showAlertMsg('Failed to delete product.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  // ── Filter ──────────────────────────────────────
  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "danger" };
    if (stock < 10) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  if (loading) return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="info" />
    </div>
  );

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container className="content-fade-in">

        {/* Alert */}
        {alert.show && (
          <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
            {alert.message}
          </Alert>
        )}

        <header className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-info">Product Management</h2>
            <p className="text-secondary">Manage your inventory and pricing</p>
          </div>
          <Button variant="info" className="fw-bold px-4" onClick={() => setShowAddModal(true)}>
            + Add New Product
          </Button>
        </header>

        {/* Search and Filter */}
        <Card className="bg-secondary bg-opacity-10 border-secondary mb-4 p-3">
          <Row className="g-3">
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  placeholder="Search products by name..."
                  className="bg-dark border-secondary text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-info">Search</Button>
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                className="bg-dark border-secondary text-white"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Accessories</option>
                <option>Furniture</option>
              </Form.Select>
            </Col>
          </Row>
        </Card>

        {/* Product List */}
        <Card className="bg-secondary bg-opacity-10 border-secondary">
          <div className="d-none d-md-block bg-dark py-3 px-4 border-bottom border-secondary">
            <Row className="text-secondary small fw-bold text-uppercase">
              <Col md={4}>Product</Col>
              <Col md={2}>Price</Col>
              <Col md={2}>Stock</Col>
              <Col md={2}>Status</Col>
              <Col md={2} className="text-end">Actions</Col>
            </Row>
          </div>

          <div className="admin-list">
            {filteredProducts.map((item) => {
              const status = getStatus(item.stock);
              return (
                <div key={item.id} className="p-3 border-bottom border-secondary">
                  <Row className="align-items-center g-3 g-md-0">
                    <Col xs={12} md={4}>
                      <div className="d-flex align-items-center">
                        <div className="bg-info bg-opacity-10 rounded p-2 me-3 d-none d-sm-block">📦</div>
                        <div>
                          <div className="fw-bold text-white">{item.name}</div>
                          <div className="small text-info">{item.category}</div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={4} md={2}>
                      <div className="small text-secondary d-md-none">Price</div>
                      <div className="fw-bold text-white">${item.price}</div>
                    </Col>

                    <Col xs={4} md={2}>
                      <div className="small text-secondary d-md-none">Stock</div>
                      <div className="text-white">{item.stock} <span className="d-md-none">units</span></div>
                    </Col>

                    <Col xs={4} md={2}>
                      <div className="small text-secondary d-md-none">Status</div>
                      <Badge bg={status.color}>{status.label}</Badge>
                    </Col>

                    {/* ✅ Edit & Delete Buttons */}
                    <Col xs={12} md={2} className="text-md-end mt-3 mt-md-0">
                      <div className="d-flex gap-2 justify-content-md-end">
                        <Button
                          variant="outline-light"
                          size="sm"
                          className="flex-grow-1 flex-md-grow-0 border-secondary"
                          onClick={() => handleOpenEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="flex-grow-1 flex-md-grow-0"
                          onClick={() => handleOpenDelete(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="p-5 text-center text-secondary">No products found.</div>
            )}
          </div>
        </Card>

        {/* ── ADD PRODUCT MODAL ── */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered contentClassName="bg-dark text-white border-secondary">
          <Modal.Header closeButton closeVariant="white" className="border-secondary">
            <Modal.Title className="text-info">Add New Product</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleAddProduct}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-secondary">Product Name</Form.Label>
                <Form.Control
                  type="text" required
                  placeholder="e.g. Wireless Mouse"
                  className="bg-dark border-secondary text-white"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary">Price ($)</Form.Label>
                    <Form.Control
                      type="number" required
                      className="bg-dark border-secondary text-white"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary">Stock Amount</Form.Label>
                    <Form.Control
                      type="number" required
                      className="bg-dark border-secondary text-white"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label className="small text-secondary">Category</Form.Label>
                <Form.Select
                  className="bg-dark border-secondary text-white"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Furniture</option>
                </Form.Select>
              </Form.Group>
              <Button variant="info" type="submit" className="w-100 fw-bold py-2" disabled={saving}>
                {saving ? <><Spinner size="sm" className="me-2" />Saving...</> : 'Save to Inventory'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* ── EDIT PRODUCT MODAL ── */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered contentClassName="bg-dark text-white border-secondary">
          <Modal.Header closeButton closeVariant="white" className="border-secondary">
            <Modal.Title className="text-warning">Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleEditProduct}>
              <Form.Group className="mb-3">
                <Form.Label className="small text-secondary">Product Name</Form.Label>
                <Form.Control
                  type="text" required
                  className="bg-dark border-secondary text-white"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary">Price ($)</Form.Label>
                    <Form.Control
                      type="number" required
                      className="bg-dark border-secondary text-white"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-secondary">Stock Amount</Form.Label>
                    <Form.Control
                      type="number" required
                      className="bg-dark border-secondary text-white"
                      value={editProduct.stock}
                      onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label className="small text-secondary">Category</Form.Label>
                <Form.Select
                  className="bg-dark border-secondary text-white"
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                >
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Furniture</option>
                </Form.Select>
              </Form.Group>
              <Button variant="warning" type="submit" className="w-100 fw-bold py-2" disabled={saving}>
                {saving ? <><Spinner size="sm" className="me-2" />Updating...</> : 'Update Product'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* ── DELETE CONFIRM MODAL ── */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="bg-dark text-white border-secondary">
          <Modal.Header closeButton closeVariant="white" className="border-secondary">
            <Modal.Title className="text-danger">Delete Product</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center p-4">
            <div style={{ fontSize: '3rem' }}>🗑️</div>
            <h5 className="mt-3">Are you sure?</h5>
            <p className="text-secondary">
              You are about to delete <span className="text-white fw-bold">"{deleteProduct.name}"</span>. This action cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer className="border-secondary">
            <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteProduct} disabled={deleting}>
              {deleting ? <><Spinner size="sm" className="me-2" />Deleting...</> : 'Yes, Delete'}
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </div>
  );
};

export default AdminProducts;