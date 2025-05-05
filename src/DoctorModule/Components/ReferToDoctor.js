import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchDepartments, referToDoctor } from '../services/apiService';

const ReferToDoctor = () => {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        department_name: '',
        doctor_name: '',
        patient_registration_number: '',
        Appointment_Date: '',
        Appointment_Time: '',
    });
    const [doctors, setDoctors] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedView, setSelectedView] = useState('Today');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchDepartments({ active_only: true });
                setDepartments(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch departments');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDepartmentChange = (e) => {
        const selectedDept = departments.find((dept) => dept.Department_Name === e.target.value);
        setFormData({ ...formData, department_name: e.target.value, doctor_name: '' });
        setDoctors(selectedDept ? selectedDept.doctors : []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await referToDoctor(formData);
            setSuccess('Referral created successfully');
            setError(null);
            setFormData({
                department_name: '',
                doctor_name: '',
                patient_registration_number: '',
                Appointment_Date: '',
                Appointment_Time: '',
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create referral');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleViewChange = (view) => {
        setSelectedView(view);
        const routes = {
            Today: '/doctor-dashboard',
            Tomorrow: '/tomorrow-appointments',
            Upcoming: '/upcoming-appointments',
            Previous: '/previous-appointments',
        };
        navigate(routes[view]);
    };

    return (
        <div className="relative min-h-screen bg-gray-100">
            {showSidebar && (
                <Sidebar
                    doctorName="Dr. John Doe"
                    toggleSidebar={toggleSidebar}
                    handleLogout={handleLogout}
                />
            )}
            <Navbar
                toggleSidebar={toggleSidebar}
                selectedView={selectedView}
                handleViewChange={handleViewChange}
                showSidebar={showSidebar}
            />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Refer to Doctor</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                    <div className="mb-4">
                        <label className="block mb-1">Department</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={formData.department_name}
                            onChange={handleDepartmentChange}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.Department_ID} value={dept.Department_Name}>
                                    {dept.Department_Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Doctor</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={formData.doctor_name}
                            onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                            required
                            disabled={!formData.department_name}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.doctor_id} value={doctor.doctor_name}>
                                    {doctor.doctor_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Patient Registration Number</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={formData.patient_registration_number}
                            onChange={(e) =>
                                setFormData({ ...formData, patient_registration_number: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Appointment Date</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={formData.Appointment_Date}
                            onChange={(e) => setFormData({ ...formData, Appointment_Date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            max={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Appointment Time</label>
                        <input
                            type="time"
                            className="w-full p-2 border rounded"
                            value={formData.Appointment_Time}
                            onChange={(e) => setFormData({ ...formData, Appointment_Time: e.target.value })}
                            min="08:00"
                            max="20:00"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Refer Patient
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReferToDoctor;