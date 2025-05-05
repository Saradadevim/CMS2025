import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ResultAndBill_Dashboard = () => {
    const [labTechBills, setLabTechBills] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    

    useEffect(() => {
        const fetch_labTestBills = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const labTestBills_Res = await axios.get("http://localhost:8000/api/lab-tech-bills/", config);
                setLabTechBills(labTestBills_Res.data);
            } catch (error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
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

        fetch_labTestBills();
        fetch_labTests();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredSearch = labTechBills.filter((labbill) => {
        const term = searchTerm.toLowerCase();
        const patientName = labbill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.patient_info?.Patient_Name?.toLowerCase() ?? '';
        const doctorName = labbill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.doctor_info?.Doctor_Name?.toLowerCase() ?? '';
        const appointmentDate = labbill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.Appointment_Date?.toLowerCase() ?? '';
        const labTestNames = labbill.consultation_info?.Lab_Tests?.map(id => {
            const test = labTests.find(test => test.LabTest_ID === id);
            return test ? test.Lab_Test_Name.toLowerCase() : '';
        }).join(', ') ?? '';
        const labTestResult = labbill.Lab_Test_Result?.toLowerCase() ?? '';
        const tokenNumber = labbill.consultation_info?.token_info?.Token_Number?.toLowerCase() ?? '';

        return (
            patientName.includes(term) ||
            doctorName.includes(term) ||
            appointmentDate.includes(term) ||
            labTestNames.includes(term) ||
            labTestResult.includes(term) ||
            tokenNumber.includes(term)
        );
    });

    const getLabTestNames = (labTestIds) => {
        if (!labTestIds || labTestIds.length === 0) return 'N/A';
        const names = labTestIds.map(id => {
            const test = labTests.find(test => test.LabTest_ID === id);
            return test ? test.Lab_Test_Name : 'Unknown';
        });
        return names.join(', ');
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Lab Technician Dashboard</h2>
                <div>
                    <button 
                        className="btn btn-success me-2" 
                        onClick={() => navigate("/add-labtest-result")}
                    >
                        Add Lab Test Result
                    </button>
                    <button 
                        className="btn btn-danger" 
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    value={searchTerm}
                />
            </div>

            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Patient Name</th>
                        <th>Doctor Name</th>
                        <th>Appointment Date</th>
                        <th>Token Number</th>
                        <th>Lab Tests</th>
                        <th>Lab Test Result</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSearch.length > 0 ? (
                        filteredSearch.map((labbill) => (
                            <tr key={labbill.Lab_Tech_Bill_ID}>
                                <td>{labbill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.patient_info?.Patient_Name ?? 'N/A'}</td>
                                <td>{labbill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.doctor_info?.Doctor_Name ?? 'N/A'}</td>
                                <td>{labbill.consultation_info?.token_info?.appointmentBill_info?.appointment_info?.Appointment_Date ?? 'N/A'}</td>
                                <td>{labbill.consultation_info?.token_info?.Token_Number ?? 'N/A'}</td>
                                <td>{getLabTestNames(labbill.consultation_info?.Lab_Tests) ?? 'N/A'}</td>
                                <td>{labbill.Lab_Test_Result ?? 'N/A'}</td>
                                <td>
                                    <Link to={`/view-labtest-resultBill/${labbill.Lab_Tech_Bill_ID}`} className="btn btn-primary btn-sm me-1">View</Link>
                                    <Link to={`/edit-labtest-result/${labbill.Lab_Tech_Bill_ID}`} className="btn btn-warning btn-sm">Edit</Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No records found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ResultAndBill_Dashboard;