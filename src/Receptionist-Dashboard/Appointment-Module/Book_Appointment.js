import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientType, setPatientType] = useState('new');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.get("http://127.0.0.1:8000/api/patient/", config);
        setPatients(response.data);
      } catch (error) {
        console.log(error);
        alert("Error fetching data. Check console for more info!");
      }
    };
    fetchPatientData();

    const fetchAppointmentData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.get("http://127.0.0.1:8000/api/appointments/", config);
        setAppointments(response.data);
      } catch (error) {
        console.log(error);
        alert("Error fetching appointment data. Check console for more info!");
      }
    };
    fetchAppointmentData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const filteredPatients = patients.filter((patient) =>
    patient.Patient_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAndNavigate = (patientId, patientName) => {
    localStorage.setItem("selectedPatientId", patientId);
    localStorage.setItem("selectedPatientName", patientName);
    navigate('/new-appointment');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container-fluid p-4 min-vh-100" style={{ backgroundColor: '#fff5f5' }}> {/* Very light red background */}
      {/* Header with Back and Logout buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          onClick={() => navigate('/recep-dashboard')}
          className="btn btn-link p-0 d-flex align-items-center"
          style={{ color: '#dc3545' }}
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
        <button 
          onClick={handleLogout} 
          className="btn btn-danger"
        >
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </button>
      </div>

      <h1 className="display-5 fw-bold mt-3">Book An Appointment</h1>

      {/* Patient type buttons */}
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h5 card-title text-muted mb-3">PATIENT</h2>
          <div className="d-flex gap-3">
            <button
              onClick={() => {
                setPatientType('existing');
                setShowModal(true);
              }}
              className={`btn btn-lg flex-grow-1 ${patientType === 'existing' ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              EXISTING
            </button>
            <button
              onClick={() => {
                setPatientType('new');
                navigate('/add-patient');
              }}
              className={`btn btn-lg flex-grow-1 ${patientType === 'new' ? 'btn-danger' : 'btn-outline-secondary'}`}
            >
              NEW PATIENT
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="card">
        <div className="card-body">
          <h2 className="h5 card-title text-muted mb-3">Appointments</h2>
          {appointments.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.Appointment_ID}>
                      <td>{appointment.patient_info?.Patient_Name}</td>
                      <td>{appointment.doctor_info?.Doctor_Name}</td>
                      <td>{formatDate(appointment.Appointment_Date)}</td>
                      <td>{formatTime(appointment.Appointment_Time)}</td>
                      <td>
                        <span className={`badge ${appointment.Status === 'Scheduled' ? 'bg-primary' :
                          appointment.Status === 'Completed' ? 'bg-success' :
                            appointment.Status === 'Cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
                          {appointment.Status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => navigate(`/view-appointment/${appointment.Appointment_ID}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => navigate(`/edit-appointment/${appointment.Appointment_ID}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => navigate(`/print-appointment/${appointment.Appointment_ID}`)}
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No appointments found.</p>
          )}
        </div>
      </div>

      {/* Modal for Existing Patients */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Existing Patient</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search by patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.Patient_ID}>
                        <td>{patient.Patient_Name}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleBookAndNavigate(patient.Patient_ID, patient.Patient_Name)}
                          >
                            Book Appointment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;