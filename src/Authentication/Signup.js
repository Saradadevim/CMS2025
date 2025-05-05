import { useState } from "react";
// import axios from "axios";
import { signUpUser } from "../Service/apiService";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [group_name, setGroupName] = useState("");

    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const navigate = useNavigate();

    // Validations
    const validateUsername = (name) =>
        /[a-zA-Z]/.test(name) && /\d/.test(name) && /^[a-zA-Z0-9]+$/.test(name);

    const validatePassword = (pass) =>
        /[a-zA-Z]/.test(pass) &&
        /\d/.test(pass) &&
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass);

    const validGroups = ["Admin", "Receptionist", "Doctor", "Lab Technician", "Pharmacist"];
    const validateGroup = (group) => validGroups.includes(group);

    const showPopup = (text, type = "danger") => {
        setMessageText(text);
        setMessageType(type);
        setShowMessage(true);
    };

    const handlesignup = async (e) => {
        e.preventDefault();

        if (!validateUsername(username)) {
            showPopup("Username must contain both letters and numbers, and only alphanumeric characters.");
            return;
        }

        if (!validatePassword(password)) {
            showPopup("Password must contain at least one letter, one number, and one special character.");
            return;
        }

        if (!validateGroup(group_name)) {
            showPopup("Group name must be one of: Admin, Receptionist, Doctor, Lab Technician, Pharmacist.");
            return;
        }

        try {
            const response = await signUpUser({username, password, group_name});

            localStorage.setItem("token", response.data.tokens.access);

            showPopup("Signup successful!", "success");

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            showPopup("Error signing up. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h2 className="text-center">Signup</h2>
                        <form onSubmit={handlesignup}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Group Name (e.g., Doctor)"
                                    onChange={(e) => setGroupName(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Message Popup */}
            {showMessage && (
                <div
                    className="position-fixed top-50 start-50 translate-middle bg-white border border-2 p-4 rounded shadow"
                    style={{ zIndex: 1050, minWidth: "300px", textAlign: "center" }}
                >
                    <div className={`alert alert-${messageType} mb-3`} role="alert">
                        {messageText}
                    </div>
                    <button className="btn btn-outline-primary" onClick={() => setShowMessage(false)}>
                        OK
                    </button>
                </div>
            )}
        </div>
    );
};

export default Signup;