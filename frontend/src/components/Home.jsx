import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./createClient";

const Home = () => {
	const [name, setName] = useState("");
	const [imageBase64, setImageBase64] = useState(null);
	const navigate = useNavigate();

	const fetchTicket = async () => {
		const { data, error } = await supabase
			.from("tickets")
			.select("image_base64")
			.eq("name", name);

		if (error) {
			console.error("Error fetching ticket:", error);
		} else if (data && data.length > 0) {
			setImageBase64(data[0].image_base64);
		} else {
			navigate(`/generate-ticket/${name}`);
		}
	};

	const handleGenerateTicket = () => {
		fetchTicket();
	};

	return (
		<div className="text-fuchsia-600">
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<button onClick={handleGenerateTicket}>Generate Ticket</button>
			{imageBase64 && (
				<img src={`data:image/png;base64,${imageBase64}`} alt="Ticket" />
			)}
		</div>
	);
};

export default Home;
