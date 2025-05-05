/**
 * When adding a new doctor, data should be entered in the below format
 *      {
            "Doctor_Name": "Rajesh Khanna",
            "Email": "rajesh@gmail.com",
            "Phone_Number": "7116172622",
            "Doctor_Salary": 23000,
            "Date_Of_Birth": "1995-09-02",
            "Consultation_Fees": 230,
            "Date_Of_Joining": "2025-01-01",
            "departmentID": 1,
            "user_details": 5
        }
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDoctor = () => {
    const [doctorName, setDoctorName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [doc_salary, setDoctorSalary] = useState("");
    const [dob, setDateExceptOfBirth] = useState("");
    const [consult_fees, setConsultationFees] = useState("");
    const [doj, setDateOfJoining] = useState("");
    const [deptID, setDeptID] = useState("");
    const [departments, setDepartment] = useState([]);
    const [userID, setUserID] = useState("");
    const [userDetails, setUserDetails] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const auth_token = localStorage.getItem("token");

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/api/user-details/", {
                    headers: {
                        Authorization: `Token ${auth_token}`,
                    },
                });
                console.log(response.data);
                setUserDetails(response.data);
            } catch (error) {
                console.log(error);
                setError("Error fetching user details");
            }
        };

        const fetchDepartments = async () => {
            try {
                const dept_response = await axios.get("http://localhost:8000/api/departments/", {
                    headers: {
                        Authorization: `Token ${auth_token}`,
                    },
                });
                setDepartment(dept_response.data);
            } catch (error) {
                console.log(error);
                setError("Error fetching departments");
            }
        };

        fetchUserInfo();
        fetchDepartments();
    }, []);

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!doctorName || !email || !phoneNumber || !doc_salary || !dob || !consult_fees || !doj || !deptID || !userID) {
            setError("Please fill all required fields");
            return;
        }

        try {
            const add_doc_token = localStorage.getItem("token");
            await axios.post("http://localhost:8000/api/doctors/",
                {
                    Doctor_Name: doctorName,
                    Email: email,
                    Phone_Number: phoneNumber,
                    Doctor_Salary: doc_salary,
                    Date_Of_Birth: dob,
                    Consultation_Fees: consult_fees,
                    Date_Of_Joining: doj,
                    departmentID: deptID,
                    user_details: parseInt(userID)
                },
                { headers: { Authorization: `Token ${add_doc_token}` } }
            );
            alert("Doctor added successfully");
            navigate("/admin-doctor-dashboard");
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Error adding a new doctor");
        }
    };

    return (
        <div className="container py-4" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh', padding: '20px' }}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card" style={{ backgroundColor: '#F0EAD6', borderColor: '#8B8589', borderRadius: '8px' }}>
                        <div className="card-header" style={{ backgroundColor: '#DA291C', color: '#D1C0A8' }}>
                            <h5 className="mb-0">Add New Doctor</h5>
                        </div>
                        <div className="card-body" style={{ color: '#8B8589' }}>
                            {error && <div className="alert" style={{ backgroundColor: '#F0EAD6', color: '#8B8589', borderColor: '#DA291C' }}>{error}</div>}

                            <form onSubmit={handleDoctorSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Doctor Name*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={doctorName}
                                                onChange={(e) => setDoctorName(e.target.value)}
                                                required
                                                style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Email*</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Phone Number*</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                required
                                                style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Salary*</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={doc_salary}
                                                onChange={(e) => setDoctorSalary(e.target.value)}
                                                required
                                                style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Date of Birth*</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={dob}
                                                onChange={(e) => setDateExceptOfBirth(e.target.value)}
                                                required
                                                style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Consultation Fees*</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={consult_fees}
                                                onChange={(e) => setConsultationFees(e.target.value)}
                                                required
                                                style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Date of Joining*</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={doj}
                                                onChange={(e) => setDateOfJoining(e.target.value)}
                                                required
                                                style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Department*</label>
                                            <select
                                                className="form-select"
                                                value={deptID}
                                                onChange={(e) => setDeptID(e.target.value)}
                                                required
                                                style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6' }}
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept.Department_ID} value={dept.Department_ID}>
                                                        {dept.Department_Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Assign User Account*</label>
                                    <select
                                        className="form-select"
                                        value={userID}
                                        onChange={(e) => setUserID(e.target.value)}
                                        required
                                        style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6' }}
                                    >
                                        <option value="">Select User Account</option>
                                        {userDetails.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.user_info?.username || `User ${user.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="d-flex justify-content-end gap-3">
                                    <button
                                        type="button"
                                        style={{
                                            backgroundColor: '#8B8589',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}
                                        onClick={() => navigate("/admin-doctor-dashboard")}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            backgroundColor: '#DA291C',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Add Doctor
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDoctor;