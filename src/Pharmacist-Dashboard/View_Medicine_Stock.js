import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const View_MedicineStock = () => {
    const { id } = useParams();
    const [medicineStock, setMedicineStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch_MedicineStock = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const medicine_stock_response = await axios.get(`http://localhost:8000/api/medicine-stock/${id}/`, config);
                setMedicineStock(medicine_stock_response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetch_MedicineStock();
    }, [id]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status" style={{ color: '#DA2C43' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!medicineStock) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert" style={{ backgroundColor: '#DA2C43', color: '#F0EAD6' }}>
                    Failed to load medicine stock data.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <style>
                {`
                    .custom-card {
                        background-color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589; /* Taupe Gray */
                    }
                    .custom-card-header {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-list-group-item {
                        background-color: #F0EAD6; /* Eggshell White */
                        color: #8B8589; /* Taupe Gray */
                        border-color: #D1BEA8; /* Dark Vanilla */
                    }
                    .custom-badge-available {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                    }
                    .custom-badge-not-available {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6; /* Eggshell White */
                    }
                    .custom-btn-back {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589;
                    }
                    .custom-btn-back:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        border-color: #DA2C43;
                        color: #F0EAD6;
                    }
                    .custom-btn-logout {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-logout:hover {
                        background-color: #8B8589; /* Taupe Gray */
                        border-color: #8B8589;
                        color: #F0EAD6;
                    }
                    .custom-heading {
                        color: #DA2C43; /* Jelly Bean Red */
                    }
                    .custom-strong {
                        color: #DA2C43; /* Jelly Bean Red */
                    }
                `}
            </style>
            <div className="card shadow custom-card">
                <div className="card-header custom-card-header d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Medicine Stock Details</h3>
                    <button 
                        className="btn custom-btn-logout btn-sm" 
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h5 className="custom-heading">Medicine Information</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Stock ID:</strong> {medicineStock.Medicine_Stock_ID}
                                </li>
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Name:</strong> {medicineStock.medicine_info.Medicine_Name}
                                </li>
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Generic Name:</strong> {medicineStock.medicine_info.Generic_Name}
                                </li>
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Company:</strong> {medicineStock.medicine_info.Company_Name}
                                </li>
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Price per Unit:</strong> ₹{medicineStock.medicine_info.Price_Per_Unit}
                                </li>
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Dosage:</strong> {medicineStock.medicine_info.Dosage}
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <h5 className="custom-heading">Stock Information</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Available Stock:</strong> {medicineStock.Available_Stock} units
                                </li>
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Manufacturing Date:</strong> {formatDate(medicineStock.Manufacturing_Date)}
                                </li>
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Expiry Date:</strong> {formatDate(medicineStock.Expiry_Date)}
                                </li>
                                <li className="list-group-item custom-list-group-item">
                                    <strong className="custom-strong">Availability:</strong> 
                                    <span className={`badge ${medicineStock.Is_Available ? 'custom-badge-available' : 'custom-badge-not-available'} ms-2`}>
                                        {medicineStock.Is_Available ? 'Available' : 'Not Available'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button 
                            className="btn custom-btn-back" 
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default View_MedicineStock;