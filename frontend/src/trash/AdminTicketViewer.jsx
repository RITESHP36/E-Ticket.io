import React from "react";

const AdminTicketViewer = ({ image_base64 }) => {
	return (
		<div>
			<h1>AdminTicketViewer</h1>
			{image_base64 ? (
				<img
					src={image_base64}
					alt="Generated Ticket"
					className="mt-2 w-full h-full"
				/>
			) : (
				<p>Base64 is corrupted or not provided.</p>
			)}
		</div>
	);
};

export default AdminTicketViewer;
