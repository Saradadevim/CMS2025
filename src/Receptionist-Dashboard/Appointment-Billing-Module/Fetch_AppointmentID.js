import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FetchAppointmentID = () => {
    const [appointment, setAppointment] = useState("");
    const [payment_status, setPaymentStatus] = useState("");
    const [appointmentID, setAppointmentID] = useState("");
    const [departments, setDepartment] = useState([]);
    const [departmentID, setDeptID] = useState("");
    const [doctors, setDoctor] = useState([]);
    const [doctorID, setDoctorID] = useState("");
    const [error, setError] = useState("");
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    // Capturing the JWT token
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    useEffect(() => {
        const fetch_appointment_data = async () => {
            try {
                const appointment_response = await axios.get("http://localhost:8000/api/appointments/", config);
                setAppointment(appointment_response.data);
            } catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetch_appointment_data();

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

        const fetchPatientData = async () => {
            try {
                const Patient_Res = await axios.get("http://localhost:8000/api/patient/", config);
                setPatients(Patient_Res.data);
            } catch (error) {
                console.log(error);
                alert("Error fetching the data.... Please refer the console for more info!");
            }
        };
        fetchPatientData();

        // Getting the fetched appointment ID from the local storage
        const appointment_id = localStorage.getItem("Fetched Appointment ID")

        if (appointment_id) {
            setAppointmentID(appointment_id)
        }
        else {
            console.log("No appointment found. Please rebook the appointment!!!");
        }
    }, []);

    const handle_AddAppointmentBilling = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };
        if (!payment_status) {
            alert("Please fill all required fields");
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/appointment_billings/",
                {
                    appointment: appointmentID,
                    Service_Charge: 10,
                    Payment_Status: payment_status
                }, config
            );
            alert("Appointment Billing added successfully!!");
            navigate("/appointment-bill-dashboard");
        }
        catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error adding a new appointment");
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Fetch Appointment ID</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label className="form-label">Select Department</label>
                <select className="form-select" value={departmentID} onChange={(e) => setDeptID(e.target.value)}>
                    <option value="">-- Choose Department --</option>
                    {departments.map((dept) => (
                        <option key={dept.Department_ID} value={dept.Department_ID}>
                            {dept.Department_Name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Select Doctor</label>
                <select
                    className="form-select"
                    value={doctorID}
                    onChange={(e) => setDoctorID(e.target.value)}
                >
                    <option value="">-- Choose Doctor --</option>
                    {doctors
                        .filter((doc) => doc.department_info.Department_ID == departmentID)
                        .map((doc) => (
                            <option key={doc.Doctor_ID} value={doc.Doctor_ID}>
                                {doc.Doctor_Name}
                            </option>
                        ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Select Patient</label>
                <select
                    className="form-select"
                    onChange={(e) => {
                        const selectedPatientID = parseInt(e.target.value);
                        const selectedPatient = patients.find((p) => p.Patient_ID === selectedPatientID);
                        const selectedDoctor = doctors.find((d) => d.Doctor_ID == doctorID);

                        if (selectedPatient && selectedDoctor) {
                            const matchedAppointment = appointment.find(
                                (a) =>
                                    a.patient_info.Patient_ID === selectedPatient.Patient_ID &&
                                    a.doctor_info.Doctor_ID === selectedDoctor.Doctor_ID
                            );

                            if (matchedAppointment) {
                                localStorage.setItem("Fetched Appointment ID", matchedAppointment.Appointment_ID);
                                alert(`Appointment ID: ${matchedAppointment.Appointment_ID} stored in localStorage.`);
                            } else {
                                alert("No matching appointment found.");
                            }
                        }
                    }}
                >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((pat) => (
                        <option key={pat.Patient_ID} value={pat.Patient_ID}>
                            {pat.Patient_Name}
                        </option>
                    ))}
                </select>
            </div>
            {/* New Section Starts Here */}
            <div className="mb-3">
                <button className="btn btn-secondary me-2" onClick={() => navigate("/appointment-bill-dashboard")}>
                    Back
                </button>
                <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
                    Sync
                </button>

            </div>

            <div className="mb-3">
                <label className="form-label">Fetched Appointment ID</label>
                <input type="text" className="form-control" value={appointmentID} disabled />
            </div>

            <div className="mb-3">
                <label className="form-label">Service Charge</label>
                <input type="text" className="form-control" value="10% of Consultation Fees" disabled />
            </div>

            <div className="mb-3">
                <label className="form-label">Payment Status</label>
                <select
                    className="form-select"
                    value={payment_status}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                >
                    <option value="">-- Select Payment Status --</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            <div className="mb-3">
                <button className="btn btn-primary" onClick={handle_AddAppointmentBilling}>
                    Proceed
                </button>
            </div>
        </div>
    );
};

export default FetchAppointmentID;