import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddAppointment = () => {
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [departments, setDepartment] = useState([]);
    const [departmentID, setDeptID] = useState("");
    const [doctors, setDoctor] = useState([]);
    const [doctorID, setDoctorID] = useState("");
    const [error, setError] = useState("");
    const [patientID, setPatientID] = useState("");
    const [patientName, setPatientName] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [newAppointmentID, setNewAppointmentID] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };

        // Fetch from localStorage
        const storedPatientID = localStorage.getItem("selectedPatientId");
        const storedPatientName = localStorage.getItem("selectedPatientName");

        if (storedPatientID && storedPatientName) {
            setPatientID(storedPatientID);
            setPatientName(storedPatientName);
        } else {
            setError("No patient selected. Please select a patient first.");
        }

        const fetch_DepartmentInfo = async () => {
            try {
                const department_response = await axios.get("http://localhost:8000/api/departments/", config);
                setDepartment(department_response.data);
            }
            catch (error) {
                console.log(error);
                setError("Error fetching department details");
            }
        };
        fetch_DepartmentInfo();

        const fetch_DoctorInfo = async () => {
            try {
                const doctor_response = await axios.get("http://localhost:8000/api/doctors/", config);
                setDoctor(doctor_response.data);
            }
            catch (error) {
                console.log(error);
                setError("Error fetching doctor details");
            }
        };
        fetch_DoctorInfo();

        // Fetching the list of all current appointments
        const fetch_Appointments = async () => {
            try {
                const appointments_response = await axios.get("http://localhost:8000/api/appointments/", config);
                setAppointments(appointments_response.data);
            }
            catch (error) {
                console.log(error);
                setError("Error fetching the appointment informations");
            }
        };
        fetch_Appointments();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handle_AddAppointment = async (status) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };

        // Validate fields
        if (!appointmentDate || !appointmentTime || !departmentID || !doctorID) {
            setError("Please fill all required fields");
            return;
        }

        // Date and time validation
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for comparison
        const selectedDate = new Date(appointmentDate);
        selectedDate.setHours(0, 0, 0, 0);

        // Prevent past dates
        if (selectedDate < today) {
            setError("Cannot schedule appointments in the past");
            return;
        }

        // Time validation
        const [hours, minutes] = appointmentTime.split(':').map(Number);
        const selectedTime = new Date(appointmentDate);
        selectedTime.setHours(hours, minutes);

        // Check for 1:00 PM to 2:00 PM slot
        const lunchStart = new Date(appointmentDate);
        lunchStart.setHours(13, 0); // 1:00 PM
        const lunchEnd = new Date(appointmentDate);
        lunchEnd.setHours(14, 0); // 2:00 PM
        if (selectedTime >= lunchStart && selectedTime < lunchEnd) {
            setError("Doctor is currently unavailable");
            return;
        }

        // Check for 9:00 AM to 6:00 PM availability
        const startTime = new Date(appointmentDate);
        startTime.setHours(9, 0); // 9:00 AM
        const endTime = new Date(appointmentDate);
        endTime.setHours(18, 0); // 6:00 PM
        if (selectedTime < startTime || selectedTime >= endTime) {
            setError("Doctor is available between 9:00 am and 6:00 pm");
            return;
        }

        // For today's date, time must be in the future
        if (selectedDate.getTime() === today.getTime()) {
            const now = new Date();
            if (selectedTime <= now) {
                setError("Appointment time must be in the future for today");
                return;
            }
        }

        // Proceed with appointment creation
        try {
            const new_appointment = await axios.post("http://localhost:8000/api/appointments/",
                {
                    Appointment_Date: appointmentDate,
                    Appointment_Time: appointmentTime,
                    Status: status,
                    patient: patientID,
                    doctor: doctorID
                }, config
            );
            const appointmentID = new_appointment.data.Appointment_ID;
            const appintment_patientName = new_appointment.data.patient_info?.Patient_Name;
            const appointment_doctorName = new_appointment.data.doctor_info?.Doctor_Name;
            const appointment_consultFees = new_appointment.data.doctor_info?.Consultation_Fees;
            const appointment_DeptName = new_appointment.data.doctor_info?.department_info?.Department_Name;
            setNewAppointmentID(appointmentID);
            localStorage.setItem("New Appointment ID", appointmentID);
            localStorage.setItem("Appointment Patient Name", appintment_patientName);
            localStorage.setItem("Appointment Doctor Name", appointment_doctorName);
            localStorage.setItem("Appointment Consult Fees", appointment_consultFees);
            localStorage.setItem("Appointment Department", appointment_DeptName);
            setError(""); // Clear any previous errors
            navigate("/bill-by-id");
        }
        catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                if (error.response.data.includes('Appointment already exists')) {
                    setError("Appointment already exists");
                } else {
                    setError("Error adding the appointment");
                }
            } else {
                setError("Error adding the appointment");
            }
        }
    };

    const handleCancelAppointment = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };

        // Validate fields
        if (!appointmentDate || !appointmentTime || !departmentID || !doctorID) {
            setError("Please fill all required fields");
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/appointments/",
                {
                    Appointment_Date: appointmentDate,
                    Appointment_Time: appointmentTime,
                    Status: "Cancelled",
                    patient: patientID,
                    doctor: doctorID
                }, config
            );
            navigate("/book-appointment");
        }
        catch (error) {
            console.log(error);
            setError("Error cancelling the appointment");
        }
    };

    return (
        <>
            {showConfirmation && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Appointment Confirmation</h5>
                            </div>
                            <div className="modal-body">
                                <p>Do you want to proceed to billing?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowConfirmation(false);
                                        handle_AddAppointment("Pending");
                                    }}
                                >
                                    No
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowConfirmation(false);
                                        handle_AddAppointment("Scheduled");
                                    }}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mt-4" style={{ backgroundColor: '#fff5f5', minHeight: '100vh', padding: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Add New Appointment</h2>
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger"
                    >
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </button>
                </div>

                <div className="card shadow">
                    <div className="card-header bg-danger text-white">
                        <h2 className="mb-0">Add New Appointment</h2>
                    </div>
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={(e) => { e.preventDefault(); setShowConfirmation(true); }}>
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label className="form-label">Selected Patient</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={patientName}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Department</label>
                                    <select
                                        className="form-select"
                                        value={departmentID}
                                        onChange={(e) => {
                                            setDeptID(e.target.value);
                                            setDoctorID("");
                                        }}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.filter(d => d.Department_Status).map(dept => (
                                            <option key={dept.Department_ID} value={dept.Department_ID}>
                                                {dept.Department_Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Doctor</label>
                                    <select
                                        className="form-select"
                                        value={doctorID}
                                        onChange={(e) => setDoctorID(e.target.value)}
                                        disabled={!departmentID}
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors
                                            .filter(d => d.Doc_Status && d.department_info.Department_ID == departmentID)
                                            .map(doctor => (
                                                <option key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                                                    {doctor.Doctor_Name} ({doctor.department_info.Department_Name})
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row mb pending-3">
                                <div className="col-md-3">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={appointmentTime}
                                        onChange={(e) => setAppointmentTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={() => navigate('/book-appointment')}
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-dark me-2"
                                    onClick={handleCancelAppointment}
                                >
                                    Cancel Appointment
                                </button>
                                <button
                                    type="submit"
                                    className="btn"
                                    style={{ backgroundColor: '#ff6b6b', color: 'white' }}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddAppointment;