import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchConsultation, fetchMedicines, fetchLabTests, updateConsultation } from '../services/apiService';
import backgroundImage from '../assets/blur-hospital.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateConsultation = () => {
    const [formData, setFormData] = useState({
        token_number: '',
        notes: '',
        medicines: [],
        lab_tests: [],
    });
    const [newMedicine, setNewMedicine] = useState({
        Medicine_Name: '',
        Dosage: '',
        Frequency: '',
        No_of_Days: '',
        Instructions: '',
    });
    const [availableMedicines, setAvailableMedicines] = useState([]);
    const [availableLabTests, setAvailableLabTests] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const frequencyOptions = ['1-1-1', '0-1-1', '1-0-1', '1-1-0', '1-0-0', '0-1-0', '0-0-1', 'when needed'];
    const daysOptions = ['1 Day', '3 Days', '5 Days', '1 Week', '2 Weeks', '1 Month'];
    const instructionOptions = ['Before Meal', 'After Meal', 'With Meal'];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Check for consultation_id in localStorage (set by AddConsultation)
                const storedConsultationId = localStorage.getItem('consultation_id');
                if (!storedConsultationId || storedConsultationId !== id) {
                    setError('Invalid or missing consultation ID. Please add a consultation first.');
                    setLoading(false);
                    return;
                }

                // Fetch consultation details
                const consultation = await fetchConsultation(id);
                setFormData({
                    token_number: consultation.token_number || localStorage.getItem('token_number') || '',
                    notes: consultation.Notes ? JSON.parse(consultation.Notes).clinical_notes || '' : '',
                    medicines: consultation.medicines || [],
                    lab_tests: consultation.lab_tests || [],
                });

                // Fetch available medicines and lab tests
                const medicines = await fetchMedicines();
                const labTests = await fetchLabTests({ available: true });
                setAvailableMedicines(medicines);
                setAvailableLabTests(labTests);
                setError(null);
            } catch (err) {
                setError('Failed to fetch consultation or resources');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleMedicineInputChange = (e) => {
        const { name, value } = e.target;
        setNewMedicine((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddMedicine = () => {
        const { Medicine_Name, Dosage, Frequency, No_of_Days, Instructions } = newMedicine;
        if (!Medicine_Name || !Dosage || !Frequency || !No_of_Days || !Instructions) {
            setError('All medicine fields are required');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            medicines: [...prev.medicines, { ...newMedicine }],
        }));

        setNewMedicine({
            Medicine_Name: '',
            Dosage: '',
            Frequency: '',
            No_of_Days: '',
            Instructions: '',
        });
        setError(null);
    };

    const handleRemoveMedicine = (index) => {
        setFormData({
            ...formData,
            medicines: formData.medicines.filter((_, i) => i !== index),
        });
    };

    const handleLabTestToggle = (testName) => {
        setFormData({
            ...formData,
            lab_tests: formData.lab_tests.includes(testName)
                ? formData.lab_tests.filter((name) => name !== testName)
                : [...formData.lab_tests, testName],
        });
    };

    const handlePatientHistory = () => {
        const confirm = window.confirm('Do you want to view this patient\'s history?');
        if (confirm) {
            const tokenNumber = formData.token_number;
            navigate(`/patient-history?token_number=${tokenNumber}`);
        }
    };

    const handleCancel = () => {
        const confirm = window.confirm('Are you sure you want to cancel?');
        if (confirm) {
            localStorage.removeItem('token_number');
            localStorage.removeItem('appointment_id');
            localStorage.removeItem('consultation_id');
            navigate('/doctor-dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.token_number) {
            setError('Token number is required');
            return;
        }
        const confirm = window.confirm('Are you sure you want to update this consultation?');
        if (!confirm) {
            return;
        }
        setLoading(true);
        try {
            const payload = {
                token_number: formData.token_number,
                notes: formData.notes,
                medicines: formData.medicines,
                lab_tests: formData.lab_tests,
            };
            const response = await updateConsultation(id, payload);
            setSuccess('Consultation updated successfully');
            localStorage.removeItem('token_number');
            localStorage.removeItem('appointment_id');
            localStorage.removeItem('consultation_id');
            localStorage.setItem('submitted_appointment_id', localStorage.getItem('appointment_id'));
            navigate('/prescription-receipt', { state: { consultation: response } });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update consultation');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div className="min-h-screen d-flex">
            {showSidebar && <Sidebar toggleSidebar={toggleSidebar} />}
            <div className="flex-grow-1">
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="min-vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
                    <div className="container mt-4 p-4 bg-white bg-opacity-90 rounded shadow-lg">
                        <h2 className="text-center text-primary mb-4">Update Consultation</h2>
                        {loading && <p className="text-primary text-center">Loading...</p>}
                        {error && <p className="text-danger text-center">{error}</p>}
                        {success && <p className="text-success text-center">{success}</p>}

                        <form onSubmit={handleSubmit} className="p-3">
                            <div className="form-group mb-4">
                                <label className="font-weight-bold">Token Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.token_number}
                                    disabled
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label className="font-weight-bold">Clinical Notes</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                            <div className="border p-3 mb-4 rounded bg-light">
                                <h5 className="mb-3">Update Medicine</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label>Medicine Name</label>
                                        <select
                                            name="Medicine_Name"
                                            className="form-control"
                                            value={newMedicine.Medicine_Name}
                                            onChange={handleMedicineInputChange}
                                        >
                                            <option value="">Select Medicine</option>
                                            {availableMedicines.map((med) => (
                                                <option key={med.Medicine_ID} value={med.Medicine_Name}>
                                                    {med.Medicine_Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Dosage</label>
                                        <input
                                            type="text"
                                            name="Dosage"
                                            className="form-control"
                                            value={newMedicine.Dosage}
                                            onChange={handleMedicineInputChange}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label>Frequency</label>
                                        <select
                                            name="Frequency"
                                            className="form-control"
                                            value={newMedicine.Frequency}
                                            onChange={handleMedicineInputChange}
                                        >
                                            <option value="">Select Frequency</option>
                                            {frequencyOptions.map((f, i) => (
                                                <option key={i} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label>No of Days</label>
                                        <select
                                            name="No_of_Days"
                                            className="form-control"
                                            value={newMedicine.No_of_Days}
                                            onChange={handleMedicineInputChange}
                                        >
                                            <option value="">Select Duration</option>
                                            {daysOptions.map((d, i) => (
                                                <option key={i} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label>Instructions</label>
                                        <select
                                            name="Instructions"
                                            className="form-control"
                                            value={newMedicine.Instructions}
                                            onChange={handleMedicineInputChange}
                                        >
                                            <option value="">Select Instructions</option>
                                            {instructionOptions.map((ins, i) => (
                                                <option key={i} value={ins}>{ins}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary mt-3"
                                    onClick={handleAddMedicine}
                                >
                                    + Add Medicine
                                </button>
                                <ul className="mt-3 list-group">
                                    {formData.medicines.map((med, idx) => (
                                        <li
                                            key={idx}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <div>
                                                <strong>{med.Medicine_Name}</strong> — {med.Dosage}, {med.Frequency}, {med.No_of_Days}, {med.Instructions}
                                            </div>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveMedicine(idx)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="border p-3 mb-4 rounded bg-light">
                                <h5 className="mb-3">Update Lab Tests</h5>
                                <div className="row g-3">
                                    {availableLabTests.map((test) => (
                                        <div key={test.LabTest_ID} className="col-md-6">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.lab_tests.includes(test.Lab_Test_Name)}
                                                    onChange={() => handleLabTestToggle(test.Lab_Test_Name)}
                                                    className="mr-2"
                                                />
                                                {test.Lab_Test_Name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <button
                                    type="button"
                                    className="btn btn-info"
                                    onClick={handlePatientHistory}
                                >
                                    Patient History
                                </button>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-danger mr-2"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Consultation'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateConsultation;