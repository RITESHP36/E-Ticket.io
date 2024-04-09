import React, { useState, useEffect } from "react";
import { supabase } from "../components/createClient"; // Adjust the path as necessary
import AdminTicketGenerate from "../trash/AdminTicketGenerate"; // Import the AdminTicketGenerate component
import AdminTicketViewer from "../trash/AdminTicketViewer"; // Import the AdminTicketViewer component
import AdminTicketGenerateNew from "./AdminTicketGenerateNew";
import Ticket from "./Ticket";
import Toast from "react-hot-toast";

const AdminDashboard = () => {
	const [tickets, setTickets] = useState([]);
	const [generatingTicket, setGeneratingTicket] = useState(null);
	const [viewingTicket, setViewingTicket] = useState(null);
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		const { data, error } = await supabase
			.from("tickets")
			.select("name, email, isGenerated, uuid , reg_no");

		if (error) {
			console.error("Error fetching tickets:", error);
		} else {
			setTickets(data);
		}
	};

	// Callback function to initiate ticket generation
	const handleGenerateTicket = (name) => {
		setGeneratingTicket({ name });
		setViewingTicket(null);
	};

	const handleShowTicket = async (uuid) => {
		const { data, error } = await supabase
			.from("tickets")
			.select("name,uuid")
			.eq("uuid", uuid);

		if (error) {
			console.error("Error fetching ticket:", error);
		} else {
			const ticket = data[0]; // Assuming the uuid is unique and only one ticket is returned
			setViewingTicket(ticket);
			setGeneratingTicket(null);
			console.log({ uuid, viewingTicket });
			fetchTickets(); // Fetch the updated list of tickets
		}
	};

	const handleAddTicket = async () => {
		if (newName.trim() && newEmail.trim()) {
			const { data, error } = await supabase
				.from("tickets")
				.insert([{ name: newName, email: newEmail, isGenerated: false }]);

			if (error) {
				console.error("Error inserting ticket:", error);
			} else {
				setNewName("");
				setNewEmail("");
				fetchTickets();
			}
		}
	};

	const handleCopyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		Toast.success("Link copied to clipboard");
	};

	return (
		<div className=" flex gap-10 h-full ">
			<div className="w-2/3 mt-4 ml-4">
				<div className="mb-4">
					<input
						type="text"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						placeholder="Enter Name"
						className="p-2 border rounded"
					/>
					<input
						type="email"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						placeholder="Enter Email"
						className="p-2 border rounded ml-2"
					/>
					<button
						onClick={handleAddTicket}
						className="p-2 ml-2 bg-green-500 text-white rounded"
					>
						Add Ticket
					</button>
				</div>
				<table className="w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Reg. No.
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Is Generated
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y-2 divide-gray-200 ">
						{tickets.map((ticket, index) => (
							<tr key={index}>
								<td className="px-6 py-4 whitespace-nowrap">{ticket.name}</td>
								<td className="px-6 py-4 whitespace-nowrap">{ticket.reg_no}</td>
								<td className="px-6 py-4 whitespace-nowrap">{ticket.email}</td>
								<td className="px-6 py-4 whitespace-nowrap text-center">
									{ticket.isGenerated ? "Yes" : "No"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{ticket.isGenerated ? (
										<>
											<button
												onClick={() => handleShowTicket(ticket.uuid)}
												className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
											>
												Show 
											</button>
											<button
												onClick={() => handleGenerateTicket(ticket.name)}
												className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
											>
												Update 
											</button>
											<button
											onClick={() => handleCopyToClipboard("http://kj-ticket.vercel.app/token/" + ticket.name+ "/" + ticket.uuid)}
											className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2 cursor-pointer"
										>
											Copy Link
										</button>
										</>
									) : (
										<button
											onClick={() => handleGenerateTicket(ticket.name)}
											className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
										>
											Generate Ticket
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="w-1/3 ">
				{generatingTicket && (
					<AdminTicketGenerateNew name={generatingTicket.name} />
				)}
				{viewingTicket && (
					<Ticket
						name={viewingTicket.name}
						uuid={viewingTicket.uuid}
						width={700}
					/>
				)}
				{!generatingTicket && !viewingTicket && (
					<div className="flex justify-center items-center h-full">
						<p className="text-blue-600 text-lg font-semibold text-center">
							Please select one of the users to display.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
