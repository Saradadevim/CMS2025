import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewStaff = () => {
    const {id} = useParams();
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaffData = async() => {
            try
            {
                const token = localStorage.getItem('token');

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const staff_Res = await axios.get(`http://localhost:8000/api/staff/${id}`, config);
                setStaff(staff_Res.data);
                setLoading(false);
            }
            catch(error)
            {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetchStaffData();
    },[id]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="container mt-5" style={{ backgroundColor: '#fff5f5', minHeight: '100vh', padding: '20px' }}>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="container mt-5" style={{ backgroundColor: '#fff5f5', minHeight: '100vh', padding: '20px' }}>
                <div className="alert alert-danger" role="alert">
                    Failed to load staff data.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5" style={{ backgroundColor: '#fff5f5', minHeight: '100vh', padding: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#dc3545' }}>Staff Details</h2>
                <button 
                    className="btn btn-danger"
                    style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            
            <div className="card shadow">
                <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    <h4 className="mb-0">{staff.Full_Name}</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p><strong>Role:</strong> {staff.User?.role?.Role_Name || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Email:</strong> {staff.EMail || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p><strong>Phone Number:</strong> {staff.Phone_Number || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Date of Birth:</strong> {formatDate(staff.Date_Of_Birth)}</p>
                        </div>
                    </div>
                    
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p><strong>Age:</strong> {staff.Age || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Date of Joining:</strong> {formatDate(staff.Date_Of_Joining)}</p>
                        </div>
                    </div>
                    
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p><strong>Salary:</strong> ₹{staff.Salary || '0.00'}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Status:</strong> 
                                {staff.Staff_Status ? (
                                    <span className="badge bg-danger ms-2">Active</span>
                                ) : (
                                    <span className="badge bg-secondary ms-2">Inactive</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-end">
                    <button 
                        className="btn btn-outline-danger me-2"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    <button 
                        className="btn btn-danger"
                        style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                        onClick={() => navigate(`/edit-staff/${id}`)}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewStaff;