import '../index.css';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const Monthlyreport = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState(0);

    // Fetch batches
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await axios.get("http://192.168.20.70:4435/WeatherForecast/GetBatches");
                console.log("Batch data:", response.data);
                setBatches(response.data);
            } catch (error) {
                console.error("Error fetching batches:", error);
            }
        };
        fetchBatches();
    }, []);

    // Handle search based on selected batch and date range
    const handleSearch = async () => {
        try {
            const url = `http://192.168.20.70:4435/WeatherForecast/GetDataTable?sapcode=${selectedBatch}&date1=${startDate}&date2=${endDate}`;
            const response = await axios.get(url);
            const contentType = response.headers['content-type'];

            if (contentType && contentType.includes("application/json")) {
                const fetchedData = response.data;
                console.log("Fetched Data:", fetchedData);
                setData(fetchedData);
                setRowCount(fetchedData.length); // Set row count based on data length
            } else {
                console.error("Unexpected content type:", contentType);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    



const downloadExcel = () => {
    // Retrieve batch_name based on selectedBatch
    const batchName = batches.find(batch => batch.sapCode === selectedBatch)?.batch_name.trim() || 'N/A';

    // Map through the data and add sapcode and batch_name as the first and second columns
    const exportData = data.map(row => ({
        sapcode: selectedBatch, // First column
        batch_name: batchName, // Second column
        ...row // Add remaining columns
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, batchName); // Use batchName as sheet name
    XLSX.writeFile(workbook, `${batchName}_Mixing_Data.xlsx`); // Save the file with batchName in filename
    console.log("Downloading Excel");
};

    return (
        <div className="">
            <div className="max-w-6xl mx-auto p-1 bg-white shadow-md sticky top-0 z-18 rounded-lg">
                <div className="flex flex-wrap items-center">
                    <div className="form-group mr-2 mb-2">
                        <label htmlFor="batchSelect" className="block text-md font-medium text-gray-700">Select Batch</label>
                        <select
                            id="batchSelect"
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select a batch</option>
                            {Array.isArray(batches) && batches.map((batch, index) => (
                                <option key={index} value={batch.sapCode}>
                                    {batch.batch_name.trim()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mr-4 mb-2">
                        <label htmlFor="startDate" className="block text-md font-medium text-gray-700">From</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="form-group mr-4 mb-2">
                        <label htmlFor="endDate" className="block text-md font-medium text-gray-700">Upto</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="form-group flex items-center mb-2">
                        <button
                            onClick={handleSearch}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-500 focus:outline-none mr-2"
                        >
                            Search
                        </button>
                        <button
                            onClick={downloadExcel}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-500 focus:outline-none"
                        >
                            Download Excel
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="sticky top-20 bg-gray-100 z-15">
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-3 text-left">Sapcode </th>
                            <th className="py-3 px-3 text-left">Batch_No</th>
                            <th className="py-3 px-3 text-left">Date&Time</th>
                            <th className="py-3 px-3 text-left">ML</th>
                            <th className="py-3 px-3 text-left">MH</th>
                            <th className="py-3 px-3 text-left">TS2</th>
                            <th className="py-3 px-3 text-left">TC90</th>
                            <th className="py-3 px-3 text-left">HRD</th>
                            <th className="py-3 px-3 text-left">SP-Gravity</th>
                            <th className="py-3 px-3 text-left">Wt</th>
                            <th className="py-3 px-3 text-left">Dump Temp</th>
                            <th className="py-3 px-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, index) => {
                                const parsedDate = row.Reho_Date_Time ? new Date(row.Reho_Date_Time) : null;
                                const formattedDate = parsedDate && !isNaN(parsedDate) ? parsedDate.toLocaleString() : 'N/A';

                                const renderCell = (value) => (typeof value === 'object' && value !== null ? (Object.keys(value).length === 0 ? '' : JSON.stringify(value)) : value || '');

                                return (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-2 text-gray-800">{selectedBatch || ''}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.Batch_No)}</td>
                                        <td className="py-3 px-2 text-gray-800">{formattedDate}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.R_ml)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.R_mh)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.R_ts2)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.R_tc90)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.Hardness)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.SpecificGravity)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.Batch_Weight)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.Dump_Temp)}</td>
                                        <td className="py-3 px-2 text-gray-950">{renderCell(row.status)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="12" className="py-3 px-4 text-center text-gray-600">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Monthlyreport ;
