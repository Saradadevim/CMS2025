import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddBillingByID = () => {
    const [appointmentID, setAppointmentID] = useState("");
    const [patientName, setPatientName] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [consultationFees, setConsultationFees] = useState("");
    const [department, setDepartment] = useState("");
    const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const appointment_id = localStorage.getItem("New Appointment ID");
        const patient_name = localStorage.getItem("Appointment Patient Name");
        const doctor_name = localStorage.getItem("Appointment Doctor Name");
        const consult_fees = localStorage.getItem("Appointment Consult Fees");
        const department_name = localStorage.getItem("Appointment Department");

        if (appointment_id) {
            setAppointmentID(appointment_id);
        } else {
            console.log("No appointment found. Please rebook the appointment!!!");
            navigate("/new-appointment");
        }

        if (patient_name) setPatientName(patient_name);
        if (doctor_name) setDoctorName(doctor_name);
        if (consult_fees) setConsultationFees(consult_fees);
        if (department_name) setDepartment(department_name);
    }, [navigate]);

    const handle_AddAppointmentBilling = async (paymentStatus) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };

        try {
            await axios.post("http://localhost:8000/api/appointment_billings/",
                {
                    appointment: appointmentID,
                    Service_Charge: 10,
                    Payment_Status: paymentStatus
                }, config
            );
            alert("Appointment Billing added successfully!!");
            navigate("/appointment-bill-dashboard");
        }
        catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error adding a new appointment billing");
        }
    };

    const handleCancelBilling = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };

        try {
            await axios.post("http://localhost:8000/api/appointment_billings/",
                {
                    appointment: appointmentID,
                    Service_Charge: 10,
                    Payment_Status: "Cancelled"
                }, config
            );
            navigate("/appointment-bill-dashboard");
        }
        catch (error) {
            console.log(error);
            alert("Error cancelling the appointment billing");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-success text-white">
                    <h2 className="mb-0">Add Billing for Appointment #{appointmentID}</h2>
                </div>
                <div className="card-body">
                    {showPaymentConfirmation && (
                        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Payment Confirmation</h5>
                                    </div>
                                    <div className="modal-body">
                                        <p>Do you want to proceed with payment?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowPaymentConfirmation(false);
                                                handle_AddAppointmentBilling("Unpaid");
                                            }}
                                        >
                                            No
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setShowPaymentConfirmation(false);
                                                handle_AddAppointmentBilling("Paid");
                                            }}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); setShowPaymentConfirmation(true); }}>
                        <div className="mb-3">
                            <label className="form-label">Patient Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={patientName}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Doctor Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={doctorName}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Consultation Fees (₹)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={consultationFees}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                className="form-control"
                                value={department}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Service Charge (₹)</label>
                            <input
                                type="text"
                                className="form-control"
                                value="10 % of Consultation Fees"
                                disabled
                            />
                        </div>

                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-danger me-2"
                                onClick={handleCancelBilling}
                            >
                                Cancel Appointment
                            </button>
                            <button type="submit" className="btn btn-success">
                                Submit Billing
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBillingByID;