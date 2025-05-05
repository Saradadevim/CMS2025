import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeactivateDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doc_name, setDoctorName] = useState("");

    useEffect(() => {
        const auth_token = localStorage.getItem("token");
        const fetchDoctor = async () => {
            try {
                const doctor_response = await axios.get(`http://localhost:8000/api/doctors/${id}/`,
                    {
                        headers: {
                            Authorization: `Token ${auth_token}`,
                        },
                    });
                setDoctorName(doctor_response.data.Doctor_Name);
            }
            catch (error) {
                console.log(error);
                alert("Error in fetching the doctor's details");
            }
        };
        fetchDoctor();
    }, [id]);

    const handleDeactivation = async () => {
        try {
            const auth_token = localStorage.getItem("token");
            await axios.patch(
                `http://localhost:8000/api/doctors/${id}/deactivate/`,
                {}, // empty data object since you're not sending any data
                {
                    headers: { Authorization: `Token ${auth_token}` },
                }
            );
            alert("Doctor deactivated successfully");
            navigate("/admin-doctor-dashboard");
        } catch (error) {
            console.log(error);
            alert("Error deactivating the doctor");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col md-6">
                    <div className="card shadow p-4 text-center">
                        <h2 className="text-danger">Deactivate Doctor</h2>
                        <p className="mt-3">
                            Are you sure you want to deactivate <strong>{doc_name}</strong>?
                        </p>
                        <div className="d-flex justify-content-center mt-4">
                            <button className="btn btn-danger me-3" onClick={handleDeactivation}>Yes, Deactivate</button>
                            <button className="btn btn-secondary" onClick={() => navigate("/admin-doctor-dashboard")}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeactivateDoctor;