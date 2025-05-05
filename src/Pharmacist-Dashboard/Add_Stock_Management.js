import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Add_Medicine_Stock = () => {
    const [medicineID, SetMedicineID] = useState("");
    const [medicines, setMedicines] = useState([]);
    const [available_stock, setAvailable] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [manufDate, setManufacturingDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const medicine_Res = await axios.get("http://localhost:8000/api/medicines/", config);
                setMedicines(medicine_Res.data);
            }
            catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetchMedicines();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handle_AddMedicineStock = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };

        try {
            const new_medicineStock = await axios.post("http://localhost:8000/api/medicine-stock/", 
                {
                    Available_Stock: available_stock,
                    Expiry_Date: expiryDate,
                    Manufacturing_Date: manufDate,
                    Medicine: medicineID
                },
                config
            );
            const new_stockEntry = new_medicineStock.data.medicine_info?.Medicine_Name;
            alert(`Medicine stock for ${new_stockEntry} added successfully`);
            navigate("/med-stock-management");
        }
        catch (error) {
            console.log(error);
            alert("Error adding a new medicine stock entry");
        }
    };

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
                    .custom-select, .custom-input {
                        background-color: #F0EAD6; /* Eggshell White */
                        border-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-select option, .custom-input::placeholder {
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-btn-logout {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-logout:hover {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589;
                    }
                    .custom-btn-cancel {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589;
                    }
                    .custom-btn-cancel:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-add {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                        border-color: #D1BEA8;
                    }
                    .custom-btn-add:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-add:disabled {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                        opacity: 0.65;
                    }
                    .custom-label {
                        color: #DA2C43; /* Jelly Bean Red */
                    }
                `}
            </style>

            <div className="card shadow custom-card">
                <div className="card-header custom-card-header d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Add Medicine Stock</h3>
                    <button 
                        className="btn custom-btn-logout btn-sm" 
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="medicineSelect" className="form-label custom-label">
                                Select Medicine
                            </label>
                            <select
                                id="medicineSelect"
                                className="form-select custom-select"
                                value={medicineID}
                                onChange={(e) => SetMedicineID(e.target.value)}
                                required
                            >
                                <option value="">-- Select Medicine --</option>
                                {medicines.map((medicine) => (
                                    <option 
                                        key={medicine.Medicine_ID} 
                                        value={medicine.Medicine_ID}
                                    >
                                        {medicine.Medicine_Name} ({medicine.Generic_Name}, {medicine.Dosage})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="availableStock" className="form-label custom-label">
                                Available Stock
                            </label>
                            <input
                                type="number"
                                className="form-control custom-input"
                                id="availableStock"
                                value={available_stock}
                                onChange={(e) => setAvailable(e.target.value)}
                                placeholder="Enter stock quantity"
                                min="0"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="manufDate" className="form-label custom-label">
                                Manufacturing Date
                            </label>
                            <input
                                type="date"
                                className="form-control custom-input"
                                id="manufDate"
                                value={manufDate}
                                onChange={(e) => setManufacturingDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="expiryDate" className="form-label custom-label">
                                Expiry Date
                            </label>
                            <input
                                type="date"
                                className="form-control custom-input"
                                id="expiryDate"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn custom-btn-cancel"
                                onClick={() => navigate("/med-stock-management")}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn custom-btn-add"
                                onClick={handle_AddMedicineStock}
                                disabled={!medicineID || !available_stock || !expiryDate || !manufDate}
                            >
                                Add Stock
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Add_Medicine_Stock;