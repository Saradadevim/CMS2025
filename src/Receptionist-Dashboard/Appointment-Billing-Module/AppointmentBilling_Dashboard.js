import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Appointment_Billing_Dashboard = () => {
    const [appointmentBilling, setAppointmentBilling] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const billingPerPage = 4;
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const billing_response = await axios.get("http://localhost:8000/api/appointment_billings/", config);
                setAppointmentBilling(billing_response.data);
            } catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetchBillingData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredBilling = appointmentBilling.filter((bill) => {
        return (
            bill.appointment_info?.patient_info?.Patient_Name.toLowerCase().includes(searchTerm) ||
            bill.appointment_info?.doctor_info?.Doctor_Name.toLowerCase().includes(searchTerm) ||
            bill.appointment_info?.Appointment_Date.toLowerCase().includes(searchTerm) ||
            bill.appointment_info?.Status.toLowerCase().includes(searchTerm) ||
            bill.Payment_Status.toLowerCase().includes(searchTerm)
        );
    });

    const indexOfLastBilling = currentPage * billingPerPage;
    const indexOfFirstBilling = indexOfLastBilling - billingPerPage;

    const currentBillings = filteredBilling
        .sort((a, b) => b.Appointment_Billing_ID - a.Appointment_Billing_ID)
        .slice(indexOfFirstBilling, indexOfLastBilling);

    const totalPages = Math.ceil(filteredBilling.length / billingPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Appointment Billing Dashboard</h2>
                <div>
                    <button className="btn btn-secondary me-2" onClick={() => navigate('/recep-dashboard')}>
                        Back
                    </button>
                    <button className="btn btn-primary me-2" onClick={() => navigate('/bill-by-name')}>
                        Bill By Name
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>



            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Patient, Doctor, Date, Status, Payment Status..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Patient Name</th>
                            <th>Doctor Name</th>
                            <th>Department</th>
                            <th>Appointment Date</th>
                            <th>Status</th>
                            <th>Consultation Fee</th>
                            <th>Service Charge</th>
                            <th>Total Charge</th>
                            <th>Payment Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBillings.length > 0 ? currentBillings.map((bill) => (
                            <tr key={bill.Appointment_Billing_ID}>
                                <td>{bill.Appointment_Billing_ID}</td>
                                <td>{bill.appointment_info.patient_info.Patient_Name}</td>
                                <td>{bill.appointment_info.doctor_info.Doctor_Name}</td>
                                <td>{bill.appointment_info.doctor_info.department_info.Department_Name}</td>
                                <td>{bill.appointment_info.Appointment_Date}</td>
                                <td>{bill.appointment_info.Status}</td>
                                <td>₹{bill.Consultation_Fee}</td>
                                <td>₹{bill.Service_Charge}</td>
                                <td>₹{bill.Total_Charge}</td>
                                <td className={bill.Payment_Status === 'Pending' ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                                    {bill.Payment_Status}
                                </td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button
                                            className="btn btn-primary btn-sm me-1"
                                            onClick={() => navigate(`/view-bill/${bill.Appointment_Billing_ID}`)}
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => navigate(`/edit-bill/${bill.Appointment_Billing_ID}`)}
                                        >
                                            Edit
                                        </button>

                                        <button className="btn btn-danger btn-sm">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="11" className="text-center text-muted">No billing records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <nav>
                <ul className="pagination justify-content-center">
                    {[...Array(totalPages).keys()].map((number) => (
                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(number + 1)} className="page-link">
                                {number + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Appointment_Billing_Dashboard;