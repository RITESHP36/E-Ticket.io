import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { supabase } from "../components/createClient";

const Scanner = () => {
  const [result, setResult] = useState("");
  const [ticketVerified, setTicketVerified] = useState(false);
  const [name, setName] = useState("");
  const [showScanner, setShowScanner] = useState(false); // New state variable

  const handleScan = async (data) => {
    if (data) {
      const [nameStr, uuidStr] = data.split(",");
      const name = nameStr.split(":")[1].trim();
      const uuid = uuidStr.split(":")[1].trim();

      const { data: ticketData, error } = await supabase
        .from("tickets")
        .select("name")
        .eq("name", name)
        .eq("uuid", uuid);

      if (error) {
        console.error("Error fetching ticket:", error);
        setTicketVerified(false);
        setResult("Ticket invalid");
      } else {
        if (ticketData.length > 0) {
          setTicketVerified(true);
          setName(name);
          setResult(`Ticket verified, Welcome - ${name}`);
        } else {
          setTicketVerified(false);
          setResult("Ticket invalid");
        }
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const toggleScanner = () => {
    setShowScanner(!showScanner);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={toggleScanner}
      >
        {showScanner ? "Close Scanner" : "Open Scanner"}
      </button>
      {showScanner && (
        <QrReader
          delay={300}
          onScan={handleScan}
          onError={handleError}
          style={{ width: "100%", maxWidth: "500px" }} // Limit width for better mobile view
        />
      )}
      <p className="mt-4">{result}</p>
    </div>
  );
};

export default Scanner;
