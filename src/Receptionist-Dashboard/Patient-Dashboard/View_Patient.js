import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewPatient = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const token = localStorage.getItem('token');

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const patient_data = await axios.get(`http://localhost:8000/api/patient/${id}`, config);
                setPatient(patient_data.data);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [id]);

    const handleLogout = () => {
        localStorage.clear(); // Removes all stored data
        navigate("/");
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
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

    if (!patient) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Failed to load patient data.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Patient Details</h2>
                <div>
                    <button
                        onClick={() => navigate('/patient-dashboard')}
                        className="btn btn-secondary me-2"
                    >
                        <i className="fas fa-arrow-left me-1"></i> Back
                    </button>
                    <button onClick={handleLogout} className="btn btn-danger">
                        <i className="fas fa-sign-out-alt me-1"></i> Logout
                    </button>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-header bg-danger text-white"> {/* Changed from bg-primary to bg-danger */}
                    <h4 className="mb-0">{patient.Patient_Name}'s Profile</h4>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h5 className="text-muted">Personal Information</h5>
                                <hr className="mt-1" />
                                <div className="row mb-2">
                                    <div className="col-sm-4 fw-bold">Name:</div>
                                    <div className="col-sm-8">{patient.Patient_Name}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-4 fw-bold">Date of Birth:</div>
                                    <div className="col-sm-8">{formatDate(patient.Date_Of_Birth)}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-4 fw-bold">Age:</div>
                                    <div className="col-sm-8">{patient.Age}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-4 fw-bold">Gender:</div>
                                    <div className="col-sm-8">{patient.Gender}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h5 className="text-muted">Medical Information</h5>
                                <hr className="mt-1" />
                                <div className="row mb-2">
                                    <div className="col-sm-4 fw-bold">Blood Group:</div>
                                    <div className="col-sm-8">{patient.Blood_Group}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-4 fw-bold">Status:</div>
                                    <div className="col-sm-8">
                                        <span className={`badge ${patient.Patient_Status ? 'bg-success' : 'bg-secondary'}`}>
                                            {patient.Patient_Status ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <h5 className="text-muted">Contact Information</h5>
                                <hr className="mt-1" />
                                <div className="row mb-2">
                                    <div className="col-sm-4 fw-bold">Address:</div>
                                    <div className="col-sm-8">{patient.Address || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-end">
                    <button
                        onClick={() => navigate(`/edit-patient/${patient.Patient_ID}`)}
                        className="btn btn-light bg-light-red text-white" // Changed to light red
                        style={{ backgroundColor: '#ff6b6b' }} // Added inline style for light red
                    >
                        <i className="fas fa-edit me-1"></i> Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewPatient;