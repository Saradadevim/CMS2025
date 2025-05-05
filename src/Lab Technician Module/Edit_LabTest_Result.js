import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Edit_LabTest_Result = () => {
    const { id } = useParams();
    const [labTestResult, setLabTestResult] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [testResult, setTestResult] = useState("");

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    useEffect(() => {
        const fetch_LabTestResult_Infp = async () => {
            try {
                const testResult_Response = await axios.get(`http://localhost:8000/api/lab-tech-bills/${id}/`, config);
                setLabTestResult(testResult_Response.data);
                setTestResult(testResult_Response.data.Lab_Test_Result);
            }
            catch (error) {
                console.log(error);
                setError("Error fetching test result details");
            }
        };
        fetch_LabTestResult_Infp();
    }, [id]);

    const handle_UpdateTestResult = async (e) => {
        e.preventDefault();
        setError("");
        if (!testResult) {
            setError("Please fill all required fields");
            return;
        }
        try {
            await axios.patch(`http://localhost:8000/api/lab-tech-bills/${id}/`,
                {
                    Lab_Test_Result: testResult
                },
                config)
            alert("Lab test result updated successfully");
            navigate("/labTech-dashboard");
        }
        catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Error updating lab test result");
        }
    };
    
    const handleLogout = () => {
        localStorage.clear(); // Clears all data from local storage
        navigate("/"); // Navigates to the root route
    };

    return (
        <div className="container mt-4">
            {/* Header with Logout Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">Edit Lab Test Result</h1>
                <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger"
                >
                    Logout
                </button>
            </div>

            {/* Card for the Form */}
            <div className="card shadow">
                <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    <h2 className="mb-0">Update Lab Test Result for Bill ID: {id}</h2>
                </div>
                <div className="card-body">
                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handle_UpdateTestResult}>
                        <div className="mb-3">
                            <label htmlFor="testResult" className="form-label">
                                Lab Test Result
                            </label>
                            <textarea
                                id="testResult"
                                className="form-control"
                                value={testResult}
                                onChange={(e) => setTestResult(e.target.value)}
                                placeholder="Enter updated lab test result"
                                rows="4"
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => navigate("/labTech-dashboard")}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn"
                                style={{ backgroundColor: '#ff6b6b', color: 'white' }}
                            >
                                Update Result
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Edit_LabTest_Result;