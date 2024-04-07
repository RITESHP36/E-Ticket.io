import React from "react";
import AdminTicketGenerate from "../components/AdminTicketGenerate";
import AdminDashboard from "../components/AdminDashboard";
import Ticket from "../components/Ticket";
import AdminAllTicket from "../components/AdminAllTicket";

const Admin = () => {
	return (
		<div>
			<AdminDashboard />
			<AdminAllTicket />
			{/* <AdminTicketGenerate /> */}
			{/* <Ticket name="Ritesh Pradhan" uuid="2b3d0ef4-0a4e-443d-b742-8e23e01e84f2" /> */}
		</div>
	);
};

export default Admin;
