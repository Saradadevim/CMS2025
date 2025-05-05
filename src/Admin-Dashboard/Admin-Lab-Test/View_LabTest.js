import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ViewLabTest = () => {
    const {id} = useParams();
    const [labtest, setLabTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLabTestData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const response = await axios.get(`http://localhost:8000/api/api/lab-tests/${id}/`, config);
                setLabTest(response.data);
                setLoading(false);
            }
            catch(error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetchLabTestData();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!labtest) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Failed to load lab test data.
                </div>
                <button 
                    className="btn btn-secondary mt-3"
                    onClick={() => navigate("/admin-labtest-dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand">Admin Dashboard</span>
                    <div className="d-flex ms-auto">
                        <button 
                            className="btn btn-outline-light me-2" 
                            onClick={() => navigate('/admin-dashboard')}
                        >
                            Back to Admin Dashboard
                        </button>
                        <button className="btn btn-light" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h4 className="mb-0">Lab Test Details</h4>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <h5 className="card-title">{labtest.Lab_Test_Name}</h5>
                                    <hr />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p className="mb-2"><strong>Test Name:</strong></p>
                                            <p className="mb-2"><strong>Price:</strong></p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-2">{labtest.Lab_Test_Name}</p>
                                            <p className="mb-2">₹{labtest.Price}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate("/admin-labtest-dashboard")}
                                    >
                                        <i className="bi bi-arrow-left"></i> Back to Dashboard
                                    </button>
                                    <Link 
                                        to={`/edit-labtest/${id}`} 
                                        className="btn btn-primary"
                                    >
                                        <i className="bi bi-pencil"></i> Edit Test
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

export default ViewLabTest;