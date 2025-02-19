import '../index.css';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import '../styles.css';
import api from '../api';

const OverallReport = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleSearch = async () => {
        setLoading(true); // Set loading to true when search starts
        try {
          // const url = `http://192.168.20.70:4435/WeatherForecast/allreport?date1=${startDate}&date2=${endDate}`;
           const url = `/allreport?date1=${startDate}&date2=${endDate}`;
            
           const response = await api.get(url);
            const contentType = response.headers['content-type'];

            if (contentType && contentType.includes("application/json")) {
                const fetchedData = response.data;
                // console.log("Fetched Data:", fetchedData);
                setData(fetchedData);
                setRowCount(fetchedData.length);
            } else {
                console.error("Unexpected content type:", contentType);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); // Set loading to false after data is fetched
        }
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data); // Convert data to worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Overall Report");

        // Set column headers
        worksheet["!cols"] = [
            { wch: 20 }, // Batch Name width
            { wch: 15 }, // Batch No width
            { wch: 25 }, // Date&Time width
            { wch: 10 }, // ML width
            { wch: 10 }, // MH width
            { wch: 10 }, // TS2 width
            { wch: 10 }, // TC50 width
            { wch: 10 }, // TC90 width
            { wch: 10 }, // Hardness width
            { wch: 15 }, // SP-Gravity width
            { wch: 10 }, // Wt width
            { wch: 15 }, // Dump Temp width
            { wch: 15 }, // Status width
        ];

        XLSX.writeFile(workbook, "Overall_Report.xlsx"); // Download the Excel file
    };

    return (
        <div className="">
            <div className="max-w-6xl mx-auto p-1 bg-white shadow-md sticky top-0 z-18 rounded-lg">
                <div className="flex flex-wrap items-center">
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

            {/* Spinner while loading */}
            {loading && (
                <div className="flex justify-center items-center mt-4">
                    <div className="loader animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent rounded-full" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto mt-4">
                {!loading && (
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="sticky top-20 bg-gray-100 z-15">
                            <tr className="bg-gray-100 text-gray-700  text-sm leading-normal">
                                <th className="py-4 px-2 text-left">Test-Date</th>
                                <th className="px-4 py-2 text-left">Batch Name</th>
                                <th className="py-4 px-2 text-left">Batch_No</th>
                               
                                <th className="py-4 px-2 text-left">ML (R1)</th>
                                <th className="py-4 px-2 text-left">MH (R2)</th>
                                <th className="py-4 px-2 text-left">TS2 (R3)</th>
                                <th className="py-4 px-2 text-left">TC50 (R4)</th>
                                <th className="py-4 px-2 text-left">TC90 (R5)</th>
                                <th className="py-4 px-2 text-left">WT-KG</th>
                                <th className="py-4 px-2 text-left">HRD (H1)</th>
                                <th className="py-4 px-2 text-left">SPG (S1)</th>
                               
                                <th className="py-4 px-2 text-left">Dump Temp</th>
                                <th className="py-4 px-2 text-left">Status</th>
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
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.Reho_Date_Time)}</td>
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.Batch_Name)}</td>
                                            <td className="py-4 px-2 text-gray-800 uppercase">{renderCell(row.Batch_No)}</td>
                                           
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.R_ml)}</td>
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.R_mh)}</td>
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.R_ts2)}</td>
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.R_tc50)}</td>
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.R_tc90)}</td>
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.Batch_Weight)}</td>
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.Hardness)}</td>
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.SpecificGravity)}</td>
                                           
                                            <td className="py-4 px-2 text-gray-800">{renderCell(row.Dump_Temp)}</td>
                                            <td className="py-4 px-2 text-gray-950">{renderCell(row.status)}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="13" className="py-3 px-4 text-center text-red-400">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OverallReport;
