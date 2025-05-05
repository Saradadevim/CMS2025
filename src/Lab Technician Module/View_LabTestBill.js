import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const View_LabTestBill = () => {
    const {id} = useParams();
    const [labTechBill, setLabTechBill] = useState(null);
    const [labTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch_LabTestResultBill = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const labTestBills_Res = await axios.get(`http://localhost:8000/api/lab-tech-bills/${id}`, config);
                setLabTechBill(labTestBills_Res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };

        const fetch_labTests = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const labTests_Res = await axios.get("http://127.0.0.1:8000/api/lab-tests/", config);
                setLabTests(labTests_Res.data);
            } catch (error) {
                console.log(error);
                alert("Error fetching lab tests... Please refer to the console for more info!");
            }
        };
        fetch_labTests();
        fetch_LabTestResultBill();
    }, [id]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const adjustedHour = hour % 12 || 12;
        return `${adjustedHour}:${minutes} ${period}`;
    };

    // Parse test results to map test names to actual values
    const parseTestResults = (resultString) => {
        if (!resultString) return {};
        const results = {};
        resultString.split('\n').forEach(line => {
            const parts = line.split('-').map(part => part.trim());
            if (parts.length >= 4) {
                results[parts[0].trim()] = parts[3];
            }
        });
        return results;
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!labTechBill) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Failed to load lab test result and bill data.
                </div>
            </div>
        );
    }

    const testResults = parseTestResults(labTechBill.Lab_Test_Result);
    console.log(testResults);
    const labTestsData = labTechBill.lab_tests_info || [];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Lab Test Bill Details - ID: {id}</h2>
                <div>
                    <button className="btn btn-secondary me-2" onClick={() => navigate('/labTech-dashboard')}>Back</button>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Patient Information</h5>
                    <p><strong>Name:</strong> {labTechBill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.patient_info?.Patient_Name ?? 'N/A'}</p>
                    <p><strong>Address:</strong> {labTechBill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.patient_info?.Address ?? 'N/A'}</p>
                    <p><strong>Gender:</strong> {labTechBill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.patient_info?.Gender ?? 'N/A'}</p>
                    <p><strong>Blood Group:</strong> {labTechBill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.patient_info?.Blood_Group ?? 'N/A'}</p>

                    <h5 className="card-title mt-4">Doctor Information</h5>
                    <p><strong>Name:</strong> {labTechBill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.doctor_info?.Doctor_Name ?? 'N/A'}</p>
                    <p><strong>Department:</strong> {labTechBill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.doctor_info?.department_info?.Department_Name ?? 'N/A'}</p>

                    <h5 className="card-title mt-4">Appointment Details</h5>
                    <p><strong>Date:</strong> {formatDate(labTechBill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.Appointment_Date) ?? 'N/A'}</p>
                    <p><strong>Time:</strong> {formatTime(labTechBill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.Appointment_Time) ?? 'N/A'}</p>
                    <p><strong>Token Number:</strong> {labTechBill.consultation_info?.token_info?.Token_Number ?? 'N/A'}</p>

                    <h5 className="card-title mt-4">Lab Test Details</h5>
                    <div className="mb-3">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Lab Test Name</th>
                                    <th>Price</th>
                                    <th>Normal Range</th>
                                    <th>Actual Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labTestsData.map((test, index) => (
                                    <tr key={index}>
                                        <td>{test.Lab_Test_Name}</td>
                                        <td>₹{test.Price}</td>
                                        <td>{test.Normal_Range}</td>
                                        <td>{testResults[`${test.Lab_Test_Name}`] || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p><strong>Fees:</strong> ₹{labTechBill.Lab_Test_Fees ?? 'N/A'}</p>
                    <p><strong>Service Charge:</strong> ₹{labTechBill.Service_Charge ?? 'N/A'}</p>
                    <p><strong>Total Fees:</strong> ₹{labTechBill.Total_Fees ?? 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default View_LabTestBill;