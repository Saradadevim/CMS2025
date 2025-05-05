import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchMedicines } from '../services/apiService';
import backgroundImage from '../assets/blur-hospital.jpg';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedView, setSelectedView] = useState('Today');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const medicinesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchMedicines(searchTerm); // Pass search term to the API
                setMedicines(data.results || []);
                setError(null);
            } catch (err) {
                setError('Failed to fetch medicines');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchTerm]); // Refetch data when search term changes

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };


    // Pagination logic
    const indexOfLastMedicine = currentPage * medicinesPerPage;
    const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
    const currentMedicines = medicines.slice(indexOfFirstMedicine, indexOfLastMedicine);

    const totalPages = Math.ceil(medicines.length / medicinesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div
            className="min-h-screen d-flex"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {showSidebar && (
                <Sidebar
                    doctorName="Dr. John Doe" // Replace with dynamic doctor name
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
                <div className="container mt-4 p-4 bg-white bg-opacity-90 rounded shadow-lg">
                    <h2 className="text-center text-primary mb-4">Medicines</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by medicine name, generic name, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {loading && <p className="text-center text-primary">Loading...</p>}
                    {error && <p className="text-danger text-center">{error}</p>}
                    {!loading && !error && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Generic Name</th>
                                        <th>Company</th>
                                        <th>Price</th>
                                        <th>Dosage</th>
                                        <th>Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentMedicines.length > 0 ? (
                                        currentMedicines.map((medicine, index) => (
                                            <tr key={medicine.Medicine_ID}>
                                                <td>{indexOfFirstMedicine + index + 1}</td>
                                                <td>{medicine.Medicine_Name}</td>
                                                <td>{medicine.Generic_Name}</td>
                                                <td>{medicine.Company_Name}</td>
                                                <td>{medicine.Price_Per_Unit}</td>
                                                <td>{medicine.Dosage}</td>
                                                <td>
                                                    {medicine.stock_info ? (
                                                        medicine.stock_info.Is_Available ? (
                                                            `${medicine.stock_info.Available_Stock} units`
                                                        ) : (
                                                            'Out of Stock'
                                                        )
                                                    ) : (
                                                        'No Stock Info'
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted">
                                                No medicines found.
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
    );
};

export default Medicines;