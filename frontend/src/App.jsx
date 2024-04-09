import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./trash/Home";
import HomePage from "./pages/HomePage";
import GenerateTicket from "./trash/GenerateTicket";
import Admin from "./pages/Admin";
import Scanner from "./pages/Scanner";
import AdminAllTicket from "./components/AdminAllTicket";
import PublicTokenViewer from "./pages/PublicTokenViewer";
import PublicTokenDownloader from "./pages/PublicTokenDownloader";
import { Toaster } from "react-hot-toast";

const App = () => {
	return (
		<Router>
			<Toaster />
			<Routes>
				{/* <Route path="/generate-ticket/:name" element={<GenerateTicket />} /> */}
				{/* <Route path="/" element={<Home />} /> */}
				<Route path="/" element={<HomePage />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/admin/all-tickets" element={<AdminAllTicket />} />
				<Route path="/scan" element={<Scanner />} />
				<Route path="/token/:name/:uuid" element={<PublicTokenViewer />} />
				<Route
					path="/token/download/:name/:uuid"
					element={<PublicTokenDownloader />}
				/>
			</Routes>
		</Router>
	);
};

export default App;
