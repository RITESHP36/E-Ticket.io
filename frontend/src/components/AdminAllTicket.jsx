import React, { useState, useEffect } from "react";
import { supabase } from "../components/createClient"; // Adjust the path as necessary
import Ticket from "./Ticket";

const AdminAllTicket = () => {
	const [tickets, setTickets] = useState([]);
	const [showTickets, setShowTickets] = useState(false);

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		const { data, error } = await supabase
			.from("tickets")
			.select("name,uuid,isGenerated");

		if (error) {
			console.error("Error fetching tickets:", error);
		} else {
			const generatedTickets = data.filter((ticket) => ticket.isGenerated);
			setTickets(generatedTickets);
		}
	};

	const toggleTicketsVisibility = () => {
		setShowTickets(!showTickets);
	};

	return (
		<div>
			<div className="flex justify-center items-center mb-4 border-t-4 border-gray-300 pt-4">
				<button
					onClick={toggleTicketsVisibility}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
				>
					{showTickets ? "Hide Tickets" : "View Tickets"}
				</button>
			</div>

			{showTickets && (
				<div className="grid grid-cols-2">
					{tickets.map((ticket, index) => (
						<div key={index} className="mb-4 mr-4">
							<Ticket name={ticket.name} uuid={ticket.uuid} width={1000} />
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AdminAllTicket;
