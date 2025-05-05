import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { addConsultation } from '../services/apiService';
import backgroundImage from '../assets/blur-hospital.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddConsultation = () => {
    const navigate = useNavigate();
    
    const [showSidebar, setShowSidebar] = useState(false);
    const [formData, setFormData] = useState({
        token_number: '',
        Notes: '',
        medicines: [],
        lab_tests: []
    });

    const [newMedicine, setNewMedicine] = useState({
        Medicine_Name: '',
        Dosage: '',
        Frequency: '',
        No_of_Days: '',
        Instructions: ''
    });

    const [newLabTest, setNewLabTest] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const frequencyOptions = ['1-1-1', '0-1-1', '1-0-1', '1-1-0', '1-0-0', '0-1-0', '0-0-1', 'when needed'];
    const daysOptions = ['1 Day', '3 Days', '5 Days', '1 Week', '2 Weeks', '1 Month'];
    const instructionOptions = ['Before Meal', 'After Meal', 'With Meal'];

    useEffect(() => {
        const storedTokenNumber = localStorage.getItem('token_number');
        if (storedTokenNumber) {
            setFormData((prev) => ({
                ...prev,
                token_number: storedTokenNumber
            }));
        } else {
            setError('No token number found. Please select a patient from the dashboard.');
        }
    }, []);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

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
            medicines: [...prev.medicines, { ...newMedicine }]
        }));

        setNewMedicine({
            Medicine_Name: '',
            Dosage: '',
            Frequency: '',
            No_of_Days: '',
            Instructions: ''
        });
        setError(null);
    };

    const handleAddLabTest = () => {
        if (!newLabTest) {
            setError('Lab test name is required');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            lab_tests: [...prev.lab_tests, newLabTest]
        }));

        setNewLabTest('');
        setError(null);
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
            navigate('/doctor-dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.token_number) {
            setError('Token number is required');
            return;
        }
        const confirm = window.confirm('Are you sure you want to submit?');
        if (!confirm) {
            return;
        }
        setLoading(true);
        try {
            const response = await addConsultation(formData);
            setSuccess('Consultation submitted successfully');
            localStorage.removeItem('token_number');
            localStorage.removeItem('appointment_id');
            // Store appointment_id in localStorage for DoctorDashboard to filter
            localStorage.setItem('submitted_appointment_id', localStorage.getItem('appointment_id'));
            // Navigate to prescription receipt with consultation data
            navigate('/prescription-receipt', { state: { consultation: response } });
        } catch (err) {
            console.error('Error submitting consultation:', err);
            setError(err.response?.data?.error || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen d-flex">
            {showSidebar && <Sidebar toggleSidebar={toggleSidebar} />}
            <div className="flex-grow-1">
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="min-vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
                    <div className="container mt-4 p-4 bg-white bg-opacity-90 rounded shadow-lg">
                        <h2 className="text-center text-primary mb-4">Add Consultation</h2>
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
                                    value={formData.Notes}
                                    onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
                                />
                            </div>
                            <div className="border p-3 mb-4 rounded bg-light">
                                <h5 className="mb-3">Add Medicine</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label>Medicine Name</label>
                                        <input
                                            type="text"
                                            name="Medicine_Name"
                                            className="form-control"
                                            value={newMedicine.Medicine_Name}
                                            onChange={handleMedicineInputChange}
                                        />
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
                                        <select name="Frequency" className="form-control" value={newMedicine.Frequency} onChange={handleMedicineInputChange}>
                                            <option value="">Select Frequency</option>
                                            {frequencyOptions.map((f, i) => <option key={i} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label>No of Days</label>
                                        <select name="No_of_Days" className="form-control" value={newMedicine.No_of_Days} onChange={handleMedicineInputChange}>
                                            <option value="">Select Duration</option>
                                            {daysOptions.map((d, i) => <option key={i} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label>Instructions</label>
                                        <select name="Instructions" className="form-control" value={newMedicine.Instructions} onChange={handleMedicineInputChange}>
                                            <option value="">Select Instructions</option>
                                            {instructionOptions.map((ins, i) => <option key={i} value={ins}>{ins}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary mt-3" onClick={handleAddMedicine}>
                                    + Add Medicine
                                </button>
                                <ul className="mt-3 list-group">
                                    {formData.medicines.map((med, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{med.Medicine_Name}</strong> — {med.Dosage}, {med.Frequency}, {med.No_of_Days}, {med.Instructions}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="border p-3 mb-4 rounded bg-light">
                                <h5 className="mb-3">Add Lab Test</h5>
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <label>Lab Test Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newLabTest}
                                            onChange={(e) => setNewLabTest(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary mt-3" onClick={handleAddLabTest}>
                                    + Add Lab Test
                                </button>
                                <ul className="mt-3 list-group">
                                    {formData.lab_tests.map((test, idx) => (
                                        <li key={idx} className="list-group-item">
                                            {test}
                                        </li>
                                    ))}
                                </ul>
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
                                        {loading ? 'Submitting...' : 'Submit Consultation'}
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

export default AddConsultation;