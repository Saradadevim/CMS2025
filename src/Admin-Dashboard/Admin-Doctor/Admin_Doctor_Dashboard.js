import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Table, Form, Container, Row, Col, Badge } from "react-bootstrap";
import { FiEdit, FiUserX, FiUserCheck, FiEye } from "react-icons/fi";

const AdminDoctorDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]); // Store all doctors
    const [showInactive, setShowInactive] = useState(false);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const doctorRes = await axios.get("http://localhost:8000/api/doctors/", config);
                setDoctors(doctorRes.data);
                setAllDoctors(doctorRes.data); // Store all doctors
            } catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetchDoctorData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const toggleActiveStatusView = () => {
        setShowInactive(!showInactive);
    };

    const filteredDocs = allDoctors.filter((doctor) => {
        // First filter by active/inactive status
        if (showInactive) {
            if (doctor.Doc_Status) return false; // Skip active doctors when showing inactive
        } else {
            if (!doctor.Doc_Status) return false; // Skip inactive doctors when showing active
        }

        // Then apply search filter
        return (
            doctor.Doctor_Name.toLowerCase().includes(searchTerm) ||
            doctor.department_info?.Department_Name?.toLowerCase().includes(searchTerm) ||
            doctor.Consultation_Fees.toString().includes(searchTerm) ||
            doctor.Phone_Number.includes(searchTerm)
        );
    });

    const handleEditDoctor = (doctorId) => {
        navigate(`/edit-doctor/${doctorId}`);
    };

    return (
        <Container fluid className="mt-4" style={{ backgroundColor: '#ffe6e6', padding: '20px', borderRadius: '8px' }}>
            <Row className="mb-4 align-items-center">
                <Col md={2}>
                    <Button
                        variant=""
                        style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none' }}
                        as={Link}
                        to="/admin-dashboard"
                    >
                        Back
                    </Button>
                </Col>
                <Col md={3} className="text-center">
                    <h2 className="mb-0" style={{ color: '#cc0000' }}>Doctor Management</h2>
                </Col>
                <Col md={3}>
                    <Form.Control
                        type="search"
                        placeholder="Search doctors..."
                        onChange={handleSearchChange}
                        style={{ borderColor: '#ff6666', backgroundColor: '#fff0f0' }}
                    />
                </Col>
                <Col md={4} className="d-flex justify-content-end gap-2">
                    <Button 
                        style={{ backgroundColor: showInactive ? '#006600' : '#cc9900', color: 'white', border: 'none' }}
                        onClick={toggleActiveStatusView}
                    >
                        {showInactive ? "View Active Doctors" : "View Inactive Doctors"}
                    </Button>
                    <Button 
                        style={{ backgroundColor: '#cc0000', color: 'white', border: 'none' }} 
                        as={Link} 
                        to="/add-doctor"
                    >
                        Add Doctor
                    </Button>
                    <Button 
                        style={{ backgroundColor: '#990000', color: 'white', border: 'none' }} 
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive style={{ backgroundColor: '#fff0f0', borderColor: '#ff6666' }}>
                <thead style={{ backgroundColor: '#ff4d4d', color: 'white' }}>
                    <tr>
                        <th>#</th>
                        <th>Doctor Name</th>
                        <th>Department</th>
                        <th>Consultation Fees</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDocs.length > 0 ? (
                        filteredDocs.map((doctor, index) => (
                            <tr key={doctor.Doctor_ID}>
                                <td>{index + 1}</td>
                                <td>{doctor.Doctor_Name}</td>
                                <td>{doctor.department_info?.Department_Name || "N/A"}</td>
                                <td>₹{doctor.Consultation_Fees}</td>
                                <td>{doctor.Phone_Number}</td>
                                <td>
                                    <Badge bg={doctor.Doc_Status ? "success" : "danger"}>
                                        {doctor.Doc_Status ? "Active" : "Inactive"}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            style={{ backgroundColor: '#3399ff', color: 'white', border: 'none' }}
                                            size="sm"
                                            onClick={() => navigate(`/view-doctor/${doctor.Doctor_ID}`)}
                                            title="View Doctor Details"
                                        >
                                            <FiEye /> View
                                        </Button>
                                        <Button
                                            style={{ backgroundColor: '#cc0000', color: 'white', border: 'none' }}
                                            size="sm"
                                            onClick={() => handleEditDoctor(doctor.Doctor_ID)}
                                            title="Edit Doctor"
                                        >
                                            <FiEdit /> Edit
                                        </Button>
                                        {doctor.Doc_Status ? (
                                            <Button
                                                style={{ backgroundColor: '#cc9900', color: 'white', border: 'none' }}
                                                size="sm"
                                                onClick={() => navigate(`/deactivate-doctor/${doctor.Doctor_ID}`)}
                                                title="Deactivate Doctor"
                                            >
                                                <FiUserX /> Deactivate
                                            </Button>
                                        ) : (
                                            <Button
                                                style={{ backgroundColor: '#006600', color: 'white', border: 'none' }}
                                                size="sm"
                                                onClick={() => navigate(`/activate-doctor/${doctor.Doctor_ID}`)}
                                                title="Activate Doctor"
                                            >
                                                <FiUserCheck /> Activate
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center" style={{ color: '#cc0000' }}>
                                {showInactive ? "No inactive doctors found" : "No active doctors found"}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminDoctorDashboard;