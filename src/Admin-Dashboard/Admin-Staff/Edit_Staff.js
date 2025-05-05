import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditStaff = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [eMail, setEMail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dateOfJoining, setDOJ] = useState("");
    const [salary, setSalary] = useState("");
    const [dateOfBirth, setDOB] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [uid, setUserDetailsID] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const auth_token = localStorage.getItem("token");
        const fetchStaffDetails = async () => {
            try {
                // Fetch staff details
                const staffRes = await axios.get(`http://localhost:8000/api/staff/${id}/`, {
                    headers: {
                        Authorization: `Token ${auth_token}`,
                    }
                });

                // Fetch all users
                const userRes = await axios.get("http://localhost:8000/api/api/user-details/", {
                    headers: {
                        Authorization: `Token ${auth_token}`,
                    },
                });

                setUsers(userRes.data);

                // Set form fields with existing staff data
                const staffData = staffRes.data;
                setFullName(staffData.Full_Name);
                setEMail(staffData.EMail);
                setPhoneNumber(staffData.Phone_Number);
                setDOJ(staffData.Date_Of_Joining);
                setSalary(staffData.Salary);
                setDOB(staffData.Date_Of_Birth);
                setIsActive(staffData.Staff_Status);

                // Find the index of the user in the users array
                const userIndex = userRes.data.findIndex(user =>
                    user.user_info?.id === staffData.User_ID
                );
                setUserDetailsID(userIndex !== -1 ? userIndex : "");

            } catch (error) {
                console.log(error);
                alert("Error fetching staff details");
                navigate("/admin-staff-dashboard");
            }
        };

        fetchStaffDetails();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const edit_staff_token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8000/api/staff/${id}/`,
                {
                    User_ID: uid,
                    Full_Name: fullName,
                    EMail: eMail,
                    Phone_Number: phoneNumber,
                    Date_Of_Joining: dateOfJoining,
                    Salary: salary,
                    Date_Of_Birth: dateOfBirth,
                    Staff_Status: isActive,
                },
                { headers: { Authorization: `Token ${edit_staff_token}` } }
            );
            alert("Staff updated successfully");
            navigate("/admin-staff-dashboard");
        } catch (error) {
            console.log(error);
            alert("Error updating staff");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    return (
        <div className="container mt-5" style={{ backgroundColor: '#fff5f5', minHeight: '100vh', padding: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-center mb-4" style={{ color: '#dc3545' }}>Edit Staff</h2>
                <button 
                    className="btn btn-danger"
                    style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="card p-4 shadow-lg" style={{ borderColor: '#dc3545' }}>
                <div className="mb-3">
                    <label htmlFor="userSelect" className="form-label">Select User</label>
                    <select
                        id="userSelect"
                        className="form-select"
                        style={{ borderColor: '#dc3545' }}
                        value={uid}
                        onChange={(e) => setUserDetailsID(e.target.value)}
                        required
                    >
                        <option value="">-- Select User --</option>
                        {users.map((user, index) => (
                            <option key={index} value={index}>
                                {user.user_info?.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderColor: '#dc3545' }}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        style={{ borderColor: '#dc3545' }}
                        value={eMail}
                        onChange={(e) => setEMail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderColor: '#dc3545' }}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Date of Joining</label>
                    <input
                        type="date"
                        className="form-control"
                        style={{ borderColor: '#dc3545' }}
                        value={dateOfJoining}
                        onChange={(e) => setDOJ(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Salary</label>
                    <input
                        type="number"
                        className="form-control"
                        style={{ borderColor: '#dc3545' }}
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        className="form-control"
                        style={{ borderColor: '#dc3545' }}
                        value={dateOfBirth}
                        onChange={(e) => setDOB(e.target.value)}
                        required
                    />
                </div>

                <div className="form-check mb-4">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        style={{ borderColor: '#dc3545' }}
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        id="isActiveCheck"
                    />
                    <label className="form-check-label" htmlFor="isActiveCheck">
                        Active
                    </label>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                        type="button"
                        className="btn btn-outline-danger me-md-2"
                        onClick={() => navigate("/admin-staff-dashboard")}
                    >
                        Back
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-danger"
                        style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                    >
                        Update Staff
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditStaff;