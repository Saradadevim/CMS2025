import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLabTestDashboard = () => {
    const [labtests, setLabTest] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetch_LabTestData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const response = await axios.get("http://localhost:8000/api/api/lab-tests/", config);
                setLabTest(response.data);
            }
            catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetch_LabTestData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredTests = labtests.filter((test) => {
        return (
            test.Lab_Test_Name.toLowerCase().includes(searchTerm) ||
            test.Price.toString().toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="container-fluid">
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand">Admin Dashboard</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <div className="d-flex ms-auto">
                            <button
                                className="btn btn-outline-light me-2"
                                onClick={() => navigate('/admin-dashboard')}
                            >
                                Back to Admin Dashboard
                            </button>
                            <button className="btn btn-light" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container">
                {/* Page Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Lab Test Management</h2>
                    <Link to="/add-labtest" className="btn btn-success">
                        <i className="bi bi-plus-circle"></i> Add New Test
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by test name or price..."
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {/* Lab Tests Table */}
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Test Name</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTests.length > 0 ? (
                                filteredTests.map((test) => (
                                    <tr key={test.LabTest_ID}>
                                        <td>{test.Lab_Test_Name}</td>
                                        <td>₹{test.Price}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link
                                                    to={`/view-labtest/${test.LabTest_ID}`}
                                                    className="btn btn-sm btn-info text-white"
                                                >
                                                    <i className="bi bi-eye"></i> View
                                                </Link>
                                                <Link
                                                    to={`/edit-labtest/${test.LabTest_ID}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    <i className="bi bi-pencil"></i> Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No lab tests found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLabTestDashboard;