import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    // Main container: full screen, dark gradient background, centered content
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black flex flex-col items-center justify-center p-4 text-white font-sans">

      {/* Big Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
        Ticket Generation and Validation
      </h1>

      {/* Grid container for the two main action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">

        {/* Scan Card */}
        <div className="flex flex-col items-center text-center p-8 bg-black bg-opacity-20 rounded-xl backdrop-blur-md border border-gray-600">
          <button
            onClick={() => navigate('/scan')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-lg text-xl shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Scan
          </button>
          <p className="mt-4 text-gray-300">
            The Scan page lets you verify the tickets issued.
          </p>
        </div>

        {/* Admin Card */}
        <div className="flex flex-col items-center text-center p-8 bg-black bg-opacity-20 rounded-xl backdrop-blur-md border border-gray-600">
          <button
            onClick={() => navigate('/admin')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-lg text-xl shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Admin Page
          </button>
          <p className="mt-4 text-gray-300">
            The Admin page lets you add people, generate tickets, see their usage status, and mail the tickets.
          </p>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
