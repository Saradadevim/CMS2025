import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ActivateStaff = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [staffName, setStaffName] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const auth_token = localStorage.getItem("token");
        const fetchStaff = async () => {
            try {
                const staffRes = await axios.get(`http://localhost:8000/api/staff/${id}/`, {
                    headers: {
                        Authorization: `Token ${auth_token}`,
                    }
                });
                setStaffName(staffRes.data.Full_Name);
                // Check if staff is already active
                if (staffRes.data.Staff_Status === true) {
                    setIsActive(true);
                }
            }
            catch (error) {
                console.log(error);
                alert("Error in fetching the staff's details");
            }
        };
        fetchStaff();
    }, [id]);

    const handleActivate = async () => {
        if (isActive) {
            alert("The staff is already activated");
            navigate("/admin-staff-dashboard");
            return;
        }

        try {
            const activate_token = localStorage.getItem("token");
            await axios.patch(`http://localhost:8000/api/staff/${id}/`,
                {
                    Staff_Status: true
                },
                { headers: { Authorization: `Token ${activate_token}` } }
            );
            alert("Staff activated successfully");
            navigate("/admin-staff-dashboard");
        }
        catch (error) {
            console.log(error);
            alert("Error activating the staff");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4 text-center">
                        <h2 className="text-success">Activate Staff</h2>
                        {!isActive ? (
                            <>
                                <p className="mt-3">
                                    Are you sure you want to activate <strong>{staffName}</strong>?
                                </p>
                                <div className="d-flex justify-content-center mt-4">
                                    <button className="btn btn-success me-3" onClick={handleActivate}>Yes, Activate</button>
                                    <button className="btn btn-secondary" onClick={() => navigate("/admin-staff-dashboard")}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="mt-3">
                                    <strong>{staffName}</strong> is already activated.
                                </p>
                                <button className="btn btn-secondary mt-4" onClick={() => navigate("/admin-staff-dashboard")}>
                                    Back to Dashboard
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivateStaff;