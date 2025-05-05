import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PrintAppointment = () => {
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
        <div className="container mt-5">
            <div className="mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/book-appointment')}>
                    &larr; Back
                </button>
            </div>

            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Appointment Details</h4>
                    <button className="btn btn-light btn-sm" onClick={() => window.print()}>
                        Print
                    </button>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h5 className="text-decoration-underline">Patient Information</h5>
                            <p><strong>Name:</strong> {appointment.patient_info.Patient_Name}</p>
                            <p><strong>Gender:</strong> {appointment.patient_info.Gender}</p>
                            <p><strong>Date of Birth:</strong> {formatDate(appointment.patient_info.Date_Of_Birth)}</p>
                            <p><strong>Age:</strong> {appointment.patient_info.Age}</p>
                            <p><strong>Blood Group:</strong> {appointment.patient_info.Blood_Group}</p>
                            <p><strong>Address:</strong> {appointment.patient_info.Address}</p>
                        </div>
                        <div className="col-md-6">
                            <h5 className="text-decoration-underline">Doctor Information</h5>
                            <p><strong>Name:</strong> Dr. {appointment.doctor_info.Doctor_Name}</p>
                            <p><strong>Department:</strong> {appointment.doctor_info.department_info.Department_Name}</p>
                            <p><strong>Email:</strong> {appointment.doctor_info.Email}</p>
                            <p><strong>Phone:</strong> {appointment.doctor_info.Phone_Number}</p>
                            <p><strong>Consultation Fees:</strong> ₹{appointment.doctor_info.Consultation_Fees}</p>
                        </div>
                    </div>
                    <div className="border-top pt-3">
                        <h5 className="text-decoration-underline">Appointment Summary</h5>
                        <p><strong>Appointment Date:</strong> {formatDate(appointment.Appointment_Date)}</p>
                        <p><strong>Appointment Time:</strong> {formatTime(appointment.Appointment_Time)}</p>
                        <p><strong>Status:</strong> {appointment.Status}</p>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default PrintAppointment;