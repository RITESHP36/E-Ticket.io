import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client"; // Import ReactDOM
import { v4 as uuidv4 } from "uuid";

import Ticket from "../components/Ticket";
import html2canvas from "html2canvas";
import { supabase } from "../components/createClient";

function AdminTicketGenerate({ name }) {
	const [uuid, setUuid] = useState("");
	const [base64Data, setBase64Data] = useState(""); // State for base64 string

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

		// Render the Ticket component in a hidden div to capture it
		const hiddenDiv = document.createElement("div");
		hiddenDiv.style.willReadFrequently = true; // Set the willReadFrequently attribute
		document.body.appendChild(hiddenDiv);

		// Use ReactDOM.createRoot to render the Ticket component
		const root = ReactDOM.createRoot(hiddenDiv);
		console.log("Name and UUID on generate side ", {
			inputName,
			uuid: uuidGenerated,
		});
		root.render(<Ticket name={inputName} uuid={uuidGenerated} />);

		// Wait for the next render cycle to ensure the Ticket component is mounted
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Generate the image of the ticket
		html2canvas(hiddenDiv)
			.then((canvas) => {
				// Convert the canvas to a base64 string directly
				const tempBase64Data = canvas.toDataURL("image/png");
				setBase64Data(tempBase64Data); // Store the base64 string in the state

				// Clean up the hidden div
				document.body.removeChild(hiddenDiv);

				// Upload the ticket to the database
				uploadTicket(uuidGenerated, tempBase64Data, inputName);
			})
			.catch((error) => {
				console.error("Error generating ticket image:", error);
			});
	};

	const uploadTicket = async (uuid, base64, name) => {
		try {
			// Assuming 'name' is a unique identifier for the row you want to update
			const { data, error } = await supabase
				.from("tickets") // Adjust the table name as necessary
				.update({ uuid, isGenerated: true }) // Update the UUID, image_base64, and isGenerated fields
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
			{base64Data && (
				<div className="mt-4">
					{/* <p>UUID: {uuid}</p> */}
					{/* display image based on imagebase64 */}
					<img src={base64Data} alt="Generated Ticket" className="mt-4" />
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

export default AdminTicketGenerate;
