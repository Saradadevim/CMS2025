import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultDoctorImage from '../assets/Default_Doc.jfif';

const Sidebar = ({ doctorName, toggleSidebar, handleLogout }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(DefaultDoctorImage);

  // Fetch the profile image from localStorage when the component mounts
  useEffect(() => {
    const savedImage = localStorage.getItem('doctorProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Handle file input change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setProfileImage(base64Image); // Update the profile image
        localStorage.setItem('doctorProfileImage', base64Image); // Save the image in localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="text-white p-3 vh-100 sidebar"
      style={{
        backgroundColor: '#dc3545', // Red background
        width: '25%', // Set the sidebar width to 45% of the screen
        position: 'fixed', // Fix the sidebar position
        top: 0,
        left: 0,
        zIndex: 1000,
        overflowY: 'auto', // Enable scrolling if content overflows
      }}
    >
      <button className="btn btn-sm btn-light mb-3" onClick={toggleSidebar}> {/* Light button */}
        ✖ Close
      </button>

      <div className="text-center mb-4">
        <img
          src={profileImage}
          alt="Doctor Profile"
          className="rounded-circle"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
        <h5 className="mt-2">{doctorName || 'Doctor'}</h5>
        <label className="btn btn-light btn-sm mt-2">
          Change Picture
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </label>
      </div>

      <ul className="nav flex-column">
          <li className="nav-item">
              <button
                  className="btn w-100 mb-2"
                  style={{
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      border: '1px solid #ffffff',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ff6b6b';
                      e.target.style.boxShadow = '0px 4px 15px rgba(255, 107, 107, 0.5)';
                      e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                  }}
                  onClick={() => navigate('/doctor-dashboard')} // Navigate to DoctorDashboard.js
              >
                  Appointments
              </button>
          </li>
          <li className="nav-item">
              <button
                  className="btn w-100 mb-2"
                  style={{
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      border: '1px solid #ffffff',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ff6b6b';
                      e.target.style.boxShadow = '0px 4px 15px rgba(255, 107, 107, 0.5)';
                      e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                  }}
                  onClick={() => navigate('/patient-history')} // Navigate to PatientHistory.js
              >
                  Patient History
              </button>
          </li>
          <li className="nav-item">
              <button
                  className="btn w-100 mb-2"
                  style={{
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      border: '1px solid #ffffff',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ff6b6b';
                      e.target.style.boxShadow = '0px 4px 15px rgba(255, 107, 107, 0.5)';
                      e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                  }}
                  onClick={() => navigate('/lab-tests')} // Navigate to LabTest.js
              >
                  Lab Tests
              </button>
          </li>
          <li className="nav-item">
              <button
                  className="btn w-100 mb-2"
                  style={{
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      border: '1px solid #ffffff',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ff6b6b';
                      e.target.style.boxShadow = '0px 4px 15px rgba(255, 107, 107, 0.5)';
                      e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                  }}
                  onClick={() => navigate('/medicines')} // Navigate to Medicines.js
              >
                  Medicines
              </button>
          </li>
          <li className="nav-item">
              <button
                  className="btn w-100 mb-2"
                  style={{
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      border: '1px solid #ffffff',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ff6b6b';
                      e.target.style.boxShadow = '0px 4px 15px rgba(255, 107, 107, 0.5)';
                      e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                  }}
                  onClick={() => navigate('/labtestresult')} // Navigate to LabTestResult.js
              >
                  Lab Test Result
              </button>
          </li>
          <li className="nav-item">
              <button
                  className="btn w-100 mb-2"
                  style={{
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      border: '1px solid #ffffff',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ff6b6b';
                      e.target.style.boxShadow = '0px 4px 15px rgba(255, 107, 107, 0.5)';
                      e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                  }}
                  onClick={() => navigate('/prescription-receipt')} // Navigate to PrescriptionReceipt.js
              >
                  Prescription Receipt
              </button>
          </li>
      </ul>

      <button
        className="btn w-100 mt-auto"
        style={{
          backgroundColor: '#ff6b6b', // Light red background for the logout button
          color: '#ffffff', // White text
          border: 'none', // No border
          boxShadow: '0px 4px 15px rgba(255, 107, 107, 0.5)', // Red blur effect
          transition: 'all 0.3s ease', // Smooth transition for hover effects
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#dc3545'; // Darker red on hover
          e.target.style.transform = 'scale(1.05)'; // Slightly enlarge the button
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#ff6b6b'; // Reset background
          e.target.style.transform = 'scale(1)'; // Reset size
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;