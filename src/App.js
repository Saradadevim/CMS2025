import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Signup from "./Authentication/Signup.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./Authentication/Login.js";
import AdminDashboard from "./Admin-Dashboard/Admin_Dashboard.js";
import AdminStaffDashboard from "./Admin-Dashboard/Admin-Staff/Admin_Staff_Dashboard.js";
import AddStaff from "./Admin-Dashboard/Admin-Staff/New_AddStaff.js";
import EditStaff from "./Admin-Dashboard/Admin-Staff/Edit_Staff.js";
import DeleteStaff from "./Admin-Dashboard/Admin-Staff/Delete_Staff.js";
import ActivateStaff from "./Admin-Dashboard/Admin-Staff/Activate_Staff.js";
import AdminDoctorDashboard from "./Admin-Dashboard/Admin-Doctor/Admin_Doctor_Dashboard.js";
import AddDoctor from "./Admin-Dashboard/Admin-Doctor/Add_Doctor.js";
import EditDoctor from "./Admin-Dashboard/Admin-Doctor/Edit_Doctor.js";
import DeactivateDoctor from "./Admin-Dashboard/Admin-Doctor/Deactivate_Doctor.js";
import ActivateDoctor from "./Admin-Dashboard/Admin-Doctor/Activate_Doctor.js";
import ViewStaff from "./Admin-Dashboard/Admin-Staff/View_Staff.js";
import ViewDoctor from "./Admin-Dashboard/Admin-Doctor/View_Doctor.js";
import AdminMedicineDashboard from "./Admin-Dashboard/Admin-Medicine/Admin-Medicine-Dashboard.js";
import AddMedicine from "./Admin-Dashboard/Admin-Medicine/Add_Medicine.js";
import EditMedicine from "./Admin-Dashboard/Admin-Medicine/Edit_Medicine.js";
import ViewMedicine from "./Admin-Dashboard/Admin-Medicine/View_Medicine.js";
import AdminLabTestDashboard from "./Admin-Dashboard/Admin-Lab-Test/Admin_LabTest_Dashboard.js";
import AddLabTest from "./Admin-Dashboard/Admin-Lab-Test/Add_LabTest.js";
import ViewLabTest from "./Admin-Dashboard/Admin-Lab-Test/View_LabTest.js";
import EditLabTest from "./Admin-Dashboard/Admin-Lab-Test/Edit_LabTest.js";
import ReceptionistDashboard from "./Receptionist-Dashboard/Receptionist_Dashboard.js";
import PatientDashboard from "./Receptionist-Dashboard/Patient-Dashboard/Patient_Dashboard.js";
import Pharmacist_Dashboard from "./Pharmacist-Dashboard/Pharmacist_Dashboard.js";
import MedicineStockDashboard from "./Pharmacist-Dashboard/MedicineStockDashboard.js";
import ViewPatient from "./Receptionist-Dashboard/Patient-Dashboard/View_Patient.js";
import EditPatient from "./Receptionist-Dashboard/Patient-Dashboard/Edit_Patient.js";
import AddPatient from "./Receptionist-Dashboard/Patient-Dashboard/Add_Patient.js";
import BookAppointment from "./Receptionist-Dashboard/Appointment-Module/Book_Appointment.js";
import AddAppointment from "./Receptionist-Dashboard/Appointment-Module/AppointmentForm.js";
import ViewAppointment from "./Receptionist-Dashboard/Appointment-Module/View_Appointment.js";
import Appointment_Billing_Dashboard from "./Receptionist-Dashboard/Appointment-Billing-Module/AppointmentBilling_Dashboard.js";
import AddBillingByID from "./Receptionist-Dashboard/Appointment-Billing-Module/Billing_By_ID.js";
import Edit_Appointment from "./Receptionist-Dashboard/Appointment-Module/Edit_Appointment.js";
import FetchAppointmentID from "./Receptionist-Dashboard/Appointment-Billing-Module/Fetch_AppointmentID.js";
import View_AppointmentBill from "./Receptionist-Dashboard/Appointment-Billing-Module/View_AppointmentBill.js";
import Edit_AppointmentBill from "./Receptionist-Dashboard/Appointment-Billing-Module/Edit_AppointmentBill.js";
import PrintAppointment from "./Receptionist-Dashboard/Appointment-Module/Print_AppointmentForm.js";
import Add_Medicine_Stock from "./Pharmacist-Dashboard/Add_Stock_Management.js";
import Pharmacist_Bill from "./Pharmacist-Dashboard/Pharmacist_Billing.js";
import Edit_MedicineStoc from "./Pharmacist-Dashboard/Edit_Medicine_Stock.js";
import View_MedicineStock from "./Pharmacist-Dashboard/View_Medicine_Stock.js";
import ResultAndBill_Dashboard from "./Lab Technician Module/Lab_Technician_Dashboard.js";
import View_LabTestBill from "./Lab Technician Module/View_LabTestBill.js";
import Add_LabResultBill from "./Lab Technician Module/Add_LabTest_ResultBill.js";
import Edit_LabTest_Result from "./Lab Technician Module/Edit_LabTest_Result.js";
import DoctorRoutes from './DoctorModule/Routes/DoctorRoutes';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App()
{
  return(
    <Router>
      <Routes>
        {/* Authentication Links */}
        <Route path="/signup" element = {<Signup/>}/>
        <Route path="/" element = {<Login/>}/>
        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element = {<AdminDashboard/>}/>
        {/* Admin -> Staff Pages */}
        <Route path="/admin-staff-dashboard" element = {<AdminStaffDashboard/>}/>
        <Route path="/new-add-staff" element = {<AddStaff/>}/>
        <Route path="edit-staff/:id" element = {<EditStaff/>}/>
        <Route path="/view-staff/:id" element = {<ViewStaff/>}/>
        <Route path="/delete-staff/:id" element = {<DeleteStaff/>}/>
        <Route path="/activate-staff/:id" element = {<ActivateStaff/>}/>
        {/* Admin -> Doctor pages */}
        <Route path="/admin-doctor-dashboard" element = {<AdminDoctorDashboard/>}/>
        <Route path="/add-doctor" element = {<AddDoctor/>}/>
        <Route path = "/edit-doctor/:id" element={<EditDoctor/>}/>
        <Route path="/deactivate-doctor/:id" element = {<DeactivateDoctor/>}/>
        <Route path="/activate-doctor/:id" element = {<ActivateDoctor/>}/>
        <Route path="/view-doctor/:id" element = {<ViewDoctor/>}/>
        {/* Admin -> Medicine pages */}
        <Route path="/admin-medicine-dashboard" element = {<AdminMedicineDashboard/>}/>
        <Route path="/add-medicine" element = {<AddMedicine/>}/>
        <Route path="/edit-medicine/:id" element = {<EditMedicine/>}/>
        <Route path="/view-medicine/:id" element = {<ViewMedicine/>}/>
        {/* Lab Test URLs */}
        <Route path="/admin-labtest-dashboard" element = {<AdminLabTestDashboard/>}/>
        <Route path="/add-labtest" element = {<AddLabTest/>}/>
        <Route path="/view-labtest/:id" element = {<ViewLabTest/>}/>
        <Route path="/edit-labtest/:id" element = {<EditLabTest/>}/>
        {/* Receptionist Dashboard */}
        <Route path="/recep-dashboard" element = {<ReceptionistDashboard/>}/>
        <Route path="/book-appointment" element = {<BookAppointment/>}/>
        <Route path="/new-appointment" element = {<AddAppointment/>}/>
        <Route path="/view-appointment/:id" element = {<ViewAppointment/>}/>
        <Route path="/edit-appointment/:id" element = {<Edit_Appointment/>}/>
        <Route path="/print-appointment/:id" element = {<PrintAppointment/>}/>

        {/* Appointment Bill Generation URLs */}
        <Route path="/appointment-bill-dashboard" element = {<Appointment_Billing_Dashboard/>}/>
        <Route path="/bill-by-id" element = {<AddBillingByID/>}/>
        <Route path="/bill-by-name" element = {<FetchAppointmentID/>}/>
        <Route path="/view-bill/:id" element = {<View_AppointmentBill/>}/>
        <Route path="/edit-bill/:id" element = {<Edit_AppointmentBill/>}/>

        {/* Patient Dashboard */}
        <Route path="/patient-dashboard" element = {<PatientDashboard/>}/>
        <Route path="/add-patient" element = {<AddPatient/>}/>
        <Route path="/view-patient/:id" element = {<ViewPatient/>}/>
        <Route path="/edit-patient/:id" element = {<EditPatient/>}/>

        {/* Pharmacist Modules */}
        <Route path="/pharmacist-dashboard" element = {<Pharmacist_Dashboard/>}/>
        <Route path="/med-stock-management" element = {<MedicineStockDashboard/>}/>
        <Route path="/add-med-stock" element = {<Add_Medicine_Stock/>}/>
        <Route path="/edit-med-stock/:id" element = {<Edit_MedicineStoc/>}/>
        <Route path="/view-med-stock/:id" element = {<View_MedicineStock/>}/>
        <Route path="/pharmacist-billing" element = {<Pharmacist_Bill/>}/>

        {/* Lab Technician Modules */}
        <Route path="/labTech-dashboard" element = {<ResultAndBill_Dashboard/>}/>
        <Route path="/view-labtest-resultBill/:id" element = {<View_LabTestBill/>}/>
        <Route path="/edit-labtest-result/:id" element = {<Edit_LabTest_Result/>}/>
        <Route path="/add-labtest-result" element = {<Add_LabResultBill/>}/>

        {/* Doctor Modules */}
        <Route path="/*" element={ <ProtectedRoute> <DoctorRoutes /> </ProtectedRoute>}/>

      </Routes>
    </Router>
  )
}
export default App;