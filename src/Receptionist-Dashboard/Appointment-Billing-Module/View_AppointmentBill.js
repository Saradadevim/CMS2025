import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const View_AppointmentBill = () => {
    const { id } = useParams();
    const [appointmentBill, setAppointmentBill] = useState(null);
    const [billToken, setBillToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointmentBillData = async () => {
            try {
                const token = localStorage.getItem('token');

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const appointment_response = await axios.get(`http://localhost:8000/api/appointment_billings/${id}`, config);
                setAppointmentBill(appointment_response.data);
                localStorage.setItem("AppBill ID", appointment_response.data.Appointment_Billing_ID);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetchAppointmentBillData();

        const fetch_Token_Data = async () => {
            try {
                const token = localStorage.getItem('token');

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const token_response = await axios.get("http://localhost:8000/api/token/", config);
                const app_bill_id = localStorage.getItem("AppBill ID");
                const tokenData = token_response.data.find(token => token.appointmentBill_info.Appointment_Billing_ID === parseInt(app_bill_id));
                setBillToken(tokenData);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                alert("Error fetching the token data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetch_Token_Data();
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

    if (!appointmentBill) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Failed to load appointment billing data.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            {/* Logout Button */}
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-danger"
                    onClick={() => {
                        localStorage.clear();
                        navigate('/');
                    }}
                >
                    Logout
                </button>
            </div>
            <div className="card shadow-lg">
                <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8d7da' }}>
                    <h4 className="mb-0" style={{ color: 'black' }}>Appointment Billing Details</h4>
                    <div>
                        <button className="btn btn-light btn-sm me-2" onClick={() => window.print()}>
                            Print
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {billToken && (
                        <div>
                            <h5 className="mb-3">Token Information</h5>
                            <ul className="list-group mb-4">
                                <li className="list-group-item"><strong>Token Number:</strong> <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{billToken.Token_Number}</span></li>
                            </ul>
                        </div>
                    )}

                    <h5 className="mb-3">Patient Information</h5>
                    <ul className="list-group mb-4">
                        <li className="list-group-item"><strong>Name:</strong> {appointmentBill.appointment_info.patient_info.Patient_Name}</li>
                        <li className="list-group-item"><strong>Age:</strong> {appointmentBill.appointment_info.patient_info.Age}</li>
                        <li className="list-group-item"><strong>Gender:</strong> {appointmentBill.appointment_info.patient_info.Gender}</li>
                        <li className="list-group-item"><strong>Blood Group:</strong> {appointmentBill.appointment_info.patient_info.Blood_Group}</li>
                        <li className="list-group-item"><strong>Address:</strong> {appointmentBill.appointment_info.patient_info.Address}</li>
                    </ul>

                    <h5 className="mb-3">Doctor Information</h5>
                    <ul className="list-group mb-4">
                        <li className="list-group-item"><strong>Name:</strong> Dr. {appointmentBill.appointment_info.doctor_info.Doctor_Name}</li>
                        <li className="list-group-item"><strong>Department:</strong> {appointmentBill.appointment_info.doctor_info.department_info.Department_Name}</li>
                        <li className="list-group-item"><strong>Contact:</strong> {appointmentBill.appointment_info.doctor_info.Phone_Number}</li>
                        <li className="list-group-item"><strong>Email:</strong> {appointmentBill.appointment_info.doctor_info.Email}</li>
                        <li className="list-group-item"><strong>Consultation Fees:</strong> ₹{appointmentBill.appointment_info.doctor_info.Consultation_Fees}</li>
                    </ul>

                    <h5 className="mb-3">Appointment Info</h5>
                    <ul className="list-group mb-4">
                        <li className="list-group-item"><strong>Date:</strong> {formatDate(appointmentBill.appointment_info.Appointment_Date)}</li>
                        <li className="list-group-item"><strong>Time:</strong> {formatTime(appointmentBill.appointment_info.Appointment_Time)}</li>
                        <li className="list-group-item"><strong>Status:</strong> {appointmentBill.appointment_info.Status}</li>
                    </ul>

                    <h5 className="mb-3">Billing Info</h5>
                    <ul className="list-group mb-4">
                        <li className="list-group-item"><strong>Consultation Fee:</strong> ₹{appointmentBill.Consultation_Fee}</li>
                        <li className="list-group-item"><strong>Service Charge:</strong> ₹{appointmentBill.Service_Charge}</li>
                        <li className="list-group-item"><strong>Total Charge:</strong> ₹{appointmentBill.Total_Charge}</li>
                        <li className="list-group-item"><strong>Payment Status:</strong> {appointmentBill.Payment_Status}</li>
                    </ul>

                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default View_AppointmentBill;