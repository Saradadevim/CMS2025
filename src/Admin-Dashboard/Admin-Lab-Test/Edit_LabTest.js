import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditLabTest = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [labtestName, setTestName] = useState("");
    const [testPrice, setTestPrice] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const labtest_token = localStorage.getItem("token");
        const fetchLabTestDetails = async () => {
            try {
                const labtest_res = await axios.get(`http://localhost:8000/api/api/lab-tests/${id}/`,
                    {
                        headers: {
                            Authorization: `Token ${labtest_token}`,
                        }
                    }
                );
                setTestName(labtest_res.data.Lab_Test_Name);
                setTestPrice(labtest_res.data.Price);
                setIsLoading(false);
            }
            catch (error) {
                console.log(error);
                alert("Error fetching lab test details");
                setIsLoading(false);
            }
        };
        fetchLabTestDetails();
    }, [id]);

    const handleLabtestUpdate = async (e) => {
        e.preventDefault();
        setError("");

        if (!labtestName || !testPrice) {
            setError("Please fill all required fields");
            return;
        }

        try {
            const edit_labtest_token = localStorage.getItem("token");
            await axios.put(`http://localhost:8000/api/api/lab-tests/${id}/`,
                {
                    Lab_Test_Name: labtestName,
                    Price: testPrice
                },
                {
                    headers: { Authorization: `Token ${edit_labtest_token}` }
                }
            );
            alert("Lab Test updated successfully!");
            navigate("/admin-labtest-dashboard");
        }
        catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Error updating lab test");
        }
    }

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

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
                                <h4 className="mb-0">Edit Lab Test</h4>
                            </div>
                            <div className="card-body">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleLabtestUpdate}>
                                    <div className="mb-3">
                                        <label htmlFor="labTestName" className="form-label">
                                            Lab Test Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="labTestName"
                                            value={labtestName}
                                            onChange={(e) => setTestName(e.target.value)}
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
                                            value={testPrice}
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
                                            <i className="bi bi-arrow-left"></i> Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            <i className="bi bi-check-circle"></i> Update Test
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

export default EditLabTest;