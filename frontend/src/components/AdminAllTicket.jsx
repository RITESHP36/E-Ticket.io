import React, { useState, useEffect } from "react";
import { supabase } from "../components/createClient"; // Adjust the path as necessary

const AdminAllTicket = () => {
	const [tickets, setTickets] = useState([]);
	const [showTickets, setShowTickets] = useState(false);

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		const { data, error } = await supabase
			.from("tickets")
			.select("image_base64");

		if (error) {
			console.error("Error fetching tickets:", error);
		} else {
			setTickets(data);
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
				<div className="flex flex-wrap">
					{tickets.map((ticket, index) => (
						<div key={index} className="w-1/2 p-2">
							<img src={ticket.image_base64} alt={`Ticket ${index}`} />
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AdminAllTicket;
