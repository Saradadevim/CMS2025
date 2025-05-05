import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { fetchAppointments } from '../services/apiService';
import backgroundImage from '../assets/blur-hospital.jpg';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctorName, setDoctorName] = useState('Doctor');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedView, setSelectedView] = useState('Today');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const appointmentsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAppointments('today');
                console.log('Today Appointments Response:', data);
                if (!data || !data.appointments) {
                    throw new Error('Invalid response format: No appointments data');
                }
                // Filter out submitted appointments
                const submittedAppointmentId = localStorage.getItem('submitted_appointment_id');
                const filteredAppointments = submittedAppointmentId
                    ? data.appointments.filter(
                          (appt) => appt.Appointment_ID !== parseInt(submittedAppointmentId)
                      )
                    : data.appointments;
                setAppointments(filteredAppointments || []);
                setDoctorName(data.doctor_name || 'Doctor');
                if (filteredAppointments.length === 0) {
                    setError('No appointments found for today.');
                }
                // Clear submitted_appointment_id after filtering
                if (submittedAppointmentId) {
                    localStorage.removeItem('submitted_appointment_id');
                }
            } catch (err) {
                console.error('Fetch Error Details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                });
                setError(err.response?.data?.error || 'Failed to fetch appointments');
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleViewChange = async (view) => {
        setSelectedView(view);
        setCurrentPage(1);
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAppointments(view.toLowerCase());
            console.log(`${view} Appointments Response:`, data);
            if (!data || !data.appointments) {
                throw new Error(`Invalid response format for ${view}`);
            }
            setAppointments(data.appointments || []);
            setDoctorName(data.doctor_name || 'Doctor');
            if (data.appointments.length === 0) {
                setError(`No ${view.toLowerCase()} appointments found.`);
            }
        } catch (err) {
            console.error(`Error fetching ${view} appointments:`, {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
            });
            setError(err.response?.data?.error || `Failed to fetch ${view.toLowerCase()} appointments`);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateConsultation = (appointment) => {
        localStorage.setItem('token_number', appointment.token_number);
        localStorage.setItem('appointment_id', appointment.Appointment_ID);
        localStorage.setItem('consultation_id', appointment.Consultation_ID || '');
        navigate(`/update-consultation/${appointment.Consultation_ID}`);
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
                        handleLogout={() => navigate('/')}
                    />
                )}
            </div>
            <div
                style={{
                    flex: 1,
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Navbar
                    doctorName={doctorName}
                    toggleSidebar={toggleSidebar}
                    selectedView={selectedView}
                    handleViewChange={handleViewChange}
                />
                <div
                    className="container mt-4 p-4 bg-white bg-opacity-90 rounded shadow-lg"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        minHeight: '100vh',
                    }}
                >
                    <h2 className="text-center text-primary mb-4">
                        {selectedView} Appointments
                    </h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {loading && (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading appointments...</p>
                        </div>
                    )}
                    {error && !loading && (
                        <div className="alert alert-warning text-center" role="alert">
                            {error}
                        </div>
                    )}
                    {!loading && !error && currentAppointments.length === 0 && (
                        <div className="alert alert-info text-center" role="alert">
                            No appointments found for {selectedView.toLowerCase()}.
                        </div>
                    )}
                    {!loading && currentAppointments.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Token #</th>
                                        <th>Patient Name</th>
                                        <th>Age</th>
                                        <th>Gender</th>
                                        <th>Appointment Date</th>
                                        <th>Appointment Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAppointments.map((appointment) => (
                                        <tr key={appointment.Appointment_ID}>
                                            <td>{appointment.token_number || 'N/A'}</td>
                                            <td>{appointment.patient_name}</td>
                                            <td>{appointment.patient_age}</td>
                                            <td>{appointment.patient_gender}</td>
                                            <td>{appointment.Appointment_Date}</td>
                                            <td>{appointment.Appointment_Time}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm mr-2"
                                                    onClick={() => {
                                                        localStorage.setItem('token_number', appointment.token_number);
                                                        localStorage.setItem('appointment_id', appointment.Appointment_ID);
                                                        navigate('/add-consultation');
                                                    }}
                                                >
                                                    Add Consultation
                                                </button>
                                                {appointment.Consultation_ID && (
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => handleUpdateConsultation(appointment)}
                                                    >
                                                        Update Consultation
                                                    </button>
                                                )}
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

export default DoctorDashboard;