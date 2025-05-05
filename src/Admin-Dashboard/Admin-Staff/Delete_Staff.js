import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteStaff = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [staffName, setStaffName] = useState("");
    const [isActive, setIsActive] = useState(true);

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
                // Check if staff is already inactive based on Staff_Status
                if (staffRes.data.Staff_Status === false) {
                    setIsActive(false);
                }
            }
            catch (error) {
                console.log(error);
                alert("Error in fetching the staff's details");
            }
        };
        fetchStaff();
    }, [id]);

    const handleDelete = async () => {
        if (!isActive) {
            alert("The staff is already deactivated");
            navigate("/admin-staff-dashboard");
            return;
        }

        try {
            const delete_token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/staff/${id}/`,
                {
                    headers: { Authorization: `Token ${delete_token}` },
                }
            );
            alert("Staff deactivated successfully");
            navigate("/admin-staff-dashboard");
        }
        catch (error) {
            console.error(error);
            alert("Error deleting the staff");
            navigate("/admin-staff-dashboard");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col md-6">
                    <div className="card shadow p-4 text-center">
                        <h2 className="text-danger">Deactivate Staff</h2>
                        {isActive ? (
                            <>
                                <p className="mt-3">
                                    Are you sure you want to deactivate <strong>{staffName}</strong>?
                                </p>
                                <div className="d-flex justify-content-center mt-4">
                                    <button className="btn btn-danger me-3" onClick={handleDelete}>Yes, Deactivate</button>
                                    <button className="btn btn-secondary" onClick={() => navigate("/admin-staff-dashboard")}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="mt-3">
                                    <strong>{staffName}</strong> is already deactivated.
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

export default DeleteStaff;