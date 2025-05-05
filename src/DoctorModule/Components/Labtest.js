import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchLabTests } from '../services/apiService';
import backgroundImage from '../assets/blur-hospital.jpg';

const LabTests = () => {
    const [labTests, setLabTests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedView, setSelectedView] = useState('Today');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const testsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = { search: searchTerm };
                if (availableOnly) params.available = true;
                const data = await fetchLabTests(params);
                setLabTests(data.results || []);
                setError(null);
            } catch (err) {
                setError('Failed to fetch lab tests');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchTerm, availableOnly]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    // No, you don't need to define `handleViewChange` here again if it's already implemented in `Navbar.js`.
    // Instead, you can pass it as a prop to the `Navbar` component and use it there.

    // Pagination logic
    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = labTests.slice(indexOfFirstTest, indexOfLastTest);

    const totalPages = Math.ceil(labTests.length / testsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div
            className="min-vh-100 d-flex flex-column"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {showSidebar && (
                <Sidebar
                    doctorName="Dr. John Doe"
                    toggleSidebar={toggleSidebar}
                    handleLogout={handleLogout}
                />
            )}
            <div className="flex-grow-1">
                <Navbar
                    toggleSidebar={toggleSidebar}
                    selectedView={selectedView}
                    showSidebar={showSidebar}
                />
                <div className="container mt-4">
                    <div className="p-4 bg-white bg-opacity-90 rounded shadow-lg">
                        <h2 className="text-center text-primary mb-4">Lab Tests</h2>
                        <div className="mb-4 d-flex flex-wrap gap-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by test name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <label className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    checked={availableOnly}
                                    onChange={() => setAvailableOnly(!availableOnly)}
                                    className="me-2"
                                />
                                Available Only
                            </label>
                        </div>
                        {loading && <p className="text-center text-primary">Loading...</p>}
                        {error && <p className="text-danger text-center">{error}</p>}
                        {!loading && !error && (
                            <div className="table-container">
                                <table className="table table-striped table-hover">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>#</th>
                                            <th>Test Name</th>
                                            <th>Price</th>
                                            <th>Normal Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTests.length > 0 ? (
                                            currentTests.map((test, index) => (
                                                <tr key={test.LabTest_ID}>
                                                    <td>{indexOfFirstTest + index + 1}</td>
                                                    <td>{test.Lab_Test_Name}</td>
                                                    <td>{test.Price}</td>
                                                    <td>{test.Normal_Range}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted">
                                                    No lab tests found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        {[...Array(totalPages).keys()].map((number) => (
                                            <li
                                                key={number + 1}
                                                className={`page-item ${
                                                    currentPage === number + 1 ? 'active' : ''
                                                }`}
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabTests;