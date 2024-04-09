import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Ticket from "../components/Ticket";
import html2canvas from "html2canvas";

const PublicTokenDownloader = () => {
	const { name, uuid } = useParams();
	const [width, setWidth] = useState(0);
	const ticketRef = useRef(null);

	useEffect(() => {
		const handleResize = () => {
			setWidth(window.innerWidth - 20);
		};
		handleResize(); // Initial call to set the width
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		handleDownload();
	}, []); // Call handleDownload when the component mounts

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
			<div className="rounded-lg" >
				<Ticket ref={ticketRef} name={name} uuid={uuid} width={width} />
			</div>
		</div>
	);
};

export default PublicTokenDownloader;
