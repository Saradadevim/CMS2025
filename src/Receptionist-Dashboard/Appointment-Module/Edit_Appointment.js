import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Edit_Appointment = () => {
    const { id } = useParams();
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [status, setAppointmentStatus] = useState("");
    const [departments, setDepartment] = useState([]);
    const [departmentID, setDeptID] = useState("");
    const [doctors, setDoctor] = useState([]);
    const [doctorID, setDoctorID] = useState("");
    const [patientID, setPatientID] = useState("");
    const [patientName, setPatientName] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch departments first
                const department_response = await axios.get("http://localhost:8000/api/departments/", config);
                setDepartment(department_response.data);

                // Fetch doctors
                const doctor_response = await axios.get("http://localhost:8000/api/doctors/", config);
                setDoctor(doctor_response.data);

                // Fetch appointment data after departments and doctors are available
                const appointment_response = await axios.get(`http://localhost:8000/api/appointments/${id}`, config);
                setAppointmentDate(appointment_response.data.Appointment_Date);
                setAppointmentTime(appointment_response.data.Appointment_Time);
                setAppointmentStatus(appointment_response.data.Status);
                setPatientID(appointment_response.data.patient_info?.Patient_ID);
                setPatientName(appointment_response.data.patient_info?.Patient_Name);

                // Set departmentID and doctorID after departments and doctors are fetched
                const deptID = appointment_response.data.doctor_info?.department_info?.Department_ID;
                const docID = appointment_response.data.doctor_info?.Doctor_ID;
                setDeptID(deptID || "");
                setDoctorID(docID || "");
            } catch (error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handle_EditAppointment = async (e) => {
        e.preventDefault();
        if (!appointmentDate || !appointmentTime || !status || !departmentID || !doctorID) {
            alert("Please fill all required fields");
            return;
        }

        try {
            await axios.put(
                `http://localhost:8000/api/appointments/${id}/`,
                {
                    Appointment_Date: appointmentDate,
                    Appointment_Time: appointmentTime,
                    Status: status,
                    patient: patientID,
                    doctor: doctorID,
                },
                config
            );
            alert("Appointment data updated successfully!!");
            navigate("/book-appointment");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error updating the appointment");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className="card shadow">
                <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    <h2 className="mb-0">Edit Appointment</h2>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <form onSubmit={handle_EditAppointment}>
                            <div className="mb-3">
                                <label className="form-label">Patient Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={patientName || "Patient"}
                                    disabled
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Appointment Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Appointment Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Appointment Status</label>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setAppointmentStatus(e.target.value)}
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Department</label>
                                <select
                                    className="form-select"
                                    value={departmentID}
                                    onChange={(e) => {
                                        setDeptID(e.target.value);
                                        setDoctorID(""); // Reset doctor when department changes
                                    }}
                                    required
                                >
                                    <option value="">Select department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.Department_ID} value={dept.Department_ID}>
                                            {dept.Department_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Doctor</label>
                                <select
                                    className="form-select"
                                    value={doctorID}
                                    onChange={(e) => setDoctorID(e.target.value)}
                                    disabled={!departmentID}
                                    required
                                >
                                    <option value="">Select doctor</option>
                                    {doctors
                                        .filter((doc) => doc.Doc_Status && doc.department_info.Department_ID === departmentID)
                                        .map((doc) => (
                                            <option key={doc.Doctor_ID} value={doc.Doctor_ID}>
                                                Dr. {doc.Doctor_Name} - {doc.department_info.Department_Name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={() => navigate("/book-appointment")}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn"
                                    style={{ backgroundColor: '#ff6b6b', color: 'white' }}
                                >
                                    Update Appointment
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Edit_Appointment;