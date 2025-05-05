import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ViewMedicine = () => {
    const {id} = useParams();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMedicineData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const medicine_Res = await axios.get(`http://localhost:8000/api/api/medicines/${id}/`, config);
                setMedicine(medicine_Res.data);
                setLoading(false);
            }
            catch(error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetchMedicineData();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="container mt-5" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh', padding: '20px' }}>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" style={{ color: '#DA291C' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!medicine) {
        return (
            <div className="container mt-5" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh', padding: '20px' }}>
                <div className="alert" style={{ backgroundColor: '#F0EAD6', color: '#8B8589', borderColor: '#DA291C' }} role="alert">
                    Failed to load medicine data.
                </div>
                <button 
                    style={{ 
                        backgroundColor: '#8B8589', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                    onClick={() => navigate("/admin-medicine-dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh', padding: '20px' }}>
            <nav className="navbar navbar-expand-lg mb-4" style={{ backgroundColor: '#DA291C' }}>
                <div className="container-fluid">
                    <Link className="navbar-brand" style={{ color: '#D1C0A8' }} to="/admin-dashboard">Medicine Management System</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon" style={{ backgroundColor: '#D1C0A8' }}></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: '#D1C0A8' }} to="/admin-medicine-dashboard">Back to Dashboard</Link>
                            </li>
                        </ul>
                        <button 
                            style={{ 
                                backgroundColor: '#DA291C', 
                                color: 'white', 
                                border: '2px solid #D1C0A8', 
                                padding: '8px 16px', 
                                borderRadius: '4px',
                                fontWeight: 'bold'
                            }} 
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card" style={{ backgroundColor: '#F0EAD6', borderColor: '#8B8589', borderRadius: '8px' }}>
                            <div className="card-header" style={{ backgroundColor: '#DA291C', color: '#D1C0A8' }}>
                                <h3 className="mb-0">Medicine Details</h3>
                            </div>
                            <div className="card-body" style={{ color: '#8B8589' }}>
                                <div className="row mb-4">
                                    <div className="col-md-4 text-center">
                                        <div style={{ backgroundColor: '#D1C0A8', padding: '20px', borderRadius: '8px' }}>
                                            <i className="bi bi-capsule-pill fs-1" style={{ color: '#DA291C' }}></i>
                                            <h5 className="mt-3" style={{ color: '#8B8589' }}>{medicine.Medicine_Name}</h5>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="table-responsive">
                                            <table className="table" style={{ backgroundColor: '#F0EAD6', borderColor: '#8B8589' }}>
                                                <tbody style={{ color: '#8B8589' }}>
                                                    <tr>
                                                        <th className="w-25" style={{ backgroundColor: '#D1C0A8', borderColor: '#8B8589' }}>Medicine Name</th>
                                                        <td style={{ borderColor: '#8B8589' }}>{medicine.Medicine_Name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#D1C0A8', borderColor: '#8B8589' }}>Generic Name</th>
                                                        <td style={{ borderColor: '#8B8589' }}>{medicine.Generic_Name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#D1C0A8', borderColor: '#8B8589' }}>Manufacturer</th>
                                                        <td style={{ borderColor: '#8B8589' }}>{medicine.Company_Name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#D1C0A8', borderColor: '#8B8589' }}>Price</th>
                                                        <td style={{ borderColor: '#8B8589' }}>₹{medicine.Price_Per_Unit}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ backgroundColor: '#D1C0A8', borderColor: '#8B8589' }}>Dosage</th>
                                                        <td style={{ borderColor: '#8B8589' }}>{medicine.Dosage}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button 
                                        style={{ 
                                            backgroundColor: '#8B8589', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '8px 16px', 
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}
                                        onClick={() => navigate("/admin-medicine-dashboard")}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Dashboard
                                    </button>
                                    <Link
                                        to={`/edit-medicine/${medicine.Medicine_ID}`}
                                        style={{ 
                                            backgroundColor: '#DA291C', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '8px 16px', 
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i>
                                        Edit Medicine
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewMedicine;