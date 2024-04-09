import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Ticket from "../components/Ticket";
import html2canvas from "html2canvas";

const PublicTokenViewer = () => {
	const { name, uuid } = useParams();
	const [width, setWidth] = useState(0);
	const ticketRef = useRef(null);

	useEffect(() => {
		const handleResize = () => {
			setWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleDownload = () => {
		html2canvas(ticketRef.current).then((canvas) => {
			const link = document.createElement("a");
			link.download = "ticket.png";
			link.href = canvas.toDataURL("image/png");
			link.click();
		});
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
			<div
				ref={ticketRef}
				className="rounded-lg"
				style={{ width: `${width}px` }}
			>
				<Ticket name={name} uuid={uuid} width={width} />
			</div>
			<button
				onClick={handleDownload}
				className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
			>
				Download Ticket
			</button>
		</div>
	);
};

export default PublicTokenViewer;
