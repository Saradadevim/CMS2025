import axios from "axios";

const API_BASE = "https://saradadevi.pythonanywhere.com/api";

// Helper function to get headers with JWT token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No JWT token found in localStorage');
    }
    return { Authorization: `Bearer ${token}` };
};

// Function to fetch appointments
export const fetchAppointments = async (view) => {
    try {
        const response = await axios.get(`${API_BASE}/auth/appointments/${view}/`, {
            headers: getAuthHeaders(),
        });
        console.log(`Appointments Response for ${view}:`, response.data);
        if (!response.data || typeof response.data !== 'object') {
            throw new Error(`Invalid response format for ${view} appointments`);
        }
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${view} appointments:`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

// Function to fetch patient history by token or registration number
export const fetchPatientHistory = async (params) => {
    try {
        console.log('Fetching patient history with params:', params); // Log the parameters
        const response = await axios.get(`${API_BASE}/auth/patient-history/`, {
            headers: getAuthHeaders(),
            params,
        });
        console.log('Patient History Response:', response.data);
        return response.data.results || [];
    } catch (error) {
        console.error('Error fetching patient history:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

// Function to fetch lab test results by token number
export const fetchLabTestResults = async (tokenNumber) => {
    try {
        const response = await axios.get(`${API_BASE}/auth/lab-test-results/`, {
            headers: getAuthHeaders(),
            params: { token_number: tokenNumber },
        });
        console.log('Lab Test Results Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching lab test results:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

export const fetchMedicines = async () => {
    try {
        const response = await axios.get(`${API_BASE}/auth/medicines/`, {
            headers: getAuthHeaders(),
        });
        return response.data; // Return the medicines data
    } catch (error) {
        console.error('Error fetching medicines:', error);
        throw error;
    }
};

// Function to fetch all lab tests
export const fetchLabTests = async (params = {}) => {
    try {
        const response = await axios.get(`${API_BASE}/auth/lab-tests/`, {
            headers: getAuthHeaders(),
            params, // Pass query parameters for filtering
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching lab tests:', error);
        throw error;
    }
};

// Function to fetch a consultation by ID
export const fetchConsultation = async (consultationId) => {
    try {
        const response = await axios.get(`${API_BASE}/auth/patient-consultation/${consultationId}/`, {
            headers: getAuthHeaders(),
        });
        console.log('Consultation Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching consultation:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

// Function to update a consultation
export const updateConsultation = async (consultationId, consultationData) => {
    try {
        const response = await axios.put(`${API_BASE}/auth/patient-consultation/${consultationId}/`, consultationData, {
            headers: getAuthHeaders(),
        });
        console.log('Update Consultation Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating consultation:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

// Function to refer a patient to another doctor
export const referToDoctor = async (referralData) => {
    try {
        const response = await axios.post(`${API_BASE}/auth/refer-to-doctor/`, referralData, {
            headers: getAuthHeaders(),
        });
        console.log('Refer to Doctor Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error referring to doctor:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

// Function to fetch departments
export const fetchDepartments = async (params = {}) => {
    try {
        const response = await axios.get(`${API_BASE}/auth/departments/`, {
            headers: getAuthHeaders(),
            params,
        });
        console.log('Departments Response:', response.data);
        return response.data.results || [];
    } catch (error) {
        console.error('Error fetching departments:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

// Function to add a consultation
export const addConsultation = async (consultationData) => {
    try {
        const payload = {
            token_number: consultationData.token_number,
            notes: consultationData.Notes || '',
            medicines: consultationData.medicines || [], // Ensure medicines is included
            lab_tests: consultationData.lab_tests || [] // Ensure lab_tests is included
        };

        const response = await axios.post(`${API_BASE}/auth/patient-consultation/`, payload, {
            headers: getAuthHeaders(),
        });
        console.log('Add Consultation Response:', response.data);
        // Ensure medicines and lab_tests are properly included in the response
        const formattedResponse = {
            ...response.data,
            medicines: response.data.medicines || [], // Ensure medicines is an array
            lab_tests: response.data.lab_tests || [], // Ensure lab_tests is an array
            Notes: response.data.Notes || JSON.stringify({ clinical_notes: payload.notes, medicines: payload.medicines })
        };

    return formattedResponse;
    } catch (error) {
        console.error('Error adding consultation:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

// Function to fetch tomorrow's appointments
export const fetchTomorrowAppointments = async () => {
    try {
        const response = await axios.get(`${API_BASE}/auth/appointments/tomorrow/`, {
            headers: getAuthHeaders(),
        });
        console.log('Tomorrow Appointments Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching tomorrow\'s appointments:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

// Function to fetch upcoming appointments
export const fetchUpcomingAppointments = async () => {
    try {
        const response = await axios.get(`${API_BASE}/auth/appointments/upcoming/`, {
            headers: getAuthHeaders(),
        });
        console.log('Upcoming Appointments Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching upcoming appointments:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};

// Function to fetch previous appointments
export const fetchPreviousAppointments = async (params = {}) => {
    try {
        const response = await axios.get(`${API_BASE}/auth/appointments/previous/`, {
            headers: getAuthHeaders(),
            params,
        });
        console.log('Previous Appointments Response:', response.data);
        if (!response.data || typeof response.data !== 'object') {
            throw new Error('Invalid response format for previous appointments');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching previous appointments:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw error;
    }
};