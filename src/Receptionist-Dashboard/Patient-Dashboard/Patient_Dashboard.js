import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const Patient_Res = await axios.get("http://localhost:8000/api/patient/", config);
                setPatients(Patient_Res.data);
            } catch (error) {
                console.log(error);
                alert("Error fetching the data.... Please refer the console for more info!");
            }
        };
        fetchPatientData();
    }, []);

    const handleLogOut = () => {
        localStorage.clear();
        navigate("/");
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleViewPatient = (patientId) => {
        // Navigate to view patient details page
        navigate(`/view-patient/${patientId}`);
    };

    const handleEditPatient = (patientId) => {
        // Navigate to edit patient page
        navigate(`/edit-patient/${patientId}`);
    };

    const handleToggleStatus = async (patientId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.put(
                `http://localhost:8000/api/patient/${patientId}/status`,
                { status: !currentStatus },
                config
            );

            // Update the patient's status in the local state
            setPatients(patients.map(patient =>
                patient.Patient_ID === patientId
                    ? { ...patient, Patient_Status: !currentStatus }
                    : patient
            ));

            alert(`Patient status updated to ${!currentStatus ? 'Active' : 'Inactive'}`);
        } catch (error) {
            console.log(error);
            alert("Error updating patient status");
        }
    };

    const filteredPatients = patients.filter((patient) => {
        return (
            patient.Patient_Name.toLowerCase().includes(searchTerm) ||
            patient.Gender.toLowerCase().includes(searchTerm) ||
            patient.Age.toString().includes(searchTerm)
        );
    });

    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;

    // 🔽 Sort by Patient_ID in descending order
    const currentPatients = filteredPatients
        .sort((a, b) => b.Patient_ID - a.Patient_ID)
        .slice(indexOfFirstPatient, indexOfLastPatient);

    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid mt-4" style={{ backgroundColor: '#F1EDEB' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Patient Management</h2>
                <div>
                    <button
                        onClick={() => navigate('/recep-dashboard')}
                        className="btn btn-secondary mr-2"
                    >
                        <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <button
                        onClick={() => navigate('/add-patient')}
                        className="btn btn-success mr-2"
                    >
                        <i className="fas fa-user-plus"></i> Add Patient
                    </button>
                    <button onClick={handleLogOut} className="btn btn-danger">
                        Logout
                    </button>
                </div>
            </div>

            {/* Rest of your existing code remains the same */}
            <div className="card shadow mb-4" style={{ backgroundColor: '#D7C4B5' }}>
                <div className="card-header py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#483C32' }}>
                    <h6 className="m-0 font-weight-bold text-white">Patient List</h6>
                    <div className="input-group" style={{ width: '300px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search patients..."
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Date of Birth</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Blood Group</th>
                                    <th>Actions</th> {/* Status column removed */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentPatients.length > 0 ? (
                                    currentPatients.map((patient) => (
                                        <tr key={patient.Patient_ID}>
                                            <td>{patient.Patient_Name}</td>
                                            <td>
                                                {new Date(patient.Date_Of_Birth).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td>{patient.Age}</td>
                                            <td>{patient.Gender}</td>
                                            <td>{patient.Blood_Group}</td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleViewPatient(patient.Patient_ID)}
                                                    >
                                                        <i className="fas fa-eye"></i> View
                                                    </button>
                                                    <button
                                                        className="btn btn-warning btn-sm mx-1"
                                                        onClick={() => handleEditPatient(patient.Patient_ID)}
                                                    >
                                                        <i className="fas fa-edit"></i> Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No patients found</td> {/* Updated colSpan from 7 to 6 */}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredPatients.length > patientsPerPage && (
                        <nav>
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        style={{ color: 'white', backgroundColor: '#dc3545' }}
                                        onClick={() => paginate(currentPage - 1)}
                                    >
                                        Previous
                                    </button>
                                </li>

                                {[...Array(totalPages).keys()].map(number => (
                                    <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                        <button
                                            className="page-link"
                                            style={{ color: 'white', backgroundColor: '#dc3545' }}
                                            onClick={() => paginate(number + 1)}
                                        >
                                            {number + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        style={{ color: 'white', backgroundColor: '#dc3545' }}
                                        onClick={() => paginate(currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
}
export default PatientDashboard;