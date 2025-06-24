import React, { useState, useEffect } from "react";
import { supabase } from "../components/createClient"; // Adjust the path as necessary
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const ManageMail = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailSentCount, setEmailSentCount] = useState(0);
  const [totalTokenGenerated, setTotalTokenGenerated] = useState(0);
  const [totalEmailSent, setTotalEmailSent] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const { data: ticketsData, error: ticketsError } = await supabase
      .from("tickets")
      .select("name, email, reg_no, uuid, isGenerated")
      .order("name", { ascending: true })
      .eq("isGenerated", true);

    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError);
    } else {
      const existingTickets = await getExistingTicketsFromSpreadsheet();
      setTotalEmailSent(existingTickets.length);
      const emailSent = existingTickets.filter(
        (ticket) => ticket["Email Sent"]
      );
      setEmailSentCount(emailSent.length);

      const newTicketsData = ticketsData.map((ticket) => ({
        ...ticket,
        selected: !existingTickets.some(
          (existingTicket) =>
            existingTicket.name === ticket.name &&
            existingTicket.Recipient === ticket.email
        ),
      }));
      console.log("newTicketsData: ", newTicketsData);

      setTickets(newTicketsData);
      setSelectedTickets(newTicketsData.filter((ticket) => ticket.selected));
    }
  };

  const handleCheckboxChange = (index) => {
    const newSelectedTickets = [...selectedTickets];
    newSelectedTickets[index] = {
      ...newSelectedTickets[index],
      selected: !newSelectedTickets[index].selected,
    };
    setSelectedTickets(newSelectedTickets);
  };

  const handleAddToSpreadsheet = async () => {
    setLoading(true);

    const selectedRows = selectedTickets.filter((ticket) => ticket.selected);
    const existingTickets = await getExistingTicketsFromSpreadsheet();

    const filteredRows = selectedRows.filter(
      (row) =>
        !existingTickets.some(
          (ticket) => ticket.name === row.name && ticket.email === row.Recipient
        )
    );

    if (filteredRows.length === 0) {
      setLoading(false);
      Toast.error("All selected tickets already exist in the spreadsheet.");
      return;
    }

    const rowsToAdd = filteredRows.map((row) => ({
      name: row.name,
      reg_no: row.reg_no,
      uuid: row.uuid,
      Recipient: row.email,
    }));

    fetch(
      "https://api.sheetbest.com/sheets/c9a7dfa5-e6a8-4b52-9189-52301b3c168f",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rowsToAdd),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        Toast.success("Tickets added to spreadsheet successfully.");
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error adding tickets to spreadsheet:", error);
        Toast.error("Failed to add tickets to spreadsheet.");
      });
  };

  const getExistingTicketsFromSpreadsheet = async () => {
    const response = await fetch(
      "https://api.sheetbest.com/sheets/c9a7dfa5-e6a8-4b52-9189-52301b3c168f?_raw=1"
    );
    const data = await response.json();
    // filter out those data where name !== null
    const FilteredData = data.filter((item) => item.name !== null);
    console.log("FilteredData: ", FilteredData);
    return FilteredData;
  };

  const handleSelectAll = () => {
    setSelectedTickets(
      selectedTickets.map((ticket) => ({ ...ticket, selected: true }))
    );
    setSelectAll(true);
  };

  const handleUnselectAll = () => {
    setSelectedTickets(
      selectedTickets.map((ticket) => ({ ...ticket, selected: false }))
    );
    setSelectAll(false);
  };

  return (
    <div className="m-2 border-t-4 border-gray-300 pt-4 pb-4" id="mail">
      <div className="flex justify-center items-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            toast("📧 Manage Mail feature is paused as of now.", {
              icon: "⏸️",
              duration: 4000,
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-xl mb-4"
        >
          {isVisible ? "Hide Mail" : "Manage Mail"}
        </button>
      </div>
      {isVisible && (
        <>
          {loading && <p>Loading...</p>}
          {!loading && (
            <>
              <div className="flex mb-4">
                <div className="flex flex-col items-center justify-between p-4 bg-white text-blue-500 rounded-lg shadow-lg shadow-blue-500  w-fit">
                  <div className="text-3xl font-bold">
                    {emailSentCount} / {totalEmailSent}
                  </div>
                  <div className="text-xl uppercase font-semibold">
                    Emails Sent
                  </div>
                </div>
                <button
                  onClick={handleSelectAll}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl ml-4 font-semibold"
                >
                  Select All
                </button>
                <button
                  onClick={handleUnselectAll}
                  className="bg-amber-500 text-white px-4 py-2 rounded-xl ml-2 font-semibold"
                >
                  Unselect All
                </button>
              </div>
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleAddToSpreadsheet}
                  disabled={
                    selectedTickets.filter((ticket) => ticket.selected)
                      .length === 0
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-xl"
                >
                  Add to Spreadsheet/Mailing List
                </button>
              </div>
              <table className="w-full text-center bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-purple-500 text-white">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Reg. No.</th>
                    <th className="px-4 py-2">uuid</th>
                    <th className="px-4 py-2">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTickets.map((ticket, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-purple-100" : ""}
                    >
                      <td className="border px-4 py-2">{ticket.name}</td>
                      <td className="border px-4 py-2">{ticket.email}</td>
                      <td className="border px-4 py-2">{ticket.reg_no}</td>
                      <td className="border px-4 py-2">{ticket.uuid}</td>
                      <td className="border px-4 py-2">
                        <input
                          type="checkbox"
                          checked={ticket.selected}
                          onChange={() => handleCheckboxChange(index)}
                          className="cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ManageMail;
