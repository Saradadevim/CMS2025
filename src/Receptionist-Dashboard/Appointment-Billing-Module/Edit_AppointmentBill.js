import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Edit_AppointmentBill = () => {
    const { id } = useParams();
    const [appointmentID, setAppointmentID] = useState("");
    const [payment_status, setPaymentStatus] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                const appointmentBill_response = await axios.get(`http://localhost:8000/api/appointment_billings/${id}`, config);
                setAppointmentID(appointmentBill_response.data.Appointment_Billing_ID);
                setPaymentStatus(appointmentBill_response.data.Payment_Status);
            }
            catch (error) {
                console.log(error);
                alert("Error fetching the data... Please refer to the console for more info!");
                setLoading(false);
            }
        };
        fetchAppointmentData();
    }, [id])

    const handle_EditAppointmentBill = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Token ${token}`,
            },
        };
        if (!payment_status) {
            alert("Please fill all required fields");
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/appointment_billings/${id}/`,
                {
                    appointment: appointmentID,
                    Service_Charge: 10,
                    Payment_Status: payment_status
                }, config
            );
            alert("Appointment billing data updated successfully!!")
            navigate("/appointment-bill-dashboard");
        }
        catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error updated the appointment");
        }
    };
    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-warning text-white">
                    <h4 className="mb-0">Edit Appointment Billing</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handle_EditAppointmentBill}>
                        <div className="mb-3">
                            <label className="form-label">Appointment Billing ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointmentID}
                                disabled
                            />
                        </div>
    
                        <div className="mb-3">
                            <label className="form-label">Payment Status <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                value={payment_status}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                required
                            >
                                <option value="">-- Select Status --</option>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
    
                        <button type="submit" className="btn btn-success me-2">Update</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );    
};
export default Edit_AppointmentBill;