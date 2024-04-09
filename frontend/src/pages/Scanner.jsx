import React, { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import { supabase } from "../components/createClient";
import Toast from "react-hot-toast";

const Scanner = () => {
	const videoRef = useRef(null);
	const scanner = useRef(null);
	const qrBoxRef = useRef(null);
	const [qrOn, setQrOn] = useState(false);
	const [ticketVerified, setTicketVerified] = useState(null);
	const [name, setName] = useState("");
	const [uuid, setUuid] = useState("");
	const [reg_no, setReg_no] = useState("");
	const [count, setCount] = useState(0);
	const [ticketWidth, setTicketWidth] = useState(window.innerWidth - 20); // Initial width
	const [countIncremented, setCountIncremented] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setTicketWidth(window.innerWidth - 20);
		};

		window.addEventListener("resize", handleResize);
		handleResize(); // Initial call to set the width

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const onScanSuccess = async (result) => {
		console.log(result);
		try {
			const qrData = JSON.parse(result.data);
			const scannedName = qrData.name;
			const scannedUuid = qrData.uuid;

			const { data: ticketData, error } = await supabase
				.from("tickets")
				.select("name,reg_no,count")
				.eq("name", scannedName)
				.eq("uuid", scannedUuid);

			if (error) {
				console.error("Error fetching ticket:", error);
				setTicketVerified(false);
			} else {
				if (ticketData.length > 0) {
					const ticket = ticketData[0];
					setTicketVerified(true);
					setName(ticket.name);
					setUuid(ticket.uuid);
					setReg_no(ticket.reg_no);
					setCount(ticket.count + 1);
				} else {
					setTicketVerified(false);
				}
			}
		} catch (e) {
			console.error("Error parsing QR code data:", e);
			setTicketVerified(false);
		}
		stopScanner();
	};

	const onScanFail = (err) => {
		console.error(err);
	};

	const startScanner = () => {
		setTicketVerified(null);
		if (!qrOn) {
			if (videoRef.current && !scanner.current) {
				scanner.current = new QrScanner(videoRef.current, onScanSuccess, {
					onDecodeError: onScanFail,
					preferredCamera: "environment",
					highlightScanRegion: true,
					highlightCodeOutline: true,
					overlay: qrBoxRef.current || undefined,
				});

				scanner.current
					.start()
					.then(() => setQrOn(true))
					.catch((err) => {
						console.error("Error starting scanner:", err);
						setQrOn(false);
					});
			} else {
				scanner.current.start();
				setQrOn(true);
			}
		}
	};

	const stopScanner = () => {
		scanner.current?.stop();
		setQrOn(false);
	};

	const updateCount = async () => {
		console.log(
			"Updating count ",
			count,
			" for ticket with uuid ",
			uuid,
			" and name ",
			name
		);
		if (ticketVerified) {
			const { error: updateError } = await supabase
				.from("tickets")
				.update({ count: count })
				.match({ name });

			if (updateError) {
				console.error("Error updating ticket:", updateError);
			} else {
				console.log("Ticket updated successfully");
				// refresh the page, load the page again
				window.location.reload();
			}
		}
	};

	return (
		<div className="qr-reader">
			<div className="flex flex-col items-center justify-center">
				{!qrOn && !ticketVerified && (
					<button
						onClick={startScanner}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
					>
						Open Scanner
					</button>
				)}
				{qrOn && (
					<button
						onClick={stopScanner}
						className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
					>
						Close Scanner
					</button>
				)}
				<video ref={videoRef}></video>
				<div ref={qrBoxRef} className="qr-box">
					<img
						src={QrFrame}
						alt="Qr Frame"
						width={256}
						height={256}
						className="qr-frame"
					/>
				</div>
				{ticketVerified === true && (
					<div className="ticket-verified flex flex-col justify-center items-center">
						<div className="tick-animation flex justify-center items-center">
							<svg
								width="100px"
								height="100px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
									fill="green"
								/>
							</svg>
						</div>
						<p className="text-center text-green-500 font-semibold text-2xl pb-2">
							Ticket verified
						</p>
						{/* <p className="text-center text-green-500 font-semibold text-2xl">{name}</p> */}
						<table className="border-collapse border border-green-800 font-">
							<thead>
								<tr>
									<th className="border-4 border-green-800 px-4 py-2">Name</th>
									<th className="border-4 border-green-800 px-4 py-2">
										Reg. No.
									</th>
								</tr>
							</thead>
							<tbody>
								<tr className="font-semibold">
									<td className="border-4 border-green-800 px-4 py-2">
										{name}
									</td>
									<td className="border-4 border-green-800 px-4 py-2">
										{reg_no}
									</td>
								</tr>
							</tbody>
							<thead>
								<tr>
									<th
										className="border-4 border-green-800 px-4 py-2 text-2xl"
										colSpan={2}
									>
										Count
									</th>
								</tr>
							</thead>
							<tbody>
								<tr className="font-bold">
									<td
										className="border-4 border-green-800 px-4 py-2 text-center text-2xl"
										colSpan={2}
									>
										{/* if count >1 show in red else in green */}
										{count > 1 ? (
											<span className="text-red-500">{count}</span>
										) : (
											<span className="text-green-500">{count}</span>
										)}
									</td>
								</tr>
							</tbody>
						</table>
						{/* if the count value is >1 then show the user has exceed the max limits */}
						{count > 1 && (
							<p className="text-center text-red-500 font-bold text-lg p-2 mt-2 border-red-500 border-2 rounded-xl">
								User has exceeded the max limit
							</p>
						)}
						<button
							onClick={updateCount}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
						>
							Update Count
						</button>
						{/* imp info */}
						<p className="text-center text-red-500 font-bold text-2xl pt-2">
							Do not refresh the page 
						</p>
						<p className="text-center text-red-500 font-bold text-xl">
							Click on Update Count button
						</p>
					</div>
				)}
				{ticketVerified === false && (
					<div className="ticket-invalid">
						<div className="cross-animation flex justify-center items-center">
							<svg
								width="100px"
								height="100px"
								viewBox="0 0 32 32"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
							>
								<g
									id="Page-1"
									stroke="none"
									stroke-width="1"
									fill="none"
									fill-rule="evenodd"
									sketch:type="MSPage"
								>
									<g
										id="Icon-Set-Filled"
										sketch:type="MSLayerGroup"
										transform="translate(-570.000000, -1089.000000)"
										fill="red"
									>
										<path
											d="M591.657,1109.24 C592.048,1109.63 592.048,1110.27 591.657,1110.66 C591.267,1111.05 590.633,1111.05 590.242,1110.66 L586.006,1106.42 L581.74,1110.69 C581.346,1111.08 580.708,1111.08 580.314,1110.69 C579.921,1110.29 579.921,1109.65 580.314,1109.26 L584.58,1104.99 L580.344,1100.76 C579.953,1100.37 579.953,1099.73 580.344,1099.34 C580.733,1098.95 581.367,1098.95 581.758,1099.34 L585.994,1103.58 L590.292,1099.28 C590.686,1098.89 591.323,1098.89 591.717,1099.28 C592.11,1099.68 592.11,1100.31 591.717,1100.71 L587.42,1105.01 L591.657,1109.24 L591.657,1109.24 Z M586,1089 C577.163,1089 570,1096.16 570,1105 C570,1113.84 577.163,1121 586,1121 C594.837,1121 602,1113.84 602,1105 C602,1096.16 594.837,1089 586,1089 L586,1089 Z"
											id="cross-circle"
											sketch:type="MSShapeGroup"
										></path>
									</g>
								</g>
							</svg>
						</div>
						<p className="text-center font-bold text-2xl text-red-500">
							Ticket invalid
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Scanner;
