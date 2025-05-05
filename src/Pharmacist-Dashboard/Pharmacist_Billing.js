import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Pharmacist_Bill = ({ billId }) => {
    const [bill, setBill] = useState({
        Pharmacist_Bill_ID: null,
        Consultation: { Medicine: { Name: '', Price_Per_Unit: 0 } },
        Medicine: { Name: '', Price_Per_Unit: 0 },
        Medicine_Fee: 0,
        Service_Charge: 5.2,
        Total_Fees: 0,
        Payment_Status: 'Cancelled',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const response = await axios.get(`http://localhost:8000/api/pharmacist-billing/${billId}`, config);
                setBill(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch bill data');
                setIsLoading(false);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetchBill();
    }, [billId]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("Role");
        navigate("/");
    };

    const handleServiceChargeChange = (e) => {
        const newServiceCharge = parseFloat(e.target.value) || 0;
        setBill((prev) => ({
            ...prev,
            Service_Charge: newServiceCharge,
            Total_Fees: prev.Medicine_Fee + newServiceCharge,
        }));
    };

    const handlePaymentStatusChange = (e) => {
        setBill((prev) => ({ ...prev, Payment_Status: e.target.value }));
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:8000/api/pharmacist-billing/${billId}`, {
                Service_Charge: bill.Service_Charge,
                Payment_Status: bill.Payment_Status,
            }, config);
            alert('Bill updated successfully!');
        } catch (err) {
            setError('Failed to save bill');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
    if (error) return <div className="text-danger text-center">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <button
                        onClick={() => navigate('/pharmacist-dashboard')}
                        className="btn btn-secondary me-2"
                    >
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <h2 className="text-primary d-inline-block">Pharmacist Bill #{bill.Pharmacist_Bill_ID}</h2>
                </div>
                <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                </button>
            </div>

            <div className="card shadow">
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Medicine (Non-editable)</label>
                        <input
                            className="form-control bg-light"
                            value={bill.Medicine.Name}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Medicine Fee (Non-editable)</label>
                        <input
                            className="form-control bg-light"
                            value={`$${bill.Medicine_Fee.toFixed(2)}`}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Service Charge</label>
                        <input
                            className="form-control"
                            type="number"
                            step="0.01"
                            value={bill.Service_Charge}
                            onChange={handleServiceChargeChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Total Fees (Non-editable)</label>
                        <input
                            className="form-control bg-light"
                            value={`$${bill.Total_Fees.toFixed(2)}`}
                            disabled
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Payment Status</label>
                        <select
                            className="form-select"
                            value={bill.Payment_Status}
                            onChange={handlePaymentStatusChange}
                        >
                            <option value="Paid">Paid</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : (
                                'Save Bill'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pharmacist_Bill;