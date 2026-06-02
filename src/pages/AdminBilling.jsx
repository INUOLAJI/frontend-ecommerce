import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // CHANGED: Pointing to your main live orders history route
        const res = await axios.get('https://backend-ecommerce-i0mn.onrender.com/api/orders');
        setInvoices(res.data);
      } catch (err) {
        console.error("Error fetching live order history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // --- MODERN PDF GENERATOR FUNCTION ---
  const downloadPDF = (invoice) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Handle relational user data object setups if present
    const customerName =
      invoice.customer_name ||
      invoice.customerName ||
      invoice.user_name ||
      invoice.name ||
      (invoice.user && (invoice.user.name || invoice.user.username)) ||
      "Guest Customer";

    // Format dates safely
    const receiptDate = invoice.date 
      ? new Date(invoice.date).toLocaleDateString() 
      : invoice.createdAt 
      ? new Date(invoice.createdAt).toLocaleDateString() 
      : new Date().toLocaleDateString();

    // Dig deep into order items arrays to calculate true subtotal
    const orderItems = invoice.items || invoice.orderItems || [];
    
    const subtotal = orderItems.length > 0
      ? orderItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0)
      : Number(invoice.amount || invoice.totalPrice || invoice.total || 0);

    const tax = invoice.taxPrice ? Number(invoice.taxPrice) : subtotal * 0.075;
    const discount = Number(invoice.discount || 0);
    const total = Number(invoice.totalPrice || invoice.total || invoice.amount || (subtotal + tax - discount));

    // =========================
    // HEADER
    // =========================
    doc.setFillColor(13, 202, 240);
    doc.rect(0, 0, 210, 30, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("PRO-SHOP", 14, 18);

    doc.setFontSize(10);
    doc.text("Modern Retail Receipt", 14, 25);

    doc.setFontSize(18);
    doc.text("RECEIPT", 196, 18, { align: "right" });

    // =========================
    // RECEIPT DETAILS
    // =========================
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Clean handling of different ID variations (_id from MongoDB/Postgres strings)
    const displayId = invoice.id || invoice._id || "N/A";
    doc.text(`Receipt No: #${displayId}`, 14, 40);
    doc.text(`Date: ${receiptDate}`, 14, 46);

    // =========================
    // CUSTOMER CARD
    // =========================
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(14, 55, 85, 25, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("CUSTOMER", 18, 64);

    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.text(customerName.length > 28 ? customerName.substring(0, 25) + "..." : customerName, 18, 72);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const orderStatus = invoice.isPaid ? "Paid" : invoice.status || "Paid";
    doc.text(`Status: ${orderStatus}`, 18, 78);

    // =========================
    // PAYMENT INFO
    // =========================
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(110, 55, 86, 25, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("PAYMENT", 114, 64);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(33, 37, 41);
    doc.text(invoice.paymentMethod || invoice.payment_method || "Card Payment", 114, 72);
    doc.text(`Transaction: ${invoice.paymentResult?.id || displayId}`, 114, 78);

    // =========================
    // PRODUCTS TABLE
    // =========================
    const tableRows = [];

    if (orderItems.length > 0) {
      orderItems.forEach((item) => {
        const itemPrice = Number(item.price || 0);
        const itemQty = Number(item.quantity || item.qty || 1);
        tableRows.push([
          item.name || item.product_name || item.title || "Product Selection",
          itemQty,
          `$${itemPrice.toFixed(2)}`,
          `$${(itemPrice * itemQty).toFixed(2)}`,
        ]);
      });
    } else {
      tableRows.push([
        "Store Purchase Selection",
        1,
        `$${subtotal.toFixed(2)}`,
        `$${subtotal.toFixed(2)}`,
      ]);
    }

    autoTable(doc, {
      startY: 90,
      head: [["Product", "Qty", "Price", "Total"]],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [33, 37, 41],
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: "center", cellWidth: 15 },
        2: { halign: "right", cellWidth: 25 },
        3: { halign: "right", cellWidth: 25 },
      },
    });

    // =========================
    // TOTALS CARD
    // =========================
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFillColor(248, 249, 250);
    doc.roundedRect(120, finalY, 76, 45, 3, 3, "F");

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.setFont("helvetica", "normal");

    doc.text("Subtotal", 126, finalY + 10);
    doc.text(`$${subtotal.toFixed(2)}`, 190, finalY + 10, { align: "right" });

    doc.text("Tax", 126, finalY + 18);
    doc.text(`$${tax.toFixed(2)}`, 190, finalY + 18, { align: "right" });

    doc.text("Discount", 126, finalY + 26);
    doc.text(`-$${discount.toFixed(2)}`, 190, finalY + 26, { align: "right" });

    doc.setDrawColor(220);
    doc.line(126, finalY + 31, 190, finalY + 31);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(13, 202, 240);

    doc.text("TOTAL", 126, finalY + 40);
    doc.text(`$${total.toFixed(2)}`, 190, finalY + 40, { align: "right" });

    // =========================
    // FOOTER
    // =========================
    const footerY = Math.max(finalY + 60, 260); // Keeps layout safe from clipping lines

    doc.setDrawColor(220);
    doc.line(14, footerY, 196, footerY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120);

    doc.text("Thank you for shopping with PRO-SHOP", 105, footerY + 7, { align: "center" });
    doc.text("support@proshop.com | +234 800 123 4567", 105, footerY + 13, { align: "center" });
    doc.text("Please retain this receipt for returns and warranty claims.", 105, footerY + 19, { align: "center" });

    doc.save(`Receipt_${displayId}.pdf`);
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
            {invoices.map((inv) => {
              const displayId = inv.id || inv._id || "N/A";
              const customerName =
                inv.customer_name ||
                inv.customerName ||
                inv.user_name ||
                inv.name ||
                (inv.user && (inv.user.name || inv.user.username)) ||
                "Guest Customer";
              
              const displayDate = inv.date 
                ? new Date(inv.date).toLocaleDateString() 
                : inv.createdAt 
                ? new Date(inv.createdAt).toLocaleDateString() 
                : "Recent";

              const orderItems = inv.items || inv.orderItems || [];
              const displayTotal = inv.totalPrice || inv.total || inv.amount || 
                (orderItems.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0));

              return (
                <div key={displayId} className="p-3 mb-2 bg-dark rounded border border-secondary">
                  <Row className="align-items-center">
                    <Col md={2} className="fw-bold text-info text-truncate">{displayId}</Col>
                    <Col md={3}>
                      <div className="small text-secondary">Customer</div>
                      <div className="fw-semibold text-truncate">{customerName}</div>
                    </Col>
                    <Col md={2}>{displayDate}</Col>
                    <Col md={2} className="fw-bold">
                      ${Number(displayTotal).toFixed(2)}
                    </Col>
                    <Col md={1}>
                      <Badge bg={inv.isPaid || inv.status === 'Paid' ? "success" : "warning"} className="bg-opacity-10 text-capitalize">
                        {inv.isPaid ? "Paid" : inv.status || 'Paid'}
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
              );
            })}
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