import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';

const ReceptionistDashboard = () => {
  const handleLogout = () => {
    console.log('User logged out');
    localStorage.clear();
    window.location.href = '/';
  };
  
  return (
    <Container fluid className="p-0 min-vh-100" style={{ backgroundColor: '#fff5f5' }}>
      {/* Header with Logout */}
      <Navbar bg="white" expand="lg" className="p-3 mb-4 shadow-sm">
        <Navbar.Brand className="fw-bold fs-4">WELCOME, Receptionist</Navbar.Brand>
        <Button
          variant="danger"
          onClick={handleLogout}
          className="ms-auto"
          size="sm"
        >
          Logout
        </Button>
      </Navbar>

      {/* Main Navigation */}
      <Container className="my-5" style={{ maxWidth: '600px' }}>
        <div className="d-grid gap-2">
          <Link to="/patient-dashboard" className="btn btn-danger py-2">
            PATIENT MANAGEMENT
          </Link>
          <Link to="/book-appointment" className="btn btn-dark py-2">
            BOOK AN APPOINTMENT
          </Link>
          <Link to="/appointment-bill-dashboard" className="btn btn-maroon py-2 text-white" style={{ backgroundColor: '#800000' }}>
            BILL GENERATION
          </Link>
        </div>
      </Container>
    </Container>
  );
};

export default ReceptionistDashboard;