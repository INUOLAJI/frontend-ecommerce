import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import it as a function

const AdminBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/billing/invoices');
        setInvoices(res.data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // --- PDF GENERATOR FUNCTION ---
  const downloadPDF = (invoice) => {
    const doc = new jsPDF();

    // Add Logo / Brand
    doc.setFontSize(22);
    doc.setTextColor(13, 202, 240); // Your Info Color
    doc.text("PRO-SHOP", 14, 20);

    // Add Invoice Metadata
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Invoice Number: ${invoice.id}`, 14, 30);
    doc.text(`Date: ${invoice.date}`, 14, 37);
    doc.text(`Status: PAID`, 14, 44);

    // Table Header
    const tableColumn = ["Description", "Quantity", "Price", "Total"];
    const tableRows = [
    ["Store Purchase", "1", invoice.amount, invoice.amount]
  ];

    // Since we are mocking items for the demo, let's add a row
    // In a real app, you'd pass order.items into this function
    const rowData = [
      "Store Purchase",
      "1",
      invoice.amount,
      invoice.amount
    ];
    tableRows.push(rowData);

    // Generate Table
   autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    theme: 'grid',
    headStyles: { fillColor: [13, 202, 240] },
  });

    // Final Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Total Amount: ${invoice.amount}`, 14, finalY);

    // Footer
    doc.setFontSize(14);
    doc.setTextColor(150);
    // doc.text("Thank you for your business!", 14, finalY + 20);
    doc.text(`Total Amount: ${invoice.amount}`, 14, finalY);
    doc.text("Thank you for your Patronage!", 14, finalY + 15);

    // Download the file
    doc.save(`${invoice.id}.pdf`);
  };

  if (loading) return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="info" />
    </div>
  );

  return (
    <div className="bg-dark text-white min-vh-100 py-4">
      <Container>
        <header className="mb-4">
          <h2 className="fw-bold text-info">Billing & Invoices</h2>
          <p className="text-secondary">Connected to live order history</p>
        </header>

        <Card className="bg-secondary bg-opacity-10 border-secondary text-white">
          <Card.Header className="bg-transparent border-secondary py-3">
            <h5 className="mb-0">Invoice History</h5>
          </Card.Header>
          <div className="admin-list p-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-3 mb-2 bg-dark rounded border border-secondary">
                <Row className="align-items-center">
                  <Col md={2} className="fw-bold text-info">{inv.id}</Col>
                  <Col md={3}>{inv.date}</Col>
                  <Col md={2} className="fw-bold">{inv.amount}</Col>
                  <Col md={3}>
                    <Badge bg="success" className="bg-opacity-10 text-success border border-success">
                      {inv.status}
                    </Badge>
                  </Col>
                  <Col md={2} className="text-end">
                    <Button 
                      variant="outline-info" 
                      size="sm" 
                      onClick={() => downloadPDF(inv)}
                    >
                      Download PDF
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
            {invoices.length === 0 && (
                <div className="text-center p-4 text-secondary">No finalized orders found yet.</div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AdminBilling;