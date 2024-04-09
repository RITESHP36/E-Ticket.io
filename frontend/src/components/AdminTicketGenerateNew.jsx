import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client"; // Import ReactDOM
import { v4 as uuidv4 } from "uuid";

import Ticket from "./Ticket";
import { supabase } from "./createClient";

function AdminTicketGenerateNew({ name }) {
	const [uuid, setUuid] = useState("");

	// Use the name prop to set the initial state of the name state variable
	const [inputName, setInputName] = useState(name);
	useEffect(() => {
		setInputName(name); // Update the inputName state when the name prop changes
	}, [name]);

	useEffect(() => {
		generateTicketNow();
	}, []);

	// New function to handle ticket generation without relying on an event object
	const generateTicketNow = async () => {
		const uuidGenerated = uuidv4(); // Generate a unique UUID
		setUuid(uuidGenerated); // Store the UUID in the state
		// Upload the ticket to the database
		uploadTicket(uuidGenerated, inputName);
	};

	const uploadTicket = async (uuid, name) => {
		try {
			// Assuming 'name' is a unique identifier for the row you want to update
			const { data, error } = await supabase
				.from("tickets") // Adjust the table name as necessary
				.update({ uuid, isGenerated: true }) // Update the UUID and isGenerated fields
				.match({ name }); // Find the row where the name matches the provided name

			if (error) {
				console.error("Error updating ticket:", error);
			} else {
				console.log("Ticket updated successfully for:", name, data);
				// Optionally, perform additional actions upon successful update
			}
		} catch (error) {
			console.error("Error updating ticket:", error);
		}
	};

	return (
		<div className="AdminTicketGenerate">
			<form className="flex flex-col items-center">
				<input
					type="text"
					value={inputName}
					onChange={(e) => setInputName(e.target.value)}
					placeholder="Enter your name"
					className="p-2 border rounded"
				/>
				{/* <button
					type="submit"
					className="p-2 mt-2 bg-blue-500 text-white rounded"
				>
					Generate Ticket
				</button> */}
			</form>
			{uuid && (
				<div className="mt-4">
					{/* <p>UUID: {uuid}</p> */}
					{/* display image based on imagebase64 */}
					<Ticket name={inputName} uuid={uuid} />
					{/* Display the base64 string in a textarea */}
					{/* <textarea
						value={base64Data}
						readOnly
						className="w-full h-20 p-2 border rounded mt-4"
					/> */}
				</div>
			)}
		</div>
	);
}

export default AdminTicketGenerateNew;
