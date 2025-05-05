import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddLabTest = () => {
    const [labtests, setLabTest] = useState("");
    const [labTestPrice, setTestPrice] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleAddLabTest = async (e) => {
        e.preventDefault();
        setError("");

        if (!labtests || !labTestPrice) {
            setError("Please fill all required fields");
            return;
        }
        try {
            const add_labtest_token = localStorage.getItem("token");
            await axios.post("http://localhost:8000/api/api/lab-tests/",
                {
                    Lab_Test_Name: labtests,
                    Price: labTestPrice
                },
                { headers: { Authorization: `Bearer ${add_labtest_token}` } }
            );
            alert("Lab test added successfully!");
            navigate("/admin-labtest-dashboard");
        }
        catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Error adding a new lab test");
        }
    };

    return (
        <div className="container-fluid">
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand">Admin Dashboard</span>
                    <div className="d-flex ms-auto">
                        <button 
                            className="btn btn-outline-light me-2" 
                            onClick={() => navigate('/admin-dashboard')}
                        >
                            Back to Admin Dashboard
                        </button>
                        <button className="btn btn-light" onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("Role");
                            navigate("/");
                        }}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h4 className="mb-0">Add New Lab Test</h4>
                            </div>
                            <div className="card-body">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleAddLabTest}>
                                    <div className="mb-3">
                                        <label htmlFor="labTestName" className="form-label">
                                            Lab Test Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="labTestName"
                                            value={labtests}
                                            onChange={(e) => setLabTest(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="labTestPrice" className="form-label">
                                            Price (₹) <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="labTestPrice"
                                            value={labTestPrice}
                                            onChange={(e) => setTestPrice(e.target.value)}
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate("/admin-labtest-dashboard")}
                                        >
                                            <i className="bi bi-arrow-left"></i> Back to Lab Test Dashboard
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            <i className="bi bi-plus-circle"></i> Add Lab Test
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLabTest;