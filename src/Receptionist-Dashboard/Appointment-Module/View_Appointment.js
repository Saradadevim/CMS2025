import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewAppointment = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                const token = localStorage.getItem('token');

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const appointment_response = await axios.get(`http://localhost:8000/api/appointments/${id}`, config);
                setAppointment(appointment_response.data);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetchAppointmentData();
    }, [id]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
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

    if (!appointment) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Failed to load appointment data.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ backgroundColor: '#fff5f5', padding: '20px', borderRadius: '10px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Appointment Details</h2>
                <button 
                    onClick={handleLogout} 
                    className="btn btn-danger"
                >
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                </button>
            </div>

            <div className="card shadow">
                <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">Appointment Details</h2>
                        <button
                            className="btn btn-light"
                            onClick={() => navigate('/book-appointment')}
                        >
                            Back to Appointments
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h4 style={{ color: '#c82333' }}>Patient Information</h4>
                            <hr style={{ borderColor: '#dc3545' }} />
                            <div className="mb-3">
                                <label className="fw-bold">Patient Name:</label>
                                <p className="form-control-static">{appointment.patient_info?.Patient_Name || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                                <label className="fw-bold">Gender:</label>
                                <p className="form-control-static">{appointment.patient_info?.Gender || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                                <label className="fw-bold">Age:</label>
                                <p className="form-control-static">{appointment.patient_info?.Age || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                                <label className="fw-bold">Blood Group:</label>
                                <p className="form-control-static">{appointment.patient_info?.Blood_Group || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h4 style={{ color: '#c82333' }}>Appointment Information</h4>
                            <hr style={{ borderColor: '#dc3545' }} />
                            <div className="mb-3">
                                <label className="fw-bold">Department:</label>
                                <p className="form-control-static">{appointment.doctor_info?.department_info?.Department_Name || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                                <label className="fw-bold">Doctor:</label>
                                <p className="form-control-static">{appointment.doctor_info?.Doctor_Name || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                                <label className="fw-bold">Appointment Date:</label>
                                <p className="form-control-static">{formatDate(appointment.Appointment_Date) || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                                <label className="fw-bold">Appointment Time:</label>
                                <p className="form-control-static">{formatTime(appointment.Appointment_Time) || 'N/A'}</p>
                            </div>
                            <div className="mb-3">
                                <label className="fw-bold">Status:</label>
                                <span className={`badge ${appointment.Status === 'Scheduled' ? 'bg-primary' :
                                    appointment.Status === 'Completed' ? 'bg-success' :
                                        appointment.Status === 'Cancelled' ? 'bg-danger' : 'bg-secondary'
                                    }`}>
                                    {appointment.Status || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-end">
                    <button
                        className="btn me-2"
                        style={{ backgroundColor: '#ff6b6b', color: 'white' }}
                        onClick={() => navigate(`/edit-appointment/${appointment.Appointment_ID}/`)}
                    >
                        Edit Appointment
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/book-appointment')}
                    >
                        Back to List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewAppointment;