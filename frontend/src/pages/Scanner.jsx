import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import "./QrStyles.css";

const Scanner = () => {
	const videoRef = useRef(null);
	const scanner = useRef(null);
	const qrBoxRef = useRef(null);
	const [scannedResult, setScannedResult] = useState("");
	const [qrOn, setQrOn] = useState(true);

	const onScanSuccess = (result) => {
		console.log(result);
		setScannedResult(result?.data);
	};

	const onScanFail = (err) => {
		console.error(err);
	};

	useEffect(() => {
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
					if (err) setQrOn(false);
				});
		}

		return () => {
			if (!videoRef.current) {
				scanner.current?.stop();
			}
		};
	}, []);

	useEffect(() => {
		if (!qrOn) {
			alert(
				"Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
			);
		}
	}, [qrOn]);

	return (
		<div className="qr-reader">
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
				<p
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						zIndex: 99999,
						color: "white",
					}}
				>
					Scanned Result: {scannedResult}
				</p>
			)}
		</div>
	);
};

export default Scanner;
