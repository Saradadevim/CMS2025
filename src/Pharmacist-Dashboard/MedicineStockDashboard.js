import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MedicineStockDashboard = () => {
    const [medicineStock, setMedicineStock] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMedicineStocks = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const medicineStock_Res = await axios.get("http://localhost:8000/api/medicine-stock/", config);
                setMedicineStock(medicineStock_Res.data);
            } catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetchMedicineStocks();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredStockData = medicineStock.filter((stock) => {
        const term = searchTerm.toLowerCase();
        const medicineName = stock.medicine_info?.Medicine_Name?.toLowerCase() ?? '';
        const genericName = stock.medicine_info?.Generic_Name?.toLowerCase() ?? '';
        const dosage = stock.medicine_info?.Dosage?.toLowerCase() ?? '';
        const availableStock = stock.Available_Stock?.toString() ?? '';
        const expiryDate = stock.Expiry_Date?.toLowerCase() ?? '';

        return (
            medicineName.includes(term) ||
            genericName.includes(term) ||
            availableStock.includes(term) ||
            dosage.includes(term) ||
            expiryDate.includes(term)
        );
    });

    return (
        <div className="container mt-4">
            <style>
                {`
                    .custom-container {
                        background-color: #F0EAD6; /* Eggshell White */
                    }
                    .custom-heading {
                        color: #DA2C43; /* Jelly Bean Red */
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
                    .custom-input {
                        background-color: #F0EAD6; /* Eggshell White */
                        border-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-input::placeholder {
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-btn-search {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                        border-color: #D1BEA8;
                    }
                    .custom-btn-search:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-add {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-add:hover {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6;
                        border-color: #8B8589;
                    }
                    .custom-table {
                        background-color: #F0EAD6; /* Eggshell White */
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-table thead {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-table tbody tr {
                        background-color: #F0EAD6; /* Eggshell White */
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-table tbody tr:hover {
                        background-color: #D1BEA8; /* Dark Vanilla */
                    }
                    .custom-btn-edit {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                        border-color: #D1BEA8;
                    }
                    .custom-btn-edit:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-view {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589;
                    }
                    .custom-btn-view:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                `}
            </style>

            <div className="custom-container p-4 rounded">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <button
                            onClick={() => navigate('/pharmacist-dashboard')}
                            className="btn custom-btn-back me-2"
                        >
                            <i className="bi bi-arrow-left"></i> Back
                        </button>
                        <h2 className="custom-heading d-inline-block">Medicine Stock Dashboard</h2>
                    </div>
                    <button onClick={handleLogout} className="btn custom-btn-logout">
                        Logout
                    </button>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control custom-input"
                                placeholder="Search by medicine, generic name, stock, dosage or expiry..."
                                onChange={handleSearchChange}
                            />
                            <button className="btn custom-btn-search" type="button">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-6 text-end">
                        <Link to="/add-med-stock" className="btn custom-btn-add">
                            <i className="bi bi-plus-circle"></i> Add New Stock
                        </Link>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered custom-table">
                        <thead>
                            <tr>
                                <th>Medicine Name</th>
                                <th>Generic Name</th>
                                <th>Dosage</th>
                                <th>Available Stock</th>
                                <th>Expiry Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStockData.map((stock) => (
                                <tr key={stock.Medicine_Stock_ID}>
                                    <td>{stock.medicine_info?.Medicine_Name}</td>
                                    <td>{stock.medicine_info?.Generic_Name}</td>
                                    <td>{stock.medicine_info?.Dosage}</td>
                                    <td>{stock.Available_Stock}</td>
                                    <td>{stock.Expiry_Date}</td>
                                    <td>
                                        <Link
                                            to={`/edit-med-stock/${stock.Medicine_Stock_ID}`}
                                            className="btn btn-sm custom-btn-edit me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <Link
                                            to={`/view-med-stock/${stock.Medicine_Stock_ID}`}
                                            className="btn btn-sm custom-btn-view me-2"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MedicineStockDashboard;