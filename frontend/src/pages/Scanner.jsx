import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import "./QrStyles.css";
import { supabase } from "../components/createClient";

const Scanner = () => {
	const videoRef = useRef(null);
	const scanner = useRef(null);
	const qrBoxRef = useRef(null);
	const [qrOn, setQrOn] = useState(false);
	const [ticketVerified, setTicketVerified] = useState(null);
	const [name, setName] = useState("");
	const [uuid, setUuid] = useState("");

	const onScanSuccess = async (result) => {
		console.log(result);

		try {
			const qrData = JSON.parse(result.data);
			const scannedName = qrData.name;
			const scannedUuid = qrData.uuid;

			const { data: ticketData, error } = await supabase
				.from("tickets")
				.select("name")
				.eq("name", scannedName)
				.eq("uuid", scannedUuid);

			if (error) {
				console.error("Error fetching ticket:", error);
				setTicketVerified(false);
			} else {
				if (ticketData.length > 0) {
					setTicketVerified(true);
					setName(scannedName);
					setUuid(scannedUuid);
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

	useEffect(() => {
		return () => {
			scanner.current?.stop();
		};
	}, []);

	return (
		<div className="qr-reader flex">
			<div className="flex flex-col items-center">
				{!qrOn && (
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
					<div className="ticket-verified">
						<div className="tick-animation">
							<img
								src="/tick-circle-svgrepo-com.svg"
								alt="Tick"
								style={{ fill: "green", width: "50px", height: "50px" }}
							/>
						</div>
						<p className="ticket-verified-text">Ticket verified</p>
					</div>
				)}
				{ticketVerified === false && (
					<div className="ticket-invalid">
						<div className="cross-animation">
							<img
								src="/cross-circle-svgrepo-com.svg"
								alt="Cross"
								style={{ fill: "red", width: "50px", height: "50px" }}
							/>
						</div>
						<p className="ticket-invalid-text">Ticket invalid</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Scanner;
