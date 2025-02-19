import '../index.css';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import api from '../api';
import '../styles.css';

const Monthlyreport = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false); // Add loading state

    // Fetch batches
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await api.get("/GetBatches");
                // console.log("Batch data:", response.data);
                setBatches(response.data);
            } catch (error) {
          //      console.error("Error fetching batches:", error);
            }
        };
        fetchBatches();
    }, []);

    // Handle search based on selected batch and date range
    const handleSearch = async () => {
        setLoading(true); // Show spinner
        try {
            const url = `/GetDataTable?sapcode=${selectedBatch}&date1=${startDate}&date2=${endDate}`;
            const response = await api.get(url);
            const contentType = response.headers['content-type'];

            if (contentType && contentType.includes("application/json")) {
                const fetchedData = response.data;
                // console.log("Fetched Data:", fetchedData);
                setData(fetchedData);
                setRowCount(fetchedData.length);
            } else {
             //   console.error("Unexpected content type:", contentType);
            }
        } catch (error) {
          //  console.error("Error fetching data:", error);
        } finally {
            setLoading(false); // Hide spinner after data fetch
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
  //  console.log("Downloading Excel");
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
                            <option value="">Select Compound</option>
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
                    <div className="form-group flex items-center mt-3">
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
            {loading && (
                <div className="flex justify-center items-center mt-4">
                    <div className="loader animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent rounded-full" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            <div className="max-w-6xl mx-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="sticky top-20 bg-gray-100 z-15">
                        <tr className="bg-gray-100 text-gray-700  text-sm leading-normal">
                        <th className="py-3 px-3 text-left">Test-Date</th>
                            <th className="py-3 px-3 text-left">Sapcode </th>
                            <th className="py-3 px-3 text-left">Batch_No</th>
                           
                            <th className="py-3 px-3 text-left">ML (R1)</th>
                            <th className="py-3 px-3 text-left">MH (R2)</th>
                            <th className="py-3 px-3 text-left">TS2 (R3)</th>
                            <th className="py-3 px-3 text-left">Tc50 (R4)</th>
                            <th className="py-3 px-3 text-left">TC90 (R5)</th>
                            <th className="py-3 px-3 text-left">WT-KG</th>
                            <th className="py-3 px-3 text-left">HRD (H1)</th>
                            <th className="py-3 px-3 text-left">SPG (S1)</th>
                            <th className="py-3 px-3 text-left">Dump Temp</th>
                            <th className="py-3 px-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, index) => {
                                const renderCell = (value) => {
                                  
                                    return typeof value === 'object' && value !== null
                                      ? Object.keys(value).length === 0
                                        ? ''
                                        : JSON.stringify(value)
                                      : value || '';
                                  };
                                return (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                         <td className="py-3 px-2 text-gray-800">{row.Reho_Date_Time}</td>
                                        <td className="py-3 px-2 text-gray-800">{selectedBatch || ''}</td>
                                        <td className="py-3 px-2 text-gray-800 uppercase">{renderCell(row.Batch_No)}</td>
                                       
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.R_ml)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.R_mh)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.R_ts2)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.R_tc50)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.R_tc90)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.Batch_Weight)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.Hardness)}</td>
                                        <td className="py-3 px-2 text-gray-800">{renderCell(row.SpecificGravity)}</td>
                                      
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
