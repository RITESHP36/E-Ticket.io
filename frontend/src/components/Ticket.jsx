import React, { memo } from "react";
import { QRCode } from "react-qr-code";

const Ticket = memo(({ name, uuid, width }) => {
	console.log("Ticket", { name, uuid, width });

	const minWidth = 30; // Minimum width of the ticket container
	const maxWidth = 1000; // Maximum width of the ticket container
	const ticketWidth = Math.max(Math.min(width, maxWidth), minWidth); // Set width within the range

	const qrCodeSize = ticketWidth / 6; // QR code size is 1/6 of the ticket width
	const textSize = ticketWidth / 60; // Text size is 1/40 of the ticket width

	return (
		<div
			className="relative"
			style={{
				backgroundImage: `url('/Navy Yellow Retro Night Party Ticket.png')`,
				backgroundSize: "cover",
				width: `${ticketWidth}px`, // Set width of ticket container
				height: `${ticketWidth / 3}px`, // Set height based on width (3:1 ratio)
				maxWidth: "100%", // Allow ticket to be responsive up to a maximum width
				margin: "0 auto", // Center ticket on the page
			}}
		>
			<div
				className="absolute top-0 bottom-0 right-0 p-4 flex flex-col justify-center items-center"
				style={{ left: `${3*ticketWidth/4 }px` }}
			>
				<p
					className="text-center text-white font-bold "
					style={{ fontSize: `${textSize}px`, marginBottom: `${textSize}px`}}
				>
					{name}
				</p>
				<div className=" bg-white p-1">
					{/* Use calculated QR code size */}
					<QRCode
						level="L"
						style={{ width: qrCodeSize, height: qrCodeSize }}
						value={JSON.stringify({
							name: name,
							uuid: uuid,
						})}
					/>
				</div>
			</div>
		</div>
	);
});

export default Ticket;
