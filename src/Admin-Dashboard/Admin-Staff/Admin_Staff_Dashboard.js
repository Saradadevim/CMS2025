import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminStaffDashboard = () => {
    const [staffs, setStaffs] = useState([]);
    const [allStaffs, setAllStaffs] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [showInactive, setShowInactive] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const staff_Res = await axios.get("http://localhost:8000/api/staff/", config);
                const userDetails_Res = await axios.get("http://localhost:8000/api/api/user-details/", config);

                const userDetailsMap = {};
                userDetails_Res.data.forEach((udetails) => {
                    userDetailsMap[udetails.id] = udetails.user_info.username;
                });

                setStaffs(staff_Res.data);
                setAllStaffs(staff_Res.data);
                setUserDetails(userDetailsMap);
            } catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetchStaffData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const toggleActiveStatusView = () => {
        setShowInactive(!showInactive);
    };

    const filteredStaffs = allStaffs.filter((staff) => {
        if (showInactive) {
            if (staff.Staff_Status) return false;
        } else {
            if (!staff.Staff_Status) return false;
        }

        const userName = userDetails[staff.User?.id] || "Unknown";
        return (
            staff.Full_Name.toLowerCase().includes(searchTerm) ||
            userName.toLowerCase().includes(searchTerm) ||
            staff.EMail.toLowerCase().includes(searchTerm) ||
            staff.Phone_Number.toLowerCase().includes(searchTerm) ||
            staff.Date_Of_Joining.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="container mt-4" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh', padding: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#8B8589' }}>Staff Management</h2>
                <div>
                    <button
                        onClick={() => navigate("/new-add-staff")}
                        style={{ 
                            backgroundColor: '#DA291C', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            marginRight: '10px'
                        }}
                    >
                        + Add Staff
                    </button>
                    <button
                        onClick={() => navigate("/admin-dashboard")}
                        style={{ 
                            backgroundColor: '#8B8589', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            marginRight: '10px'
                        }}
                    >
                        Back
                    </button>
                    <button 
                        onClick={toggleActiveStatusView}
                        style={{ 
                            backgroundColor: showInactive ? '#DA291C' : '#8B8589', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            marginRight: '10px'
                        }}
                    >
                        {showInactive ? "View Active Staff" : "View Inactive Staff"}
                    </button>
                    <button 
                        onClick={handleLogout} 
                        style={{ 
                            backgroundColor: '#DA291C', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <input
                type="text"
                placeholder="Search staff..."
                className="form-control mb-3"
                onChange={handleSearchChange}
                style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6', color: '#8B8589' }}
            />

            <table className="table table-hover" style={{ backgroundColor: '#F0EAD6', borderColor: '#8B8589' }}>
                <thead style={{ backgroundColor: '#DA291C', color: '#D1C0A8' }}>
                    <tr>
                        <th>Staff Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date of Joining</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody style={{ color: '#8B8589' }}>
                    {filteredStaffs.length > 0 ? (
                        filteredStaffs.map((staff) => (
                            <tr key={staff.Staff_ID} style={{ backgroundColor: '#F0EAD6' }}>
                                <td>{staff.Full_Name}</td>
                                <td>{staff.EMail}</td>
                                <td>{staff.Phone_Number}</td>
                                <td>{staff.Date_Of_Joining}</td>
                                <td>
                                    <span style={{ 
                                        backgroundColor: staff.Staff_Status ? '#DA291C' : '#8B8589', 
                                        color: 'white', 
                                        padding: '5px 10px', 
                                        borderRadius: '12px',
                                        display: 'inline-block'
                                    }}>
                                        {staff.Staff_Status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap gap-1">
                                        <Link 
                                            to={`/view-staff/${staff.Staff_ID}`} 
                                            style={{ 
                                                backgroundColor: '#8B8589', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '5px 10px', 
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                textDecoration: 'none',
                                                marginRight: '5px'
                                            }}
                                        >
                                            View
                                        </Link>
                                        <Link 
                                            to={`/edit-staff/${staff.Staff_ID}`} 
                                            style={{ 
                                                backgroundColor: '#DA291C', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '5px 10px', 
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                textDecoration: 'none',
                                                marginRight: '5px'
                                            }}
                                        >
                                            Edit
                                        </Link>
                                        <Link 
                                            to={`/delete-staff/${staff.Staff_ID}`} 
                                            style={{ 
                                                backgroundColor: '#DA291C', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '5px 10px', 
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                textDecoration: 'none',
                                                marginRight: '5px'
                                            }}
                                        >
                                            Deactivate
                                        </Link>
                                        <Link 
                                            to={`/activate-staff/${staff.Staff_ID}`} 
                                            style={{ 
                                                backgroundColor: staff.Staff_Status ? '#8B8589' : '#DA291C', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '5px 10px', 
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                textDecoration: 'none',
                                                opacity: staff.Staff_Status ? 0.5 : 1,
                                                pointerEvents: staff.Staff_Status ? 'none' : 'auto'
                                            }}
                                        >
                                            Activate
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr style={{ backgroundColor: '#F0EAD6' }}>
                            <td colSpan="6" className="text-center" style={{ color: '#8B8589' }}>
                                {showInactive ? "No inactive staff found" : "No active staff found"}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminStaffDashboard;