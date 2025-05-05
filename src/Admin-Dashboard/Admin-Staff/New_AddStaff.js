import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddStaff = () => {
  const [fullName, setFullName] = useState("");
  const [eMail, setEMail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfJoining, setDOJ] = useState("");
  const [salary, setSalary] = useState("");
  const [dateOfBirth, setDOB] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [id, setUserDetailsID] = useState("");
  const [users, setUsers] = useState([]);

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
        console.log(response.data)
        setUsers(response.data);
      } catch (error) {
        console.log(error);
        alert("Error fetching the users!!");
      }
    };
    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const add_staff_token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/staff/",
        {
          User_ID: id,
          Full_Name: fullName,
          EMail: eMail,
          Phone_Number: phoneNumber,
          Date_Of_Joining: dateOfJoining,
          Salary: salary,
          Date_Of_Birth: dateOfBirth,
          Staff_Status: isActive,
        },
        { headers: { Authorization: `Token ${add_staff_token}` } }
      );
      alert("Staff added successfully");
      navigate("/admin-staff-dashboard");
    } catch (error) {
      console.log(error);
      alert("Error adding a new staff entry");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: '#ffe6e6', padding: '20px', borderRadius: '8px' }}>
      <h2 className="text-center mb-4" style={{ color: '#cc0000' }}>Add New Staff</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-lg" style={{ borderColor: '#cc0000' }}>
        <div className="mb-3">
          <label htmlFor="userSelect" className="form-label" style={{ color: '#cc0000' }}>Select User</label>
          <select
            id="userSelect"
            className="form-select"
            value={id}
            onChange={(e) => setUserDetailsID(e.target.value)}
            required
            style={{ borderColor: '#cc0000' }}
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
          <label className="form-label" style={{ color: '#cc0000' }}>Full Name</label>
          <input
            type="text"
            className="form-control"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ borderColor: '#cc0000' }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ color: '#cc0000' }}>Email</label>
          <input
            type="email"
            className="form-control"
            value={eMail}
            onChange={(e) => setEMail(e.target.value)}
            required
            style={{ borderColor: '#cc0000' }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ color: '#cc0000' }}>Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            style={{ borderColor: '#cc0000' }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ color: '#cc0000' }}>Date of Joining</label>
          <input
            type="date"
            className="form-control"
            value={dateOfJoining}
            onChange={(e) => setDOJ(e.target.value)}
            required
            style={{ borderColor: '#cc0000' }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ color: '#cc0000' }}>Salary</label>
          <input
            type="number"
            className="form-control"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
            style={{ borderColor: '#cc0000' }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ color: '#cc0000' }}>Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={dateOfBirth}
            onChange={(e) => setDOB(e.target.value)}
            required
            style={{ borderColor: '#cc0000' }}
          />
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            id="isActiveCheck"
            style={{ borderColor: '#cc0000' }}
          />
          <label className="form-check-label" htmlFor="isActiveCheck" style={{ color: '#cc0000' }}>
            Active
          </label>
        </div>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            type="button"
            className="btn btn-secondary me-md-2"
            onClick={() => navigate("/admin-staff-dashboard")}
            style={{ backgroundColor: '#666666', borderColor: '#666666' }}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary me-md-2"
            style={{ backgroundColor: '#cc0000', borderColor: '#cc0000' }}
          >
            Add Staff
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
            style={{ backgroundColor: '#990000', borderColor: '#990000' }}
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;