import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BillingDashboard = () => {
    const [bills, setBills] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const response = await axios.get("http://localhost:8000/api/pharmacist-billing/", config);
                setBills(response.data);
            } catch (error) {
                console.error(error);
                alert("Error fetching bills. Please check console for details.");
            }
        };
        fetchBills();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredBills = bills.filter(bill => {
        const term = searchTerm.toLowerCase();
        return (
            bill.bill_id.toString().includes(term) ||
            (bill.patient_info?.name?.toLowerCase()?.includes(term) ?? false) ||
            bill.total_amount.toString().includes(term) ||
            bill.date.toLowerCase().includes(term)
   ) });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    return (
        <div className="container mt-4">
            <style>
                {`
                    .custom-container {
                        background-color: #F0EAD6;
                    }
                    .custom-heading {
                        color: #DA2C43;
                    }
                    .custom-btn-back {
                        background-color: #8B8589;
                        color: #F0EAD6;
                        border-color: #8B8589;
                    }
                    .custom-btn-back:hover {
                        background-color: #DA2C43;
                        border-color: #DA2C43;
                        color: #F0EAD6;
                    }
                    .custom-btn-logout {
                        background-color: #DA2C43;
                        color: #F0EAD6;
                        border-color: #DA2C43;
                    }
                    .custom-btn-logout:hover {
                        background-color: #8B8589;
                        border-color: #8B8589;
                        color: #F0EAD6;
                    }
                    .custom-input {
                        background-color: #F0EAD6;
                        border-color: #D1BEA8;
                        color: #8B8589;
                    }
                    .custom-input::placeholder {
                        color: #8B8589;
                    }
                    .custom-btn-search {
                        background-color: #D1BEA8;
                        color: #8B8589;
                        border-color: #D1BEA8;
                    }
                    .custom-btn-search:hover {
                        background-color: #DA2C43;
                        color: #F0EAD6;
                        border-color: #DA2C43;
                    }
                    .custom-btn-add {
                        background-color: #DA2C43;
                        color: #F0EAD6;
                        border-color: #DA2C43;
                    }
                    .custom-btn-add:hover {
                        background-color: #8B8589;
                        color: #F0EAD6;
                        border-color: #8B8589;
                    }
                    .custom-table {
                        background-color: #F0EAD6;
                        color: #8B8589;
                    }
                    .custom-table thead {
                        background-color: #D1BEA8;
                        color: #8B8589;
                    }
                    .custom-table tbody tr {
                        background-color: #F0EAD6;
                        color: #8B8589;
                    }
                    .custom-table tbody tr:hover {
                        background-color: #D1BEA8;
                    }
                    .custom-btn-view {
                        background-color: #8B8589;
                        color: #F0EAD6;
                        border-color: #8B8589;
                    }
                    .custom-btn-view:hover {
                        background-color: #DA2C43;
                        color: #F0EAD6;
                        border-color: #DA2C43;
                    }
                    .custom-badge-paid {
                        background-color: #28a745;
                        color: white;
                    }
                    .custom-badge-pending {
                        background-color: #ffc107;
                        color: black;
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
                        <h2 className="custom-heading d-inline-block">Billing Dashboard</h2>
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
                                placeholder="Search by bill ID, patient name, amount or date..."
                                onChange={handleSearchChange}
                            />
                            <button className="btn custom-btn-search" type="button">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-6 text-end">
                        <Link to="/create-bill" className="btn custom-btn-add">
                            <i className="bi bi-plus-circle"></i> Create New Bill
                        </Link>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered custom-table">
                        <thead>
                            <tr>
                                <th>Bill ID</th>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBills.map((bill) => (
                                <tr key={bill.id}>
                                    <td>{bill.bill_id}</td>
                                    <td>{bill.patient_info?.name || 'N/A'}</td>
                                    <td>{formatDate(bill.date)}</td>
                                    <td>₹{bill.total_amount.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${bill.paid ? 'custom-badge-paid' : 'custom-badge-pending'}`}>
                                            {bill.paid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/view-bill/${bill.id}`}
                                            className="btn btn-sm custom-btn-view me-2"
                                        >
                                            <i className="bi bi-eye"></i> View
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

export default BillingDashboard;