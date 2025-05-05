import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchLabTestResults } from '../services/apiService';

const LabTestResults = () => {
    const [result, setResult] = useState(null);
    const [tokenNumber, setTokenNumber] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedView, setSelectedView] = useState('Today');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await fetchLabTestResults(tokenNumber);
            setResult(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch lab test results');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
                    doctorName="Dr. John Doe"
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
                <h2 className="text-2xl font-bold mb-4">Lab Test Results</h2>
                <div className="flex space-x-4 mb-4">
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Enter token number..."
                        value={tokenNumber}
                        onChange={(e) => setTokenNumber(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {result && !loading && !error && (
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold">Lab Test Result</h3>
                        <p>Bill ID: {result.Lab_Tech_Bill_ID}</p>
                        <p>Token: {result.token_number}</p>
                        <p>Patient: {result.patient_details.patient_name}</p>
                        <p>Date: {result.consultation_date}</p>
                        <div>
                            <h4 className="font-medium">Tests:</h4>
                            <ul className="list-disc pl-5">
                                {result.lab_tests.map((test, index) => (
                                    <li key={index}>{test.Lab_Test_Name}</li>
                                ))}
                            </ul>
                        </div>
                        <p>Result: {result.Lab_Test_Result}</p>
                        <p>Fees: {result.Lab_Test_Fees}</p>
                        <p>Service Charge: {result.Service_Charge}</p>
                        <p>Total: {result.Total_Fees}</p>
                    </div>
                )}
                {!result && !loading && !error && <p>Enter a token number to view results.</p>}
            </div>
        </div>
    );
};

export default LabTestResults;