import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewDoctor = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const doctor_res = await axios.get(`http://localhost:8000/api/doctors/${id}`, config);
                setDoctor(doctor_res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetchDoctorData();
    }, [id]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="container mt-5" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh' }}>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" style={{ color: '#DA291C' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="container mt-5" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh' }}>
                <div className="alert" style={{ backgroundColor: '#F0EAD6', color: '#8B8589', borderColor: '#DA291C' }} role="alert">
                    Failed to load doctor data.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh', padding: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#8B8589' }}>Doctor Details</h2>
                <button 
                    style={{ 
                        backgroundColor: '#DA291C', 
                        color: '#D1C0A8', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '4px' 
                    }} 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            
            <div className="card" style={{ backgroundColor: '#F0EAD6', borderColor: '#8B8589', borderRadius: '8px' }}>
                <div className="card-header" style={{ backgroundColor: '#DA291C', color: '#D1C0A8' }}>
                    <h4 className="mb-0">Dr. {doctor.Doctor_Name}</h4>
                </div>
                <div className="card-body" style={{ color: '#8B8589' }}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p><strong>Department:</strong> {doctor.department_info?.Department_Name || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Role:</strong> {doctor.user_details_info?.role?.Role_Name || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p><strong>Email:</strong> {doctor.Email || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Phone Number:</strong> {doctor.Phone_Number || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p><strong>Date of Birth:</strong> {formatDate(doctor.Date_Of_Birth)}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Date of Joining:</strong> {formatDate(doctor.Date_Of_Joining)}</p>
                        </div>
                    </div>
                    
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p><strong>Salary:</strong> ₹{doctor.Doctor_Salary || '0.00'}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Consultation Fees:</strong> ₹{doctor.Consultation_Fees || '0.00'}</p>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Status:</strong> 
                                {doctor.Doc_Status ? (
                                    <span className="badge ms-2" style={{ backgroundColor: '#006600', color: '#D1C0A8' }}>Active</span>
                                ) : (
                                    <span className="badge ms-2" style={{ backgroundColor: '#DA291C', color: '#D1C0A8' }}>Inactive</span>
                                )}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Department Status:</strong> 
                                {doctor.department_info?.Department_Status ? (
                                    <span className="badge ms-2" style={{ backgroundColor: '#006600', color: '#D1C0A8' }}>Active</span>
                                ) : (
                                    <span className="badge ms-2" style={{ backgroundColor: '#DA291C', color: '#D1C0A8' }}>Inactive</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-end" style={{ backgroundColor: '#F0EAD6', borderTopColor: '#8B8589' }}>
                    <button 
                        style={{ 
                            backgroundColor: '#8B8589', 
                            color: '#D1C0A8', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '4px', 
                            marginRight: '10px' 
                        }}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    <button 
                        style={{ 
                            backgroundColor: '#DA291C', 
                            color: '#D1C0A8', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '4px' 
                        }}
                        onClick={() => navigate(`/edit-doctor/${id}`)}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewDoctor;