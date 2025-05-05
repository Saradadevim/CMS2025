import { useState, useRef } from "react";
import { loginUser } from "../Service/apiService";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageType, setMessageType] = useState("");
    const navigate = useNavigate();
    const timeoutRef = useRef(null);
    const [redirectPath, setRedirectPath] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({username, password});

            localStorage.setItem("Role", response.data.Role);
            localStorage.setItem("token", response.data.Data.Access);
            localStorage.setItem("Username", response.data.Username);

            const roleName = response.data.Role;

            setMessageText(`Login Successful, ${roleName}`);
            setMessageType("success");
            setShowMessage(true);

            // Determine redirect path based on role
            let targetPath;
            if (roleName === "admin") {
                targetPath = "/admin-dashboard";
            } else if (roleName === "receptionist") {
                targetPath = "/recep-dashboard";
            } else if (roleName === "Doctor") {
                targetPath = "/doctor-dashboard";
            } else if (roleName === "pharmacist") {
                targetPath = "/pharmacist-dashboard";
            } else if (roleName === "lab technician") {
                targetPath = "/labTech-dashboard";
            } else {
                targetPath = "/dashboard";
            }
            
            setRedirectPath(targetPath);

            // Set auto-navigation after 6 seconds
            timeoutRef.current = setTimeout(() => {
                navigate(targetPath);
            }, 6000);
        } catch (error) {
            console.log(error);
            setMessageText("Invalid Login Credentials!");
            setMessageType("danger");
            setShowMessage(true);
        }
    };

    const handleManualRedirect = () => {
        clearTimeout(timeoutRef.current);
        setShowMessage(false);
        navigate(redirectPath);
    };

    const handleExit = () => {
        window.close();
    };

    return (
        <div className="container mt-5">
            <style>
                {`
                    .custom-card {
                        background-color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589; /* Taupe Gray */
                    }
                    .custom-heading {
                        color: #DA2C43; /* Jelly Bean Red */
                    }
                    .custom-input {
                        background-color: #F0EAD6; /* Eggshell White */
                        border-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-input::placeholder {
                        color: #8B8589; /* Taupe Gray */
                    }
                    .custom-btn-login {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                        border-color: #D1BEA8;
                    }
                    .custom-btn-login:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-message {
                        background-color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589; /* Taupe Gray */
                    }
                    .custom-alert-success {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                        border-color: #D1BEA8;
                    }
                    .custom-alert-danger {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-ok {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589;
                    }
                    .custom-btn-ok:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-close {
                        background-color: #8B8589; /* Taupe Gray */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #8B8589;
                    }
                    .custom-btn-close:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                    .custom-btn-exit {
                        background-color: #D1BEA8; /* Dark Vanilla */
                        color: #8B8589; /* Taupe Gray */
                        border-color: #D1BEA8;
                    }
                    .custom-btn-exit:hover {
                        background-color: #DA2C43; /* Jelly Bean Red */
                        color: #F0EAD6; /* Eggshell White */
                        border-color: #DA2C43;
                    }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow custom-card">
                        <h2 className="text-center custom-heading">Login</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control custom-input"
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control custom-input"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn custom-btn-login w-100">Login</button>
                                <button type="button" className="btn custom-btn-exit" onClick={handleExit}>
                                    Exit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Message Box */}
            {showMessage && (
                <div
                    className="position-fixed top-50 start-50 translate-middle bg-white border border-2 p-4 rounded shadow custom-message"
                    style={{ zIndex: 1050, minWidth: "300px", textAlign: "center" }}
                >
                    <div className={`alert alert-${messageType} mb-3 custom-alert-${messageType}`} role="alert">
                        {messageText}
                    </div>
                    {messageType === "success" ? (
                        <div className="d-flex gap-2 justify-content-center">
                            <button className="btn custom-btn-ok" onClick={handleManualRedirect}>
                                OK
                            </button>
                            <button className="btn custom-btn-exit" onClick={handleExit}>
                                Exit
                            </button>
                        </div>
                    ) : (
                        <div className="d-flex gap-2 justify-content-center">
                            <button className="btn custom-btn-close" onClick={() => setShowMessage(false)}>
                                Close
                            </button>
                            <button className="btn custom-btn-exit" onClick={handleExit}>
                                Exit
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Login;