import React, { memo } from "react";
import { QRCode } from "react-qr-svg"; // Import QRCode from react-qr-svg

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
				<div className="flex flex-col justify-center items-center mr-20 h-[500px]">
					<p className="text-white font-bold text-3xl text-center mb-4 mt-10">
						{name}
					</p>
					<div className="flex justify-center items-center bg-white p-4">
						{/* Use QRCode component from react-qr-svg */}
						<QRCode
							level="L"
							style={{ width: 400 }}
							value={JSON.stringify({
								name: name,
								uuid: uuid,
							})}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});

export default Ticket;
