import React from "react";
import AdminTicketGenerate from "../trash/AdminTicketGenerate";
import AdminDashboard from "../components/AdminDashboard";
import Ticket from "../components/Ticket";
import AdminAllTicket from "../components/AdminAllTicket";
import AdminTicketStatus from "../components/AdminTicketStatus";
import AddUsers from "../components/AdminAddUser";
import ManageMail from "./ManageMail";

const Admin = () => {
	return (
		<div>
			<nav className="fixed w-full z-10">
				<div className="flex justify-between bg-gray-800 p-4">
					<div className="text-white font-bold">Admin Dashboard</div>
					<div className="flex space-x-8">
						<a
							href="/admin"
							className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
						>
							Home
						</a>
						<a
							href="#adduser"
							className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
						>
							Add Users
						</a>
						<a
							href="#generate"
							className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
						>
							Generate Ticket
						</a>
						<a
							href="#mail"
							className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
						>
							Manage Mail
						</a>
						<a
							href="#alltickets"
							className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
						>
							All Tickets
						</a>
						<a
							href="#status"
							className="text-white border border-white p-2 rounded hover:bg-yellow-500 hover:text-black"
						>
							Ticket Status
						</a>
					</div>
				</div>
			</nav>
			<div className="pb-14"></div>
			<AddUsers />
			<AdminDashboard />
			<ManageMail />
			<AdminAllTicket />
			<AdminTicketStatus />
			{/* <AdminTicketGenerate /> */}
			{/* <Ticket name="ritesh pradhan" uuid="d9219e1e-e2ae-4f09-b0d4-4f9fc355d30e" /> */}
		</div>
	);
};

export default Admin;
