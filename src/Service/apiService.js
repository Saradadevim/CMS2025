import axios from "axios"

// Set the base URL for your API
const API_BASE = "https://saradadevi.pythonanywhere.com/api/";


// Function to login the user
export const loginUser = (credentials) => {
    return axios.post(`${API_BASE}/auth/login/`, credentials);
};

// Function to sign up a new user
export const signUpUser = (userData) => {
    return axios.post(`${API_BASE}/auth/signup/`, userData);
};

//