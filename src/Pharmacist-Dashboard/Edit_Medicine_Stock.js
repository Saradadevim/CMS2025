import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Edit_MedicineStoc = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicineID, SetMedicineID] = useState("");
    const [medicines, setMedicines] = useState([]);
    const [available_stock, setAvailable] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [manufDate, setManufacturingDate] = useState("");

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
            } catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetchMedicines();

        const fetch_MedicineStock = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const medicine_stock_response = await axios.get(`http://localhost:8000/api/medicine-stock/${id}/`, config);
                SetMedicineID(medicine_stock_response.data.medicine_info?.Medicine_ID);
                setAvailable(medicine_stock_response.data.Available_Stock);
                setManufacturingDate(medicine_stock_response.data.Manufacturing_Date);
                setExpiryDate(medicine_stock_response.data.Expiry_Date);
            } catch (error) {
                console.error(error);
                alert("Error fetching the data... Please refer to the console for more info!");
            }
        };
        fetch_MedicineStock();
    }, [id]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handle_edit_medicine_stock = async (e) => {
        e.preventDefault();
        if (!medicineID || !available_stock || !expiryDate || !manufDate) {
            alert("Please fill all required fields");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:8000/api/medicine-stock/${id}/`,
                {
                    Available_Stock: available_stock,
                    Expiry_Date: expiryDate,
                    Manufacturing_Date: manufDate,
                    Medicine: medicineID
                }, config
            );
            alert("Medicine stock data updated successfully!!");
            navigate("/med-stock-management");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error updating the medicine stock");
        }
    };

    return (
        <div className="container mt-5" style={{ backgroundColor: '#F5ECE1', color: '#483C32' }}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2 className="text-center mb-4" style={{ color: '#E63946' }}>Edit Medicine Stock</h2>
                    <div className="d-flex justify-content-between mb-3">
                        <button onClick={() => navigate("/med-stock-management")} className="btn btn-secondary" style={{ backgroundColor: '#483C32', color: '#F5ECE1', borderColor: '#483C32' }}>Back</button>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ backgroundColor: '#E63946', color: '#F5ECE1' }}>Logout</button>
                    </div>
                    <form onSubmit={handle_edit_medicine_stock}>
                        <div className="mb-3">
                            <label htmlFor="medicineID" className="form-label" style={{ color: '#483C32' }}>Medicine</label>
                            <select
                                id="medicineID"
                                value={medicineID}
                                onChange={(e) => SetMedicineID(e.target.value)}
                                className="form-select"
                                style={{ backgroundColor: '#F5ECE1', color: '#483C32', borderColor: '#483C32' }}
                                required
                            >
                                <option value="">Select Medicine</option>
                                {medicines.map((medicine) => (
                                    <option key={medicine.Medicine_ID} value={medicine.Medicine_ID}>
                                        {medicine.Medicine_Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="available_stock" className="form-label" style={{ color: '#483C32' }}>Available Stock</label>
                            <input
                                type="number"
                                id="available_stock"
                                value={available_stock}
                                onChange={(e) => setAvailable(e.target.value)}
                                className="form-control"
                                style={{ backgroundColor: '#F5ECE1', color: '#483C32', borderColor: '#483C32' }}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="expiryDate" className="form-label" style={{ color: '#483C32' }}>Expiry Date</label>
                            <input
                                type="date"
                                id="expiryDate"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className="form-control"
                                style={{ backgroundColor: '#F5ECE1', color: '#483C32', borderColor: '#483C32' }}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="manufDate" className="form-label" style={{ color: '#483C32' }}>Manufacturing Date</label>
                            <input
                                type="date"
                                id="manufDate"
                                value={manufDate}
                                onChange={(e) => setManufacturingDate(e.target.value)}
                                className="form-control"
                                style={{ backgroundColor: '#F5ECE1', color: '#483C32', borderColor: '#483C32' }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#E63946', color: '#F5ECE1', borderColor: '#E63946' }}>Update Stock</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Edit_MedicineStoc;