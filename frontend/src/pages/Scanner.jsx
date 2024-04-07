import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import "./QrStyles.css";
import { supabase } from "../components/createClient";

const Scanner = () => {
	const videoRef = useRef(null);
	const scanner = useRef(null);
	const qrBoxRef = useRef(null);
	const [scannedResult, setScannedResult] = useState("");
	const [qrOn, setQrOn] = useState(false);
	const [ticketVerified, setTicketVerified] = useState(false);
	const [name, setName] = useState("");
	const [uuid, setUuid] = useState("");

	const onScanSuccess = async (result) => {
		console.log(result);
		setScannedResult(result?.data);

		const [nameStr, uuidStr] = result.data.split(",");
		const scannedName = nameStr.split(":")[1].trim();
		const scannedUuid = uuidStr.split(":")[1].trim();

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

		stopScanner();
	};

	const onScanFail = (err) => {
		console.error(err);
	};

	const startScanner = () => {
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
				{scannedResult && (
					<p>
						Scanned Result: <br />
						{scannedResult}
					</p>
				)}
				{ticketVerified && (
					<p>
						Ticket verified, Welcome - {name}
						<br />
						UUID: {uuid}
					</p>
				)}
				{!ticketVerified && scannedResult && <p>Ticket invalid</p>}
			</div>
		</div>
	);
};

export default Scanner;
