import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchUpcomingAppointments } from '../services/apiService';
import backgroundImage from '../assets/blur-hospital.jpg'; // Import the background image

const UpcomingAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSidebar, setShowSidebar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const appointmentsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchUpcomingAppointments();
                setAppointments(data.appointments); // Set appointments from the response
                setDoctorName(data.doctor_name); // Set doctor's name from the response
                setError(null);
            } catch (err) {
                setError('Failed to fetch upcoming appointments');
                console.error('Error fetching upcoming appointments:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const filteredAppointments = appointments.filter((appointment) =>
        Object.values(appointment).some((value) =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments
        .sort((a, b) => b.Appointment_ID - a.Appointment_ID)
        .slice(indexOfFirstAppointment, indexOfLastAppointment);

    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div
            style={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: `url(${backgroundImage})`, // Add background image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {showSidebar && (
                <Sidebar
                    doctorName={doctorName}
                    toggleSidebar={toggleSidebar}
                    handleLogout={handleLogout}
                />
            )}
            <div style={{ flex: 1 }}>
                <Navbar
                    toggleSidebar={toggleSidebar}
                    selectedView="Upcoming"
                    handleViewChange={(view) => navigate(`/${view.toLowerCase()}-appointments`)}
                    showSidebar={showSidebar}
                />
                <div className="container mt-4 p-4 bg-white bg-opacity-90 rounded shadow-lg">
                    <h2 className="text-center text-primary mb-4">Upcoming Appointments</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {loading && <p className="text-center text-primary">Loading...</p>}
                    {error && <p className="text-center text-danger">{error}</p>}
                    {!loading && !error && (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Patient Name</th>
                                        <th>Reg. Number</th>
                                        <th>Age</th>
                                        <th>Gender</th>
                                        <th>Department</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAppointments.length > 0 ? (
                                        currentAppointments.map((appointment) => (
                                            <tr key={appointment.Appointment_ID}>
                                                <td>{appointment.Appointment_ID}</td>
                                                <td>{appointment.patient_name}</td>
                                                <td>{appointment.patient_registration_number}</td>
                                                <td>{appointment.patient_age}</td>
                                                <td>{appointment.patient_gender}</td>
                                                <td>{appointment.doctor_department}</td>
                                                <td>{appointment.Appointment_Date}</td>
                                                <td>{appointment.Appointment_Time}</td>
                                                <td>{appointment.Status}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => navigate(`/patienthistory/${appointment.Appointment_ID}`)} // Redirect to PatientHistory.js
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center text-muted">
                                                No appointments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                            {[...Array(totalPages).keys()].map((number) => (
                                <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                    <button
                                        onClick={() => paginate(number + 1)}
                                        className="page-link"
                                    >
                                        {number + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default UpcomingAppointments;