import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminMedicineDashboard = () => {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetch_MedicineData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                const Medicine_Data = await axios.get("http://localhost:8000/api/api/medicines/", config);
                setMedicines(Medicine_Data.data);
            }
            catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetch_MedicineData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredMedicines = medicines.filter((tablet) => {
        return (
            tablet.Medicine_Name.toLowerCase().includes(searchTerm) ||
            tablet.Generic_Name.toLowerCase().includes(searchTerm) ||
            tablet.Company_Name.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="container-fluid" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh', padding: '20px' }}>
            <nav className="navbar navbar-expand-lg mb-4" style={{ backgroundColor: '#DA291C' }}>
                <div className="container-fluid">
                    <span className="navbar-brand" style={{ color: '#D1C0A8' }}>Admin Dashboard</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon" style={{ backgroundColor: '#D1C0A8' }}></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link active" style={{ color: '#D1C0A8' }} to="/admin-medicine-dashboard">Medicines</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: '#D1C0A8' }} to="/add-medicine">Add Medicine</Link>
                            </li>
                        </ul>
                        <div className="d-flex">
                            <button 
                                style={{ 
                                    backgroundColor: '#8B8589', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '8px 16px', 
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    marginRight: '10px'
                                }} 
                                onClick={() => navigate('/admin-dashboard')}
                            >
                                Back to Admin Dashboard
                            </button>
                            <button 
                                style={{ 
                                    backgroundColor: '#DA291C', 
                                    color: 'white', 
                                    border: '2px solid #D1C0A8', 
                                    padding: '8px 16px', 
                                    borderRadius: '4px',
                                    fontWeight: 'bold'
                                }} 
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h2 style={{ color: '#8B8589' }}>Medicine Dashboard</h2>
                </div>
                <div className="col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search medicines..."
                            onChange={handleSearchChange}
                            style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6', color: '#8B8589' }}
                        />
                        <button 
                            style={{ 
                                backgroundColor: '#8B8589', 
                                color: 'white', 
                                border: 'none', 
                                padding: '8px 16px', 
                                borderRadius: '4px',
                                fontWeight: 'bold'
                            }} 
                            type="button"
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover" style={{ backgroundColor: '#F0EAD6', borderColor: '#8B8589' }}>
                    <thead style={{ backgroundColor: '#DA291C', color: '#D1C0A8' }}>
                        <tr>
                            <th>Medicine Name</th>
                            <th>Generic Name</th>
                            <th>Company</th>
                            <th>Price</th>
                            <th>Dosage</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: '#8B8589' }}>
                        {filteredMedicines.length > 0 ? (
                            filteredMedicines.map((medicine) => (
                                <tr key={medicine.Medicine_ID} style={{ backgroundColor: '#F0EAD6' }}>
                                    <td>{medicine.Medicine_Name}</td>
                                    <td>{medicine.Generic_Name}</td>
                                    <td>{medicine.Company_Name}</td>
                                    <td>₹{medicine.Price_Per_Unit}</td>
                                    <td>{medicine.Dosage}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link
                                                to={`/view-medicine/${medicine.Medicine_ID}`}
                                                style={{ 
                                                    backgroundColor: '#8B8589', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    padding: '5px 10px', 
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <i className="bi bi-eye"></i> View
                                            </Link>
                                            <Link
                                                to={`/edit-medicine/${medicine.Medicine_ID}`}
                                                style={{ 
                                                    backgroundColor: '#DA291C', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    padding: '5px 10px', 
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i> Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr style={{ backgroundColor: '#F0EAD6' }}>
                                <td colSpan="6" className="text-center" style={{ color: '#8B8589' }}>No medicines found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminMedicineDashboard;