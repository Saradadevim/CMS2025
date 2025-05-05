import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Add_LabResultBill = () => {
    const [consultationID, setConsultationID] = useState("");
    const [usedTokens, setUsedTokens] = useState([]); // Changed from null to []
    const [consultation, setConsultation] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [tokenNumber, setTokenNumber] = useState([]);
    const navigate = useNavigate();
    const [testResult, setTestResult] = useState("");
    const [selectedToken, setSelectedToken] = useState("");
    const [patientName, setPatientName] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [selectedLabTests, setSelectedLabTests] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResults, setTestResults] = useState({}); // Stores actual values for each test

    // Compute available tokens (not used in lab tech bills)
    const availableTokens = tokenNumber.filter(token => !usedTokens.includes(token));

    useEffect(() => {
        const fetch_usedTokens = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const labTestBills_Res = await axios.get("http://localhost:8000/api/lab-tech-bills/", config);
                setUsedTokens(labTestBills_Res.data.map(bill => bill.consultation_info.token_info.Token_Number));
            } catch (error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetch_usedTokens();

        const fetch_tokenNumbers = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const token_response = await axios.get("http://127.0.0.1:8000/api/token/", config);
                if (token_response.data && token_response.data.length > 0) {
                    const tokenNumbers = token_response.data.map(item => item.Token_Number);
                    setTokenNumber(tokenNumbers);
                }
            } catch (error) {
                console.log(error);
                alert("Error fetching token numbers... Please refer to the console for more info!");
            }
        };
        fetch_tokenNumbers();

        const fetch_ConsultationData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const consultation_response = await axios.get("http://127.0.0.1:8000/api/consultations/", config);
                setConsultation(consultation_response.data.consultation || []);
            } catch (error) {
                console.log(error);
                alert("Error fetching consultation records... Please refer to the console for more info!");
            }
        };
        fetch_ConsultationData();

        const fetch_LabTests = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const labTests_responses = await axios.get("http://127.0.0.1:8000/api/lab-tests/", config);
                setLabTests(labTests_responses.data);
            } catch (error) {
                console.log(error);
                alert("Error fetching lab test records... Please refer to the console for more info!");
            }
        };
        fetch_LabTests();
    }, []);

    useEffect(() => {
        if (selectedToken && consultation.length > 0) {
            const selectedConsultation = consultation.find(c =>
                c.token_info?.Token_Number === selectedToken
            );
            if (selectedConsultation) {
                setConsultationID(selectedConsultation.Consultation_ID || "");
                setPatientName(selectedConsultation.token_info?.appointmentBill_info?.appointment_info?.patient_info?.Patient_Name || "");
                setDoctorName(selectedConsultation.token_info?.appointmentBill_info?.appointment_info?.doctor_info?.Doctor_Name || "");
                setDepartmentName(selectedConsultation.token_info?.appointmentBill_info?.appointment_info?.doctor_info?.department_info?.Department_Name || "");
                setAppointmentDate(selectedConsultation.token_info?.appointmentBill_info?.appointment_info?.Appointment_Date || "");
                setAppointmentTime(selectedConsultation.token_info?.appointmentBill_info?.appointment_info?.Appointment_Time || "");
                const labTestIds = selectedConsultation.Lab_Tests || [];
                const labTestDetails = labTests.filter(test => labTestIds.includes(test.LabTest_ID));
                setSelectedLabTests(labTestDetails);
            }
        }
    }, [selectedToken, consultation, labTests]);

    // Auto-generate the lab test result string
    const generateTestResultString = () => {
        return selectedLabTests.map(test => {
            const actualValue = testResults[test.LabTest_ID] || "";
            return `${test.Lab_Test_Name} - ${test.Normal_Range} - ${actualValue}`;
        }).join("\n");
    };

    // Update the test result whenever testResults or selectedLabTests changes
    useEffect(() => {
        setTestResult(generateTestResultString());
    }, [testResults, selectedLabTests]);

    const handleActualValueChange = (testId, value) => {
        setTestResults(prev => ({
            ...prev,
            [testId]: value
        }));
    };

    const handle_AddLabTest_ResultBill = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            
            const new_LabResult_response = await axios.post("http://localhost:8000/api/lab-tech-bills/", {
                Consultation: consultationID,
                Lab_Test_Result: testResult // This now contains the auto-generated string
            }, config);
            
            if (new_LabResult_response.status === 201) {
                alert("Lab test result and bill added successfully!");
                navigate("/labTech-dashboard");
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (error) {
            console.log(error);
            alert("Error adding the lab test result... Please refer to the console for more info!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    <h2 className="mb-0">Add Lab Test Result and Bill</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handle_AddLabTest_ResultBill}>
                        {/* Token Selection */}
                        <div className="mb-3">
                            <label htmlFor="tokenSelect" className="form-label">Token Number</label>
                            <select
                                id="tokenSelect"
                                className="form-select"
                                value={selectedToken}
                                onChange={(e) => setSelectedToken(e.target.value)}
                                required
                            >
                                <option value="">Select token number</option>
                                {availableTokens.map((token, index) => (
                                    <option key={`token-${index}`} value={token}>
                                        {token}
                                    </option>
                                ))}
                            </select>
                        </div>
    
                        {/* Consultation ID */}
                        <div className="mb-3">
                            <label htmlFor="consultationId" className="form-label">Consultation ID</label>
                            <input
                                id="consultationId"
                                type="text"
                                className="form-control"
                                value={consultationID}
                                onChange={(e) => setConsultationID(e.target.value)}
                                placeholder="Enter Consultation ID"
                                required
                            />
                        </div>
    
                        {/* Patient Information Section */}
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="text-muted">Patient Information</h5>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Patient Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={patientName}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Doctor Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={doctorName}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Department</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={departmentName}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Appointment Date</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={appointmentDate}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Appointment Time</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={appointmentTime}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
    
                        {/* Lab Tests Table */}
                        {selectedLabTests.length > 0 && (
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-muted mb-0">Lab Tests</h5>
                                    <span className="badge bg-primary">
                                        {selectedLabTests.length} test(s) selected
                                    </span>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th width="30%">Test Name</th>
                                                <th width="25%">Actual Value</th>
                                                <th width="25%">Normal Range</th>
                                                <th width="20%">Lab Test Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedLabTests.map((test) => (
                                                <tr key={`test-${test.LabTest_ID}`}>
                                                    <td className="align-middle">
                                                        <strong>{test.Lab_Test_Name}</strong>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={testResults[test.LabTest_ID] || ""}
                                                            onChange={(e) => 
                                                                handleActualValueChange(test.LabTest_ID, e.target.value)
                                                            }
                                                            placeholder="Enter value"
                                                            required
                                                            aria-label={`Enter value for ${test.Lab_Test_Name}`}
                                                        />
                                                    </td>
                                                    <td className="align-middle">
                                                        <span className="text-muted">{test.Normal_Range}</span>
                                                    </td>
                                                    <td className="align-middle">
                                                        <span className="text-muted">₹{test.Price}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
    
                        {/* Lab Test Results */}
                        <div className="mb-4">
                            <label htmlFor="labTestResult" className="form-label">
                                <h5 className="text-muted">Lab Test Result</h5>
                            </label>
                            <textarea
                                id="labTestResult"
                                className="form-control font-monospace"
                                value={selectedLabTests.map(test => {
                                    const actualValue = testResults[test.LabTest_ID] || "";
                                    return `${test.Lab_Test_Name} - ${test.Normal_Range} - ${actualValue}`;
                                }).join("\n")}
                                readOnly
                                rows={Math.min(10, selectedLabTests.length + 1)}
                                style={{ 
                                    whiteSpace: 'pre',
                                    minHeight: '120px'
                                }}
                                aria-describedby="resultHelp"
                            />
                            <div id="resultHelp" className="form-text">
                                Results are auto-generated in format: Test - [Normal Range] - Actual Value
                            </div>
                        </div>
    
                        {/* Form Actions */}
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => navigate("/labTech-dashboard")}
                                style={{ minWidth: '100px' }}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-danger"
                                style={{ minWidth: '180px' }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-file-earmark-medical me-2"></i>
                                        Add Lab Test Result
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Add_LabResultBill;