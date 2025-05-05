import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [patientName, setPatientName] = useState("");
    const [dateOfBirth, setDOB] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [patientStatus, setPatientStatus] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const patient_token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${patient_token}`
            }
        };

        const fetchPatientInfo = async () => {
            try {
                const patient_response = await axios.get(`http://localhost:8000/api/patient/${id}/`, config);
                const patient = patient_response.data;
                setPatientName(patient.Patient_Name);
                setDOB(patient.Date_Of_Birth);
                setAddress(patient.Address);
                setGender(patient.Gender);
                setBloodGroup(patient.Blood_Group);
                setPatientStatus(patient.Patient_Status);
            }
            catch (error) {
                console.log(error);
                setError("Error fetching patient details");
            }
        };
        fetchPatientInfo();
    }, [id]);

    const handlePatientUpdate = async (e) => {
        e.preventDefault();
        setError("");

        if (!patientName || !dateOfBirth || !address || !gender || !bloodGroup || patientStatus === "") {
            setError("Please fill all required fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:8000/api/patient/${id}/`,
                {
                    Patient_Name: patientName,
                    Date_Of_Birth: dateOfBirth,
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
            alert("Patient updated successfully");
            navigate("/patient-dashboard");
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Error updating patient");
        }
    };

    const handleLogout = () => {
        localStorage.clear(); // Clears all data from local storage
        navigate("/"); // Navigates to the root route
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Patient Details</h2>
                <div>
                    <button
                        onClick={() => navigate('/patient-dashboard')}
                        className="btn btn-secondary me-2"
                    >
                        <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="btn btn-danger"
                    >
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </button>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-header bg-danger text-white">
                    <h4 className="mb-0">Update Patient Information</h4>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handlePatientUpdate}>
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

                                <div className="mb-3">
                                    <label htmlFor="dateOfBirth" className="form-label fw-bold">Date of Birth*</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateOfBirth"
                                        value={dateOfBirth}
                                        onChange={(e) => setDOB(e.target.value)}
                                        required
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
                                            value="true"
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
                                            value="false"
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
                            <button 
                                type="submit" 
                                className="btn me-2"
                                style={{ backgroundColor: '#ff6b6b', color: 'white' }}
                            >
                                <i className="fas fa-save me-2"></i> Update Patient
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

export default EditPatient;