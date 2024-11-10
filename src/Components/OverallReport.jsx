import '../index.css';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const OverallReport = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState(0);

    const handleSearch = async () => {
        try {
            const url = `http://localhost:4433/WeatherForecast/allreport?date1=${startDate}&date2=${endDate}`;
            const response = await axios.get(url);
            const contentType = response.headers['content-type'];

            if (contentType && contentType.includes("application/json")) {
                const fetchedData = response.data;
                console.log("Fetched Data:", fetchedData);
                setData(fetchedData);
                setRowCount(fetchedData.length);
            } else {
                console.error("Unexpected content type:", contentType);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
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
            <div className="max-w-6xl mx-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="sticky top-20 bg-gray-100 z-15">
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <th className="px-4 py-2 text-left">Batch Name</th>
                            <th className="py-4 px-2 text-left">Batch_No</th>
                            <th className="py-4 px-2 text-left">Date&Time</th>
                            <th className="py-4 px-2 text-left">ML</th>
                            <th className="py-4 px-2 text-left">MH</th>
                            <th className="py-4 px-2 text-left">TS2</th>
                            <th className="py-4 px-2 text-left">TC50</th>
                            <th className="py-4 px-2 text-left">TC90</th>
                            <th className="py-4 px-2 text-left">HRD</th>
                            <th className="py-4 px-2 text-left">SP-Gravity</th>
                            <th className="py-4 px-2 text-left">Wt</th>
                            <th className="py-4 px-2 text-left">Dump Temp</th>
                            <th className="py-4 px-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, index) => {
                                const renderCell = (value) => (typeof value === 'object' && value !== null ? (Object.keys(value).length === 0 ? '' : JSON.stringify(value)) : value || '');

                                return (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.Batch_Name)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.Batch_No)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.Reho_Date_Time)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.ML)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.MH)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.TS2)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.TC50)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.TC90)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.Hardness)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.SpecificGravity)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.Batch_Weight)}</td>
                                        <td className="py-4 px-2 text-gray-800">{renderCell(row.Dump_Temp)}</td>
                                        <td className="py-4 px-2 text-gray-950">{renderCell(row.Quality)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="13" className="py-3 px-4 text-center text-gray-600">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OverallReport;
