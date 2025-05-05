import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchConsultation } from '../services/apiService';

const ViewConsultation = () => {
    const [consultation, setConsultation] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedView, setSelectedView] = useState('Today');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchConsultation(id);
                setConsultation(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch consultation');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleViewChange = (view) => {
        setSelectedView(view);
        const routes = {
            Today: '/doctor-dashboard',
            Tomorrow: '/tomorrow-appointments',
            Upcoming: '/upcoming-appointments',
            Previous: '/previous-appointments',
        };
        navigate(routes[view]);
    };

    return (
        <div className="relative min-h-screen bg-gray-100">
            {showSidebar && (
                <Sidebar
                    toggleSidebar={toggleSidebar}
                    handleLogout={handleLogout}
                />
            )}
            <Navbar
                toggleSidebar={toggleSidebar}
                selectedView={selectedView}
                handleViewChange={handleViewChange}
                showSidebar={showSidebar}
            />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Consultation Details</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {consultation && !loading && !error && (
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold">Consultation ID: {consultation.Consultation_ID}</h3>
                        <p>Token: {consultation.token_number}</p>
                        <p>Doctor: {consultation.doctor_name}</p>
                        <p>Department: {consultation.department}</p>
                        <p>Patient: {consultation.patient_details.patient_name}</p>
                        <p>Notes: {consultation.notes}</p>
                        <div>
                            <h4 className="font-medium">Medicines:</h4>
                            <ul className="list-disc pl-5">
                                {consultation.medicines.map((med, index) => (
                                    <li key={index}>
                                        {med.Medicine_Name} - {med.Dosage}, {med.Frequency}, {med.No_of_Days}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium">Lab Tests:</h4>
                            <ul className="list-disc pl-5">
                                {consultation.lab_tests.map((test, index) => (
                                    <li key={index}>{test}</li>
                                ))}
                            </ul>
                        </div>
                        <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
                            onClick={() => navigate(`/update-consultation/${consultation.Consultation_ID}`)}
                        >
                            Update Consultation
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewConsultation;