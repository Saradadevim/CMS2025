import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorDashboard from '../Components/DoctorDashboard';
import TomorrowAppointments from '../Components/TomorrowAppointment';
import UpcomingAppointments from '../Components/UpcomingAppointments';
import PreviousAppointments from '../Components/PreviousAppointments';
import PatientHistory from '../Components/PatientHistory';
import LabTests from '../Components/Labtest';
import Medicines from '../Components/Medicines';
import ReferToDoctor from '../Components/ReferToDoctor';
import LabTestResults from '../Components/LabTestResult';
import AddConsultation from '../Components/AddConsultation';
import ViewConsultation from '../Components/ViewConsultation';
import UpdateConsultation from '../Components/UpdateConsultation';
import PrescriptionReceipt from '../Components/PrescriptionRecepit';


const DoctorRoutes = () => {
    return (
        <Routes>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/tomorrow-appointments" element={<TomorrowAppointments />} />
            <Route path="/upcoming-appointments" element={<UpcomingAppointments />} />
            <Route path="/previous-appointments" element={<PreviousAppointments />} />
            <Route path="/patient-history" element={<PatientHistory />} />
            <Route path="/lab-tests" element={<LabTests />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/refer-to-doctor" element={<ReferToDoctor />} />
            <Route path="/lab-test-results" element={<LabTestResults />} />
            <Route path="/add-consultation" element={<AddConsultation />} />
            <Route path="/view-consultation/:id" element={<ViewConsultation />} />
            <Route path="/update-consultation/:id" element={<UpdateConsultation />} />
            <Route path="/prescription-receipt" element={<PrescriptionReceipt />} />

        </Routes>
    );
};

export default DoctorRoutes;