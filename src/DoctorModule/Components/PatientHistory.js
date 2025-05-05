import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchPatientHistory } from '../services/apiService';
import backgroundImage from '../assets/blur-hospital.jpg';

const PatientHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [searchType, setSearchType] = useState('token_number'); // To handle search type
    const [searchTerm, setSearchTerm] = useState(''); // To handle search term
    const [viewMode, setViewMode] = useState(false); // To toggle between patient list and history view
    const navigate = useNavigate();

    const fetchHistory = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPatientHistory(params);
            setHistory(data.results || []);
            setViewMode(true); // Switch to history view
        } catch (err) {
            setError('Failed to fetch patient history. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchTerm) {
            setError('Please enter a valid search term.');
            return;
        }
        const params = {};
        if (searchType === 'token_number') params.token_number = searchTerm;
        if (searchType === 'registration_number') params.registration_number = searchTerm;
        fetchHistory(params);
    };

    const handleBackToSearch = () => {
        setViewMode(false);
        setHistory([]);
        setSearchTerm('');
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div
            className="min-vh-100 d-flex"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {showSidebar && (
                <Sidebar
                    doctorName={localStorage.getItem('doctorName') || 'Unknown Doctor'}
                    toggleSidebar={toggleSidebar}
                    handleLogout={handleLogout}
                />
            )}
            <div className="flex-grow-1">
                <Navbar
                    toggleSidebar={toggleSidebar}
                    showSidebar={showSidebar}
                />
                <div className="container mt-4 p-4 bg-white bg-opacity-90 rounded shadow-lg">
                    <h2 className="text-center text-primary mb-4">Patient History</h2>
                    {!viewMode ? (
                        <>
                            <div className="mb-4 d-flex gap-3">
                                <select
                                    className="form-control"
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                >
                                    <option value="token_number">Token Number</option>
                                    <option value="registration_number">Registration Number</option>
                                </select>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Search by ${searchType.replace('_', ' ')}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                            {loading && <p className="text-center text-primary">Loading...</p>}
                            {error && <p className="text-center text-danger">{error}</p>}
                        </>
                    ) : (
                        <>
                            <button
                                className="btn btn-secondary mb-3"
                                onClick={handleBackToSearch}
                            >
                                Back to Search
                            </button>
                            {loading && <p className="text-center text-primary">Loading...</p>}
                            {error && <p className="text-center text-danger">{error}</p>}
                            {!loading && !error && (
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Consultation ID</th>
                                                <th>Token</th>
                                                <th>Date</th>
                                                <th>Doctor</th>
                                                <th>Patient</th>
                                                <th>Notes</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.length > 0 ? (
                                                history.map((record) => (
                                                    <tr key={record.Consultation_ID}>
                                                        <td>{record.Consultation_ID}</td>
                                                        <td>{record.token_number}</td>
                                                        <td>{record.consultation_date}</td>
                                                        <td>{record.doctor_details.doctor_name}</td>
                                                        <td>{record.patient_details.patient_name}</td>
                                                        <td>{record.clinical_notes}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/view-consultation/${record.Consultation_ID}`
                                                                    )
                                                                }
                                                            >
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center text-muted">
                                                        No history found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientHistory;