import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPatient = () => {
    const navigate = useNavigate();

    const [patientName, setPatientName] = useState("");
    const [dateOfBirth, setDOB] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [patientStatus, setPatientStatus] = useState("");
    const [error, setError] = useState("");

    const handle_AddPatient = async (e) => {
        e.preventDefault();
        setError("");

        if (!patientName || !address || !gender || !bloodGroup || patientStatus === "") {
            setError("Please fill all required fields");
            return;
        }

        if (!dateOfBirth && !age) {
            setError("Either Date of Birth or Age must be provided");
            return;
        }

        if (dateOfBirth && age) {
            const dob = new Date(dateOfBirth);
            const today = new Date();
            const calculatedAge = today.getFullYear() - dob.getFullYear() -
                (today.getMonth() < dob.getMonth() ||
                    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) ? 1 : 0);

            if (parseInt(age) !== calculatedAge) {
                setError("Provided Age and Date of Birth do not match");
                return;
            }
        }
        if (dateOfBirth) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(dateOfBirth)) {
                setError("Date of Birth must be in YYYY-MM-DD format");
                return;
            }
        }
        try {
            const token = localStorage.getItem("token");
            const formattedDOB = dateOfBirth || null;
            const new_patient = await axios.post(`http://localhost:8000/api/patient/`,
                {
                    Patient_Name: patientName,
                    Date_Of_Birth: formattedDOB,
                    Age: age,
                    Address: address,
                    Gender: gender,
                    Blood_Group: bloodGroup,
                    Patient_Status: patientStatus
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            alert("Patient added successfully");
            navigate("/new-appointment");
            localStorage.setItem("selectedPatientId", new_patient.data.Patient_ID);
            localStorage.setItem("selectedPatientName", new_patient.data.Patient_Name);
        } catch (error) {
            console.log(error);
            if (error.response?.data) {
                // Handle specific date format error
                if (error.response.data.Date_Of_Birth) {
                    setError(`Date format error: ${error.response.data.Date_Of_Birth}`);
                } else {
                    setError(error.response.data.message || "Error adding patient");
                }
            } else {
                setError("Error adding patient");
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Add New Patient</h2>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => navigate('/patient-dashboard')}
                        className="btn btn-secondary"
                    >
                        <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
                    </button>
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
            </div>
            <div className="card shadow">
                <div className="card-header bg-danger text-white">
                    <h4 className="mb-0">Patient Registration</h4>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handle_AddPatient}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="patientName" className="form-label fw-bold">Patient Name*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="patientName"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date of Birth <small>(optional if age is provided)</small></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateOfBirth"
                                        value={dateOfBirth}
                                        onChange={(e) => setDOB(e.target.value)}
                                    />
                                </div>

                                <div className="form-group mt-2">
                                    <label htmlFor="age">Age <small>(optional if DOB is provided)</small></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="age"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        min="0"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label fw-bold">Address*</label>
                                    <textarea
                                        className="form-control"
                                        id="address"
                                        rows="3"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Gender*</label>
                                    <select
                                        className="form-select"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Blood Group*</label>
                                    <select
                                        className="form-select"
                                        value={bloodGroup}
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Status*</label>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="status"
                                            id="active"
                                            value={true}
                                            checked={patientStatus === true}
                                            onChange={() => setPatientStatus(true)}
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="active">
                                            Active
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="status"
                                            id="inactive"
                                            value={false}
                                            checked={patientStatus === false}
                                            onChange={() => setPatientStatus(false)}
                                        />
                                        <label className="form-check-label" htmlFor="inactive">
                                            Inactive
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button type="submit" className="btn" style={{ backgroundColor: '#ff4040', color: 'white' }} me-2>
                                <i className="fas fa-user-plus me-2"></i> Add Patient
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/patient-dashboard')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPatient;