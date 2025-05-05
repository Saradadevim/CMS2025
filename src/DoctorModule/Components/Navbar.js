import React from 'react';

const Navbar = ({ toggleSidebar, selectedView, handleViewChange }) => {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: '#dc3545', // Red background for the navbar
         // White text for better contrast
          }}
            >
          <button
            className="btn btn-light me-3"
            onClick={toggleSidebar}
            style={{
              fontWeight: 'bold',
            }}
          >
            ☰ Menu
          </button>

          <div className="navbar-brand text-white">Doctor Dashboard</div>

          <div className="ms-auto">
            {['Today', 'Tomorrow', 'Upcoming', 'Previous'].map((view) => (
              <button
            key={view}
            className={`btn mx-1 ${
              selectedView === view ? 'btn-danger' : 'btn-outline-light'
            }`}
            style={{
              backgroundColor: selectedView === view ? '#f0ead6' : 'transparent', // Eggshell white for active buttons
              color: selectedView === view ? '#000000' : '#f0ead6', // Black text for active buttons, eggshell white for inactive
              borderColor: '#f0ead6', // Eggshell white border for inactive buttons
              boxShadow:
                selectedView === view
              ? '0px 4px 15px rgba(240, 234, 214, 0.5)' // Blur effect for active buttons
              : 'none',
              transform: 'scale(1)', // Default scale
              transition: 'transform 0.2s ease-in-out, background-color 0.2s ease', // Smooth transition
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')} // Scale up on hover
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')} // Scale back to normal
            onClick={() => {
              handleViewChange(view);
              if (view === 'Today') {
                window.location.href = '/doctor-dashboard';
              } else if (view === 'Tomorrow') {
                window.location.href = '/tomorrow-appointments';
              } else if (view === 'Upcoming') {
                window.location.href = '/upcoming-appointments';
              } else if (view === 'Previous') {
                window.location.href = '/previous-appointments';
              }
            }}
              >
            {view}
              </button>
            ))}
          </div>
    </nav>
  );
};

export default Navbar;