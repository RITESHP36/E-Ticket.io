import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import HomePage from "./pages/HomePage";
import GenerateTicket from "./pages/GenerateTicket";
import Admin from "./pages/Admin";
import Scanner from "./pages/Scanner";
import AdminAllTicket from "./components/AdminAllTicket";

const App = () => {
	return (
		<Router>
			<Routes>
				{/* <Route path="/generate-ticket/:name" element={<GenerateTicket />} /> */}
				{/* <Route path="/" element={<Home />} /> */}
				<Route path="/" element={<HomePage />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/admin/all-tickets" element={<AdminAllTicket />} />
				<Route path="/scan" element={<Scanner />} />
			</Routes>
		</Router>
	);
};

export default App;
