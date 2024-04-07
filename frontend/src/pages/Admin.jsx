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
			{/* <Ticket name="ritesh pradhan" uuid="d9219e1e-e2ae-4f09-b0d4-4f9fc355d30e" /> */}
		</div>
	);
};

export default Admin;
