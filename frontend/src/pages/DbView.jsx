import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useCallback } from 'react';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// --- 2. Data Fetching Component with Polling ---
// This component now accepts a `pollInterval` prop in milliseconds.

function SupabaseTableViewer({ tableName, pollInterval }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // For the initial full-page load
  const [isRefreshing, setIsRefreshing] = useState(false); // For subsequent background refreshes
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // We wrap fetchData in useCallback to prevent it from being recreated on every render.
  const fetchData = useCallback(async () => {
    // Show the refresh indicator on every fetch.
    setIsRefreshing(true);

    try {
      const { data: records, error: fetchError } = await supabase
        .from(tableName)
        .select('*');

      if (fetchError) {
        throw fetchError;
      }
      
      // Update state with the new data and the time of the update
      setData(records || []);
      setLastUpdated(new Date());
      setError(null); // Clear previous errors on a successful fetch

    } catch (err) {
      console.error("Error polling data: ", err);
      setError(err.message || 'An unknown error occurred during refresh.');
    } finally {
      // Turn off both loaders. `setLoading` is for the initial load,
      // `setIsRefreshing` is for the polling indicator.
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [tableName]); // Dependency array: re-create this function only if tableName changes

  useEffect(() => {
    // 1. Fetch data immediately when the component mounts
    fetchData();

    // 2. Set up the polling interval if pollInterval is a positive number
    if (pollInterval && pollInterval > 0) {
      const intervalId = setInterval(fetchData, pollInterval);

      // 3. IMPORTANT: Return a cleanup function to clear the interval
      // This runs when the component unmounts, preventing memory leaks.
      return () => clearInterval(intervalId);
    }
  }, [tableName, pollInterval, fetchData]); // Effect dependencies

  // --- Render Logic ---

  // Show a full-page loader only on the initial load
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600">Loading data from '{tableName}'...</p>
      </div>
    );
  }

  // If there's an error and we have no data to show, display a large error message.
  if (error && data.length === 0) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Oops! An Error Occurred</p>
        <p>Could not fetch data from the '{tableName}' table.</p>
        <pre className="mt-2 text-sm bg-red-50 p-2 rounded">{error}</pre>
      </div>
    );
  }

  // If we have no data (and no error), show a "no records" message.
  if (data.length === 0) {
    return <p className="text-center text-gray-500 p-8">No records found in the '{tableName}' table.</p>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">{tableName} Records</h2>
        <div className="flex items-center space-x-2">
          {/* Show a small spinner during background refreshes */}
          {isRefreshing && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500" title="Refreshing..."></div>
          )}
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
      {/* Show a non-blocking error message if a poll fails but we still have old data */}
      {error && <div className="bg-yellow-100 text-yellow-800 p-2 rounded-md text-sm mb-4">Failed to refresh data. Showing last known records. Error: {error}</div>}
      <ul className="space-y-4">
        {data.map((record) => (
          <li key={record.uuid} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            {Object.entries(record).map(([key, value]) => (
              <div key={key} className="flex flex-wrap text-sm">
                <strong className="w-1/3 text-gray-600 capitalize">{key.replace('_', ' ')}:</strong>
                <span className="w-2/3 text-gray-800 break-words">{JSON.stringify(value)}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}


// --- 3. Main App Component ---
export default function App() {
  const myTableName = 'tickets';
  // Set the polling interval in milliseconds. 
  // For example, 5000ms = 5 seconds.
  const refreshInterval = 5000; 

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Supabase Realtime Data Viewer
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Automatically refreshing every {refreshInterval / 1000} seconds.
          </p>
        </header>

        <main className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
           {supabaseUrl === 'YOUR_SUPABASE_URL' ? (
             <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Configuration Needed</p>
                <p>Please open this file, replace <strong>'YOUR_SUPABASE_URL'</strong> and <strong>'YOUR_SUPABASE_ANON_KEY'</strong> with your actual Supabase credentials.</p>
             </div>
           ) : (
             <SupabaseTableViewer tableName={myTableName} pollInterval={refreshInterval} />
           )}
        </main>
      </div>
    </div>
  );
}
