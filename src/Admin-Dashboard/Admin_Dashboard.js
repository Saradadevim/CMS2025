import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem("token");
    localStorage.removeItem("Role");
    window.location.href = '/';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'staff':
        return <StaffManagement navigate={navigate} />;
      case 'doctor':
        return <DoctorManagement />;
      case 'medicine':
        return <MedicineManagement />;
      case 'labtest':
        return <LabTestManagement />;
      default:
        return <StaffManagement navigate={navigate} />;
    }
  };

  return (
    <div className="admin-dashboard" style={{ backgroundColor: '#fff5f5' }}>
      {/* Header/Navbar */}
      <Navbar bg="danger" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand style={{ fontWeight: 'bold' }}>Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {/* Welcome Banner */}
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h2 style={{ color: '#dc3545' }}>WELCOME, ADMIN</h2>
            </div>
          </Col>
        </Row>

        {/* Main Content */}
        <Row>
          {/* Sidebar Navigation */}
          <Col md={3}>
            <div className="d-grid gap-3">
              <Button
                variant={activeTab === 'staff' ? 'danger' : 'outline-danger'}
                onClick={() => {
                  setActiveTab('staff');
                  navigate('/admin-staff-dashboard');
                }}
                style={{ fontWeight: 'bold' }}
              >
                STAFF MANAGEMENT
              </Button>
              <Button
                variant={activeTab === 'doctor' ? 'danger' : 'outline-danger'}
                onClick={() => {
                  setActiveTab('doctor');
                  navigate('/admin-doctor-dashboard')
                }}
                style={{ fontWeight: 'bold' }}
              >
                DOCTOR MANAGEMENT
              </Button>
              <Button
                variant={activeTab === 'medicine' ? 'danger' : 'outline-danger'}
                onClick={() => {
                  setActiveTab('medicine');
                  navigate('/admin-medicine-dashboard')
                }}
                style={{ fontWeight: 'bold' }}
              >
                MEDICINE MANAGEMENT
              </Button>
              <Button
                variant={activeTab === 'labtest' ? 'danger' : 'outline-danger'}
                onClick={() => {
                  setActiveTab('labtest');
                  navigate('/admin-labtest-dashboard')
                }}
                style={{ fontWeight: 'bold' }}
              >
                LAB TEST MANAGEMENT
              </Button>
            </div>
          </Col>

          {/* Main Content Area */}
          <Col md={9}>
            {renderTabContent()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// StaffManagement with "Add Staff" button
const StaffManagement = ({ navigate }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3 style={{ color: '#dc3545' }}>Staff Management</h3>
    </div>
    <p>This is where you would manage staff members.</p>
  </div>
);

const DoctorManagement = () => (
  <div>
    <h3 style={{ color: '#dc3545' }}>Doctor Management</h3>
    <p>This is where you would manage doctors.</p>
  </div>
);

const MedicineManagement = () => (
  <div>
    <h3 style={{ color: '#dc3545' }}>Medicine Management</h3>
    <p>This is where you would manage medicines.</p>
  </div>
);

const LabTestManagement = () => (
  <div>
    <h3 style={{ color: '#dc3545' }}>Lab Test Management</h3>
    <p>This is where you would manage lab tests.</p>
  </div>
);

export default AdminDashboard;