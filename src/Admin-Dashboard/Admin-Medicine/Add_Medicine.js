import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddMedicine = () => {
    const [medicineName, setMedicineName] = useState("");
    const [genericName, setGenericName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [pricePerUnit, setPrice] = useState("");
    const [dosage, setDosage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!medicineName || !genericName || !companyName || !pricePerUnit || !dosage) {
            setError("Please fill all required fields");
            return;
        }
        try {
            const add_med_token = localStorage.getItem("token");
            await axios.post("http://localhost:8000/api/api/medicines/",
                {
                    Medicine_Name: medicineName,
                    Generic_Name: genericName,
                    Company_Name: companyName,
                    Price_Per_Unit: pricePerUnit,
                    Dosage: dosage
                },
                { headers: { Authorization: `Bearer ${add_med_token}` } }
            );
            alert("Medicine added successfully!");
            navigate("/admin-medicine-dashboard");
        }
        catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Error adding a new medicine");
        }
    };

    return (
        <div className="container mt-5" style={{ backgroundColor: '#D1C0A8', minHeight: '100vh', padding: '20px' }}>
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card" style={{ backgroundColor: '#F0EAD6', borderColor: '#8B8589', borderRadius: '8px' }}>
                        <div className="card-header" style={{ backgroundColor: '#DA291C', color: '#D1C0A8' }}>
                            <h3 className="mb-0">Add New Medicine</h3>
                        </div>
                        <div className="card-body" style={{ color: '#8B8589' }}>
                            {error && <div className="alert" style={{ backgroundColor: '#F0EAD6', color: '#8B8589', borderColor: '#DA291C' }}>{error}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="medicineName" className="form-label">
                                        Medicine Name <span style={{ color: '#DA291C' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="medicineName"
                                        value={medicineName}
                                        onChange={(e) => setMedicineName(e.target.value)}
                                        placeholder="Enter brand name"
                                        style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6', color: '#8B8589' }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="genericName" className="form-label">
                                        Generic Name <span style={{ color: '#DA291C' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="genericName"
                                        value={genericName}
                                        onChange={(e) => setGenericName(e.target.value)}
                                        placeholder="Enter pharmaceutical name"
                                        style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6', color: '#8B8589' }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="companyName" className="form-label">
                                        Company Name <span style={{ color: '#DA291C' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="companyName"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Enter manufacturer"
                                        style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6', color: '#8B8589' }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="pricePerUnit" className="form-label">
                                        Price Per Unit <span style={{ color: '#DA291C' }}>*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ backgroundColor: '#F0EAD6', color: '#8B8589', borderColor: '#8B8589' }}>₹</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="pricePerUnit"
                                            value={pricePerUnit}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6', color: '#8B8589' }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="dosage" className="form-label">
                                        Dosage <span style={{ color: '#DA291C' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="dosage"
                                        value={dosage}
                                        onChange={(e) => setDosage(e.target.value)}
                                        placeholder="Enter dosage (e.g., 500mg)"
                                        style={{ borderColor: '#8B8589', backgroundColor: '#F0EAD6', color: '#8B8589' }}
                                    />
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        style={{ 
                                            backgroundColor: '#8B8589', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '8px 16px', 
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}
                                        onClick={() => navigate("/admin-medicine-dashboard")}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Dashboard
                                    </button>
                                    <button 
                                        type="submit" 
                                        style={{ 
                                            backgroundColor: '#DA291C', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '8px 16px', 
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Add Medicine
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMedicine;