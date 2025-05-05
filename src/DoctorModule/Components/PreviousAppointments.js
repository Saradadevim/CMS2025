import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchPreviousAppointments } from '../services/apiService';
import backgroundImage from '../assets/blur-hospital.jpg';

const PreviousAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctorName, setDoctorName] = useState('Doctor');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSidebar, setShowSidebar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const appointmentsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to view previous appointments');
            navigate('/');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {};
                if (startDate) params.start_date = startDate;
                if (endDate) params.end_date = endDate;
                const data = await fetchPreviousAppointments(params);
                console.log('Previous Appointments Response:', data);
                if (!data || !data.appointments) {
                    throw new Error('Invalid response format: No appointments data');
                }
                setAppointments(data.appointments || []);
                setDoctorName(data.doctor_name || 'Doctor');
                if (data.appointments.length === 0) {
                    setError('No previous appointments found for the selected date range.');
                }
            } catch (err) {
                console.error('Fetch Error Details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                });
                setError(err.response?.data?.error || 'Failed to fetch previous appointments');
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [startDate, endDate, navigate]);

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
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div
                style={{
                    width: showSidebar ? '25%' : '0',
                    transition: 'width 0.3s ease',
                    overflow: 'hidden',
                }}
            >
                {showSidebar && (
                    <Sidebar
                        doctorName={doctorName}
                        toggleSidebar={toggleSidebar}
                        handleLogout={handleLogout}
                    />
                )}
            </div>
            <div style={{ flex: 1, transition: 'margin-left 0.3s ease' }}>
                <Navbar
                    toggleSidebar={toggleSidebar}
                    selectedView="Previous"
                    handleViewChange={(view) => navigate(`/${view.toLowerCase()}-appointments`)}
                    showSidebar={showSidebar}
                />
                <div className="container mt-4 p-4 bg-white bg-opacity-90 rounded shadow-lg">
                    <h2 className="text-center text-primary mb-4">Previous Appointments</h2>
                    <div className="mb-4 d-flex gap-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Start Date"
                            value={startDate}
                            onChange={(e) => {
                                setCurrentPage(1); // Reset pagination
                                setStartDate(e.target.value);
                            }}
                        />
                        <input
                            type="date"
                            className="form-control"
                            placeholder="End Date"
                            value={endDate}
                            onChange={(e) => {
                                setCurrentPage(1); // Reset pagination
                                setEndDate(e.target.value);
                            }}
                        />
                    </div>
                    {loading && (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading previous appointments...</p>
                        </div>
                    )}
                    {error && !loading && (
                        <div className="alert alert-warning text-center" role="alert">
                            {error}
                        </div>
                    )}
                    {!loading && !error && currentAppointments.length === 0 && (
                        <div className="alert alert-info text-center" role="alert">
                            No previous appointments found.
                        </div>
                    )}
                    {!loading && currentAppointments.length > 0 && (
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
                                    {currentAppointments.map((appointment) => (
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
                                                    onClick={() => navigate(`/view-consultation/${appointment.Appointment_ID}`)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {totalPages > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                {[...Array(totalPages).keys()].map((number) => (
                                    <li
                                        key={number + 1}
                                        className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                                    >
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviousAppointments;