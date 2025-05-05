import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';

const Pharmacist_Dashboard = () => {
    const handleLogout = () => {
        console.log('User logged out');
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <Container fluid className="p-0 min-vh-100">
            <style>
                {`
                    .custom-container {
                        background-color: #F0EAD6; /* Eggshell White */
                    }
                    .custom-navbar {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .custom-brand {
                        color: #DA2C43; /* Jelly Bean Red */
                        font-weight: bold;
                        font-size: 1.5rem;
                    }
                    .custom-btn-logout {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-logout:hover {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589;
                    }
                    .custom-btn-primary {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589;
                    }
                    .custom-btn-primary:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-success {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                        border-color: #D1BEA8;
                    }
                    .custom-btn-success:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                `}
            </style>

            <Container fluid className="custom-container p-0 min-vh-100">
                {/* Header with Logout */}
                <Navbar bg="white" expand="lg" className="custom-navbar p-3 mb-4">
                    <Navbar.Brand className="custom-brand">WELCOME, PHARMACIST</Navbar.Brand>
                    <Button
                        variant="outline-danger"
                        onClick={handleLogout}
                        className="ms-auto custom-btn-logout"
                        size="sm"
                    >
                        Logout
                    </Button>
                </Navbar>

                {/* Main Navigation */}
                <Container className="my-5" style={{ maxWidth: '600px' }}>
                    <div className="d-grid gap-2">
                        <Link to="/med-stock-management" className="btn custom-btn-primary py-2">
                            MEDICINE STOCK MANAGEMENT
                        </Link>
                        <Link to="/pharmacist-billing" className="btn custom-btn-success py-2">
                            PHARMACIST BILLING
                        </Link>
                    </div>
                </Container>
            </Container>
        </Container>
    );
};

export default Pharmacist_Dashboard;