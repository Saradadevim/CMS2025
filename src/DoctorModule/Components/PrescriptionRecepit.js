import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import backgroundImage from '../assets/blur-hospital.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';

const PrescriptionReceipt = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const consultation = location.state?.consultation || {};
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    const handleBack = () => {
        navigate('/doctor-dashboard');
    };

    const handleEdit = () => {
        navigate(`/update-consultation/${consultation.Consultation_ID || ''}`, {
            state: { consultation }
        });
    };

    const handlePrint = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Prescription Receipt', 20, 20);
        doc.setFontSize(12);

        // Consultation Details
        doc.text('Consultation Details', 20, 30);
        doc.text(`Consultation ID: ${consultation.Consultation_ID || 'N/A'}`, 20, 40);
        doc.text(`Token Number: ${consultation.token_number || 'N/A'}`, 20, 50);
        doc.text(`Doctor: ${consultation.doctor_name || 'N/A'}`, 20, 60);
        doc.text(`Department: ${consultation.department || 'N/A'}`, 20, 70);

        // Patient Details
        doc.text('Patient Details', 20, 90);
        const patientDetails = consultation.patient_details || {};
        doc.text(`Name: ${patientDetails.patient_name || 'N/A'}`, 20, 100);
        doc.text(`Registration Number: ${patientDetails.registration_number || 'N/A'}`, 20, 110);
        doc.text(`Age: ${patientDetails.age || 'N/A'}`, 20, 120);
        doc.text(`Gender: ${patientDetails.gender || 'N/A'}`, 20, 130);

        // Clinical Notes
        doc.text('Clinical Notes', 20, 150);
        let notes = 'No notes provided';
        let medicines = [];
        try {
            const notesData = consultation.Notes ? JSON.parse(consultation.Notes) : {};
            notes = notesData.clinical_notes || 'No notes provided';
            medicines = notesData.medicines || [];
        } catch (err) {
            console.error('Error parsing Notes:', err);
        }
        doc.text(notes, 20, 160, { maxWidth: 170 });

        // Medicines
        let yOffset = 180;
        doc.text('Medicines', 20, yOffset);
        yOffset += 10;
        if (medicines.length > 0) {
            medicines.forEach((med, idx) => {
                const medicineText = `${idx + 1}. ${med.Medicine_Name || 'Unknown'} — ${med.Dosage || ''}, ${med.Frequency || ''}, ${med.No_of_Days || ''}, ${med.Instructions || ''}`;
                doc.text(medicineText, 20, yOffset, { maxWidth: 170 });
                yOffset += 10;
            });
        } else {
            doc.text('No medicines prescribed', 20, yOffset);
            yOffset += 10;
        }

        // Lab Tests
        yOffset += 10;
        doc.text('Lab Tests', 20, yOffset);
        yOffset += 10;
        const labTests = Array.isArray(consultation.lab_tests) ? consultation.lab_tests : [];
        if (labTests.length > 0) {
            labTests.forEach((test, idx) => {
                doc.text(`${idx + 1}. ${test || 'Unknown'}`, 20, yOffset);
                yOffset += 10;
            });
        } else {
            doc.text('No lab tests ordered', 20, yOffset);
        }

        // Save the PDF
        doc.save(`Prescription_Receipt_${consultation.Consultation_ID || 'Unknown'}.pdf`);
    };

    // Parse medicines and lab tests for display
    let medicines = [];
    let clinicalNotes = 'No notes provided';
    try {
        const notesData = consultation.Notes ? JSON.parse(consultation.Notes) : {};
        medicines = notesData.medicines || [];
        clinicalNotes = notesData.clinical_notes || 'No notes provided';
    } catch (err) {
        console.error('Error parsing Notes:', err);
    }
    const labTests = Array.isArray(consultation.lab_tests) ? consultation.lab_tests : [];

    return (
        <div className="min-h-screen d-flex">
            {showSidebar && <Sidebar toggleSidebar={toggleSidebar} />}
            <div className="flex-grow-1">
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="min-vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
                    <div className="container mt-4 p-4 bg-white bg-opacity-90 rounded shadow-lg">
                        <h2 className="text-center text-primary mb-4">Prescription Receipt</h2>
                        <div className="p-3">
                            <h5 className="mb-3">Consultation Details</h5>
                            <div className="border p-3 mb-4 rounded bg-light">
                                <p><strong>Consultation ID:</strong> {consultation.Consultation_ID || 'N/A'}</p>
                                <p><strong>Token Number:</strong> {consultation.token_number || 'N/A'}</p>
                                <p><strong>Doctor:</strong> {consultation.doctor_name || 'N/A'}</p>
                                <p><strong>Department:</strong> {consultation.department || 'N/A'}</p>
                            </div>
                            <h5 className="mb-3">Patient Details</h5>
                            <div className="border p-3 mb-4 rounded bg-light">
                                <p><strong>Name:</strong> {consultation.patient_details?.patient_name || 'N/A'}</p>
                                <p><strong>Registration Number:</strong> {consultation.patient_details?.registration_number || 'N/A'}</p>
                                <p><strong>Age:</strong> {consultation.patient_details?.age || 'N/A'}</p>
                                <p><strong>Gender:</strong> {consultation.patient_details?.gender || 'N/A'}</p>
                            </div>
                            <h5 className="mb-3">Clinical Notes</h5>
                            <div className="border p-3 mb-4 rounded bg-light">
                                <p>{clinicalNotes}</p>
                            </div>
                            <h5 className="mb-3">Medicines</h5>
                            <div className="border p-3 mb-4 rounded bg-light">
                                {medicines.length > 0 ? (
                                    <ul className="list-group">
                                        {medicines.map((med, idx) => (
                                            <li key={idx} className="list-group-item">
                                                <strong>{med.Medicine_Name || 'Unknown'}</strong> — {med.Dosage || ''}, {med.Frequency || ''}, {med.No_of_Days || ''}, {med.Instructions || ''}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No medicines prescribed</p>
                                )}
                            </div>
                            <h5 className="mb-3">Lab Tests</h5>
                            <div className="border p-3 mb-4 rounded bg-light">
                                {labTests.length > 0 ? (
                                    <ul className="list-group">
                                        {labTests.map((test, idx) => (
                                            <li key={idx} className="list-group-item">
                                                {test || 'Unknown'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No lab tests ordered</p>
                                )}
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-success mr-2"
                                        onClick={handlePrint}
                                    >
                                        Print
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleBack}
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionReceipt;