import React, { useState, useEffect } from "react";
import { supabase } from "../components/createClient"; // Adjust the path as necessary
import AdminTicketGenerate from "../trash/AdminTicketGenerate"; // Import the AdminTicketGenerate component
import AdminTicketViewer from "../trash/AdminTicketViewer"; // Import the AdminTicketViewer component
import AdminTicketGenerateNew from "./AdminTicketGenerateNew";
import Ticket from "./Ticket";
import Toast from "react-hot-toast";
import { QRCode } from "react-qr-code";

const AdminDashboard = () => {
	const [tickets, setTickets] = useState([]);
	const [generatingTicket, setGeneratingTicket] = useState(null);
	const [viewingTicket, setViewingTicket] = useState(null);
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newRegNo, setNewRegNo] = useState("");
	const [editingTicket, setEditingTicket] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState("all");
	const [allCount, setAllCount] = useState(0);
	const [generatedCount, setGeneratedCount] = useState(0);
	const [notGeneratedCount, setNotGeneratedCount] = useState(0);

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		let query = supabase
			.from("tickets")
			.select("name, email, isGenerated, uuid , reg_no")
			.order("name", { ascending: true }); // Order by name

		if (searchTerm) {
			query = query.ilike("name", `%${searchTerm}%`); // Filter by name if searchTerm is not empty
		}

		const { data, error } = await query;

		if (error) {
			console.error("Error fetching tickets:", error);
		} else {
			setTickets(data);
			setAllCount(data.length);
			setGeneratedCount(data.filter((item) => item.isGenerated).length);
			setNotGeneratedCount(data.filter((item) => !item.isGenerated).length);
		}
	};

	// Callback function to initiate ticket generation
	const handleGenerateTicket = (name) => {
		setGeneratingTicket({ name });
		setViewingTicket(null);

		// Reset generatingTicket state after 1 second
		setTimeout(() => {
			setGeneratingTicket(null);
		}, 2000);
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
			if (editingTicket) {
				const { data, error } = await supabase
					.from("tickets")
					.update({ name: newName, email: newEmail, reg_no: newRegNo }) // Add reg_no to the update object
					.eq("uuid", editingTicket.uuid);

				if (error) {
					console.error("Error updating ticket:", error);
					Toast.error("Error updating ticket");
				} else {
					Toast.success("Ticket updated successfully");
					setNewName("");
					setNewEmail("");
					setNewRegNo("");
					setEditingTicket(null);
					fetchTickets();
				}
			} else {
				const { data, error } = await supabase.from("tickets").insert([
					{
						name: newName,
						email: newEmail,
						reg_no: newRegNo,
						isGenerated: false,
					},
				]);

				if (error) {
					console.error("Error inserting ticket:", error);
					Toast.error("Error adding ticket");
				} else {
					Toast.success("Ticket added successfully");
					setNewName("");
					setNewEmail("");
					setNewRegNo("");
					fetchTickets();
				}
			}
		}
	};

	const handleCopyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		Toast.success("Link copied to clipboard");
	};

	const handleEditTicket = (ticket) => {
		setNewName(ticket.name);
		setNewEmail(ticket.email);
		setNewRegNo(ticket.reg_no);
		setEditingTicket(ticket);
	};

	const handleDeleteTicket = async (name) => {
		const { error } = await supabase.from("tickets").delete().eq("name", name);
		if (error) {
			console.error("Error deleting ticket:", error);
		} else {
			Toast.success("Ticket deleted successfully");
			fetchTickets();
		}
	};

	useEffect(() => {
		if (generatingTicket) {
			setGeneratingTicket(null);
		}
	}, [generatingTicket]);

	return (
		<div className=" flex gap-10 h-full " id="generate">
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
					<input
						type="text"
						value={newRegNo}
						onChange={(e) => setNewRegNo(e.target.value)}
						placeholder="Enter Reg. No."
						className="p-2 border rounded ml-2"
					/>
					<button
						onClick={handleAddTicket}
						className={`p-2 ml-2 rounded ${
							editingTicket ? "bg-orange-500" : "bg-green-500"
						} text-white`}
					>
						{editingTicket ? "Edit Ticket" : "Add Ticket"}
					</button>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search by name"
						className="p-2 border rounded ml-6"
					/>
					<button
						onClick={fetchTickets}
						className="p-2 ml-2 bg-blue-500 text-white rounded"
					>
						Search
					</button>
				</div>
				<div className="mb-4">
					<button
						onClick={() => setFilter("all")}
						className={`p-2 rounded font-medium ${
							filter === "all"
								? "bg-blue-500 text-white"
								: "border-blue-500 border-2 text-blue-500"
						}`}
					>
						All{" "}
						<span
							className={`ml-1 rounded p-1 ${
								filter === "all"
									? "bg-white text-blue-500"
									: "bg-blue-500 text-white"
							}`}
						>
							{allCount}
						</span>
					</button>
					<button
						onClick={() => setFilter("generated")}
						className={`p-2 rounded ml-2 font-medium ${
							filter === "generated"
								? "bg-green-500 text-white"
								: "border-green-500 border-2 text-green-500"
						}`}
					>
						Generated{" "}
						<span
							className={`ml-1 rounded p-1 ${
								filter === "generated"
									? "bg-white text-green-500"
									: "bg-green-500 text-white"
							}`}
						>
							{generatedCount}
						</span>
					</button>
					<button
						onClick={() => setFilter("notGenerated")}
						className={`p-2 rounded ml-2 font-medium ${
							filter === "notGenerated"
								? "bg-red-500 text-white"
								: "border-red-500 border-2 text-red-500"
						}`}
					>
						Not Generated{" "}
						<span
							className={`ml-1 rounded p-1 ${
								filter === "notGenerated"
									? "bg-white text-red-500"
									: "bg-red-500 text-white"
							}`}
						>
							{notGeneratedCount}
						</span>
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
							{/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Is Generated
							</th> */}
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y-2 divide-gray-200 ">
						{tickets
							.filter((ticket) => {
								if (filter === "all") return true;
								if (filter === "generated") return ticket.isGenerated;
								if (filter === "notGenerated") return !ticket.isGenerated;
							})
							.map((ticket, index) => (
								<tr key={index}>
									<td className="px-6 py-4 whitespace-nowrap">{ticket.name}</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{ticket.reg_no}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{ticket.email}
									</td>
									{/* <td className="px-6 py-4 whitespace-nowrap text-center">
									{ticket.isGenerated ? "Yes" : "No"}
								</td> */}
									<td className="px-6 py-4 whitespace-nowrap">
										{ticket.isGenerated ? (
											<>
												<button
													onClick={() => handleShowTicket(ticket.uuid)}
													className=" border-2 border-blue-500 hover:bg-blue-600 hover:text-white text-blue-500 duration-200 font-bold py-1 px-2 rounded"
												>
													Show
												</button>
												<button
													onClick={() => handleGenerateTicket(ticket.name)}
													className="border-2 border-orange-500 hover:bg-orange-500 hover:text-white text-orange-500 duration-200 font-bold py-1 px-2 rounded ml-1"
												>
													Update
												</button>
												<button
													onClick={() => handleEditTicket(ticket)}
													className="border-2 border-yellow-500 hover:bg-yellow-600 hover:text-white text-yellow-500 duration-200 font-bold py-1 px-2 rounded ml-1"
												>
													Edit
												</button>
												<button
													onClick={() => handleDeleteTicket(ticket.name)}
													className="border-2 border-red-500 hover:bg-red-700 hover:text-white text-red-500 duration-200 font-bold py-1 px-2 rounded ml-1"
												>
													Delete
												</button>
												<button
													onClick={() =>
														handleCopyToClipboard(
															`https://kj-ticket.vercel.app/token/${ticket.name}/${ticket.uuid}`
														)
													}
													className="border-2 border-cyan-500 hover:bg-cyan-700 hover:text-white text-cyan-500 duration-200 font-bold py-1 px-2 rounded ml-1"
												>
													Copy Link
												</button>
											</>
										) : (
											<>
												<button
													onClick={() => handleGenerateTicket(ticket.name)}
													className="border-2 border-green-500 hover:bg-green-600 hover:text-white text-green-500 font-bold py-1 px-2 rounded ml-1"
												>
													Generate Ticket
												</button>
												<button
													onClick={() => handleDeleteTicket(ticket.name)}
													className="border-2 border-red-500 hover:bg-red-700 hover:text-white text-red-500 duration-200 font-bold py-1 px-2 rounded ml-1"
												>
													Delete
												</button>
											</>
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
					<>
						<Ticket
							name={viewingTicket.name}
							uuid={viewingTicket.uuid}
							width={700}
						/>
						<p className="text-blue-600 text-lg font-semibold text-center mt-10">
							Token Download Qr Code
						</p>
						<div className="flex justify-center items-center mt-4">
							<QRCode
								level="L"
								style={{ width: "200px", height: "200px" }}
								value={`https://kj-ticket.vercel.app/token/${viewingTicket.name}/${viewingTicket.uuid}`}
							/>
						</div>
					</>
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
