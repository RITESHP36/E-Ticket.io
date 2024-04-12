import React, { useEffect, useState } from "react";
import { supabase } from "../components/createClient";

const AdminTicketStatus = () => {
	const [data, setData] = useState([]);
	const [totalReceivedFood, setTotalReceivedFood] = useState(0);
	const [totalTriedAgain, setTotalTriedAgain] = useState(0);
	const [showStatus, setShowStatus] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabase.from("tickets").select("*");

			if (error) {
				console.error("Error fetching data:", error);
			} else {
				setData(data);
				const receivedFood = data.filter((item) => item.count >= 1).length;
				const triedAgain = data.filter((item) => item.count > 1).length;
				setTotalReceivedFood(receivedFood);
				setTotalTriedAgain(triedAgain);
			}
		};

		fetchData();
	}, []);

	return (
		<div className=" border-t-4 border-gray-300" id="status">
			<div className="flex justify-center items-center my-8">
				<button
					onClick={() => setShowStatus(!showStatus)}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					{showStatus ? "Hide Token Status" : "Display Token Status"}
				</button>
			</div>
			{showStatus && (
				<div className="p-6 bg-white rounded shadow-md">
					<div className="mb-4 grid grid-cols-2 content-center gap-4">
						<div className="flex flex-col items-center justify-between p-4 bg-white text-blue-500 rounded-lg shadow-lg shadow-blue-500 ">
							<div className="text-4xl font-bold">
								{totalReceivedFood} / {data.length}
							</div>
							<div className="text-2xl uppercase font-semibold">
								Have received food
							</div>
						</div>
						<div className="flex flex-col items-center justify-between p-4 bg-white text-orange-500 rounded-lg shadow-lg shadow-orange-500 ">
							<div className="text-4xl font-bold">
								{totalTriedAgain} out of {data.length}
							</div>
							<div className="text-2xl uppercase font-semibold">
								Tried to come again
							</div>
						</div>
					</div>
					<div className="grid grid-cols-4 gap-4 pt-4">
						{data.map((item, index) => (
							<div
								key={index}
								className={`p-4 border rounded shadow-md  ${
									item.count === 0
										? "shadow-blue-500"
										: item.count === 1
										? "shadow-green-500"
										: "shadow-orange-500"
								}`}
							>
								<p className="font-bold text-lg">Name: {item.name}</p>
								<p className="text-gray-700 text-lg font-medium">Reg No: {item.reg_no}</p>
								<p
									className={`font-semibold text-xl ${
										item.count === 0
											? "text-blue-500"
											: item.count === 1
											? "text-green-500"
											: "text-orange-500"
									}`}
								>
									Count: {item.count}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminTicketStatus;
