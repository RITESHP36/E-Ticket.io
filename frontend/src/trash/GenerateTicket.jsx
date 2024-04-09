import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import { toPng } from "html-to-image";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../components/createClient";

const GenerateTicket = () => {
	const { name } = useParams();
	const uuid = uuidv4();
	const ticketRef = useRef();
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		if (ticketRef.current) {
			toPng(ticketRef.current)
				.then(async (dataUrl) => {
					const base64Image = dataUrl.split(",")[1];

					// Check if a ticket with the same name already exists
					const { data: selectData, error: selectError } = await supabase
						.from("tickets")
						.select("name")
						.eq("name", name);

					if (selectError) {
						throw selectError;
					} else if (selectData && selectData.length > 0) {
						setErrorMessage("Ticket already generated");
					} else {
						// Insert the ticket information into the "tickets" table
						const { data: insertData, error: insertError } = await supabase
							.from("tickets")
							.insert([{ uuid: uuid, name: name, image_base64: base64Image }]);

						if (insertError) {
							throw insertError;
						} else {
							navigate(`/`, { replace: true });
						}
					}
				})
				.catch((error) => {
					console.error("Error generating ticket image:", error);
				});
		}
	}, [name, uuid]);

	return (
		<div
			ref={ticketRef}
			className="border border-black p-4"
			style={{
				backgroundImage: `url('/Navy Yellow Retro Night Party Ticket.png')`,
				backgroundSize: "cover",
			}}
		>
			<div className="flex h-72 justify-end">
				<div className=""></div>
				<div className="flex flex-col justify-center items-center mr-10">
					<p className="text-white font-bold text-center mb-4">{name}</p>
					<div className=" flex justify-center items-center">
						<QRCode value={`Name: ${name}, UUID: ${uuid}`} />
					</div>
				</div>
			</div>
			{/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
		</div>
	);
};

export default GenerateTicket;
