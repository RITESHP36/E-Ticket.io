import React, { useState,useEffect, createRef } from "react";
import AdminTicketGenerate from "../trash/AdminTicketGenerate";
import AdminDashboard from "../components/AdminDashboard";
import Ticket from "../components/Ticket";
import AdminAllTicket from "../components/AdminAllTicket";
import AdminTicketStatus from "../components/AdminTicketStatus";
import AddUsers from "../components/AdminAddUser";
import ManageMail from "./ManageMail";

const Admin = () => {
	const [pin, setPin] = useState(Array(6).fill(""));
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const inputRefs = Array(6)
		.fill()
		.map(() => createRef());

		const handlePinChange = (digit, i) => {
			const newPin = [...pin];
			newPin[i] = digit;
			setPin(newPin);
			if (newPin.join("") === "024680") {
			  setIsAuthenticated(true);
			  localStorage.setItem('authTime', Date.now().toString());
			} else if (digit !== "" && i < pin.length - 1) {
			  inputRefs[i + 1].current.focus();
			}
		  };
		
		  useEffect(() => {
			const authTime = localStorage.getItem('authTime');
			// 5 below signifies the time in minutes (5min) before auto logout
			if (authTime && Date.now() - Number(authTime) < 5 * 60 * 1000) {
			  setIsAuthenticated(true);
			}
		  }, []);

	const handleKeyDown = (e, i) => {
		if (e.key === "Backspace" && i > 0 && pin[i] === "") {
			inputRefs[i - 1].current.focus();
		}
	};

	return (
		<>
			{!isAuthenticated && (
				<div className="fixed inset-0 bg-gray-800 flex items-center justify-center z-50">
					<div className="bg-white p-4 rounded-lg shadow-md">
						<h2 className="text-2xl font-bold mb-4">Enter PIN to continue</h2>
						<div className="flex justify-between">
							{pin.map((digit, i) => (
								<input
									key={i}
									type="password"
									value={digit}
									onChange={(e) => handlePinChange(e.target.value, i)}
									onKeyDown={(e) => handleKeyDown(e, i)}
									className="w-10 p-2 border border-gray-300 rounded-lg mb-4 text-center"
									maxLength="1"
									ref={inputRefs[i]}
								/>
							))}
						</div>
						{pin.includes("") && (
							<p className="text-red-500">Please enter all digits.</p>
						)}
						{!pin.includes("") && (
							<p className="text-red-500 font-bold text-xl">Incorrect PIN</p>
						)}
					</div>
				</div>
			)}
			{isAuthenticated && (
				<>
					<div>
						<nav className="fixed w-full z-10">
							<div className="flex justify-between bg-gray-800 p-4">
								<div className="text-white font-bold text-2xl">Admin Dashboard</div>
								<div className="flex space-x-8">
									<a
										href="/admin"
										className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
									>
										Home
									</a>
									<a
										href="#adduser"
										className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
									>
										Add Users
									</a>
									<a
										href="#generate"
										className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
									>
										Generate Ticket
									</a>
									<a
										href="#mail"
										className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
									>
										Manage Mail
									</a>
									<a
										href="#alltickets"
										className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
									>
										All Tickets
									</a>
									<a
										href="#status"
										className="text-white border border-white p-2 rounded hover:text-yellow-500 hover:border-yellow-500"
									>
										Ticket Status
									</a>
								</div>
							</div>
						</nav>
						<div className="pb-14"></div>

						<AddUsers />
						<AdminDashboard />
						<ManageMail />
						<AdminAllTicket />
						<AdminTicketStatus />
						{/* <AdminTicketGenerate /> */}
						{/* <Ticket name="ritesh pradhan" uuid="d9219e1e-e2ae-4f09-b0d4-4f9fc355d30e" /> */}
					</div>
				</>
			)}
		</>
	);
};

export default Admin;
