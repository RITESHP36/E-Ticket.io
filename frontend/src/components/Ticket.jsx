import React, { memo } from "react";
import QRCode from "qrcode.react";

const Ticket = memo(({ name, uuid }) => {
	console.log("Ticket", { name, uuid });
	return (
		<div
			className="border border-black p-4 w-screen"
			style={{
				backgroundImage: `url('/Navy Yellow Retro Night Party Ticket.png')`,
				backgroundSize: "cover",
				height: "700px",
			}}
		>
			<div className="flex justify-end">
				<div className=""></div>
				<div className="flex flex-col justify-center items-center mr-28 h-[500px]">
					<p className="text-white font-bold text-lg text-center mb-4">
						{name}
					</p>
					<div className="flex justify-center items-center">
						<QRCode value={`Name: ${name}, UUID: ${uuid}`} size={200} />
					</div>
				</div>
			</div>
		</div>
	);
});

export default Ticket;
