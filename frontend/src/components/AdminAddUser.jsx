import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../components/createClient";
import Toast from "react-hot-toast";

const AddUsers = () => {
	const [file, setFile] = useState(null);
	const [data, setData] = useState([]);
	const [columnMapping, setColumnMapping] = useState({
		name: "",
		email: "",
		reg_no: "",
	});
	const [filteredData, setFilteredData] = useState([]);
	const [currentStep, setCurrentStep] = useState("uploadFile");
	const [startRow, setStartRow] = useState(11);
	const [endRow, setEndRow] = useState(300);
	const [showBulkUpload, setShowBulkUpload] = useState(false);

	const handleFileUpload = (e) => {
		const uploadedFile = e.target.files[0];
		setFile(uploadedFile);
		const reader = new FileReader();
		reader.onload = (evt) => {
			const bstr = evt.target.result;
			const wb = XLSX.read(bstr, { type: "binary" });
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
			const headers = jsonData[startRow - 1];
			const parsedData = jsonData.slice(startRow, endRow).map((row) => {
				const obj = {};
				headers.forEach((header, index) => {
					obj[header] = row[index];
				});
				return obj;
			});
			const nonEmptyRows = parsedData.filter((row) =>
				Object.values(row).every((cell) => cell !== "" && cell !== undefined)
			);
			setData(nonEmptyRows);
			setColumnMapping({ name: "", email: "", reg_no: "" });
			setFilteredData(nonEmptyRows);
			setCurrentStep("mapColumns");
			Toast.success("File uploaded successfully");
		};
		reader.readAsBinaryString(uploadedFile);
	};

	const handleColumnChange = (e, columnName) => {
		const selectedColumn = e.target.value;
		setColumnMapping((prevMapping) => ({
			...prevMapping,
			[columnName]: selectedColumn,
		}));
	};

	const handleFilter = () => {
		const filtered = data.filter((row) => {
			const nameColumn = columnMapping["name"];
			const emailColumn = columnMapping["email"];
			const regNoColumn = columnMapping["reg_no"];

			return (
				nameColumn &&
				row[nameColumn] !== "" &&
				emailColumn &&
				row[emailColumn] !== "" &&
				regNoColumn &&
				row[regNoColumn] !== ""
			);
		});
		setFilteredData(filtered);
		setCurrentStep("filtered"); // Make sure to set the current step after filtering
		Toast.success("Data filtered successfully");
	};

	const uploadUsers = async () => {
		// Ensure that filteredData is updated with the filtered rows before calling this function
		const usersToUpload = filteredData.map((row) => {
			const user = {};
			Object.keys(row).forEach((key) => {
				const supabaseField = getSupabaseField(key);
				if (supabaseField) {
					let value = row[key];
					if (supabaseField === "name" || supabaseField === "reg_no") {
						// Capitalize the name and reg_no
						value = value.toString().toUpperCase();
					}
					user[supabaseField] = value;
				}
			});
			return user;
		});

		console.log("Users to upload:", usersToUpload);

		for (const user of usersToUpload) {
			const { data: existingUser } = await supabase
				.from("tickets")
				.select("*")
				.eq("name", user.name)
				.eq("email", user.email)
				.single();

			if (!existingUser) {
				const { data, error } = await supabase.from("tickets").insert(user);
				if (error) {
					console.error("Error uploading user:", error);
					Toast.error("Error uploading user");
				} else {
					console.log(`User ${user.name} uploaded successfully`);
					Toast.success(`User ${user.name} uploaded successfully`);
				}
			} else {
				console.log("User already exists:", existingUser);
				Toast.error(`User ${user.name} already exists`);
			}
		}
	};

	const getSupabaseField = (excelHeader) => {
		const mappedColumn = Object.entries(columnMapping).find(
			([, value]) => value === excelHeader
		);
		if (mappedColumn) {
			return mappedColumn[0];
		}
		return null;
	};
	const renderTable = (data, columnMapping) => {
		return (
			<table className="w-full mt-4 border-collapse border border-gray-800">
				<thead>
					<tr className="bg-gray-200">
						<th className="border border-gray-800 p-2">Name</th>
						<th className="border border-gray-800 p-2">Email</th>
						<th className="border border-gray-800 p-2">Reg. No.</th>
					</tr>
				</thead>
				<tbody>
					{data.map((row, index) => (
						<tr key={index} className="border border-gray-800">
							<td className="border border-gray-800 p-2">
								{row[columnMapping["name"]]}
							</td>
							<td className="border border-gray-800 p-2">
								{row[columnMapping["email"]]}
							</td>
							<td className="border border-gray-800 p-2">
								{row[columnMapping["reg_no"]]}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};

	return (
		<div
			className=" flex flex-col justify-center items-center pt-4 pb-6 border-t-2 border-b-2 border-gray-400"
			id="adduser"
		>
			{/* Add a button to toggle the visibility of the bulk user upload options */}
			<button
				onClick={() => setShowBulkUpload(!showBulkUpload)}
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
			>
				{showBulkUpload ? "Hide" : "Add"} Bulk Users
			</button>

			{/* Wrap the bulk user upload options in a conditional rendering block */}
			{showBulkUpload && (
				<>
					{currentStep === "uploadFile" && (
						<>
							<input
								type="file"
								accept=".xlsx"
								onChange={handleFileUpload}
								className="mt-4"
							/>
							<p className="text-sm text-red-500 font-semibold mt-2">
								Make sure to upload an Excel file with the headers in the 11th
								row and participant details from 12th row onwards
							</p>
							<p className="text-sm text-red-500 font-semibold">
								Example below
							</p>
							<img src="/example1.png" alt="example image" />
						</>
					)}
					{data.length > 0 && (
						<>
							{currentStep === "mapColumns" && (
								<>
									<div className="flex mt-4">
										<div className="flex flex-col items-center mr-4">
											<label>Name</label>
											<select
												onChange={(e) => handleColumnChange(e, "name")}
												className="p-1 mt-2"
												value={columnMapping["name"] || "null"}
											>
												<option value="null">Null</option>
												{Object.keys(data[0]).map((header) => (
													<option key={header} value={header}>
														{header}
													</option>
												))}
											</select>
										</div>
										<div className="flex flex-col items-center mr-4">
											<label>Email</label>
											<select
												onChange={(e) => handleColumnChange(e, "email")}
												className="p-1 mt-2"
												value={columnMapping["email"] || "null"}
											>
												<option value="null">Null</option>
												{Object.keys(data[0]).map((header) => (
													<option key={header} value={header}>
														{header}
													</option>
												))}
											</select>
										</div>
										<div className="flex flex-col items-center mr-4">
											<label>Reg. No.</label>
											<select
												onChange={(e) => handleColumnChange(e, "reg_no")}
												className="p-1 mt-2"
												value={columnMapping["reg_no"] || "null"}
											>
												<option value="null">Null</option>
												{Object.keys(data[0]).map((header) => (
													<option key={header} value={header}>
														{header}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className="flex justify-between mt-4">
										<button
											onClick={() => setCurrentStep("uploadFile")}
											className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
										>
											Back
										</button>
										<button
											onClick={handleFilter}
											className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
										>
											Filter
										</button>
									</div>
								</>
							)}
							{currentStep === "filtered" && (
								<>
									<div className="flex justify-between mt-4">
										<button
											onClick={() => setCurrentStep("mapColumns")}
											className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
										>
											Back
										</button>
										<button
											onClick={uploadUsers}
											className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
										>
											Upload Users
										</button>
									</div>
								</>
							)}
							{renderTable(filteredData, columnMapping)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default AddUsers;
