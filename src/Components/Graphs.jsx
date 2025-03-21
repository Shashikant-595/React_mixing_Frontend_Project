import '../index.css';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from '../api';
import '../styles.css';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import DataTable from "../Components/DataTable";
import { jsPDF } from "jspdf";
export default function Graphs() {
    const [batches, setBatches] = useState([]);
    const [sapCodes, setSapCodes] = useState([]);
    const [selectedSapCode, setSelectedSapCode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [batchList, setBatchList] = useState([]);
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [graphData, setGraphData] = useState({});
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [selectedBatchName, setSelectedBatchName] = useState('');
    // Fetch SAP Codes
    useEffect(() => {
        const fetchSapCodes = async () => {
            try {
                const response = await api.get("/GetBatches");
                setSapCodes(response.data);
            } catch (error) {
                console.error("Error fetching SAP codes:", error);
            }
        };
        fetchSapCodes();
    }, []);

    // Fetch Batches List
    const handleSearch = async () => {
        setBatchList([]); 
        setSelectedBatches([]);
        if (!selectedSapCode) {
            alert("Please select a SAP Code.");
            return;
        }

        setLoading(true);
        try {
            const url = `/GraphsfileList?sapCode=${selectedSapCode}&startDate=${startDate}&endDate=${endDate}`;
            const response = await api.get(url);
            setBatchList(response.data);
           
        } catch (error) {
           alert("file not found");
            console.error("Error fetching batch list:", error);
        } finally {
            setLoading(false);
        }
    };
// fetch daat for graph 
const fetchTableData = async () => {
    try {
        // Remove "_R.csv" from each batch name
        const processedBatchNames = selectedBatches.map(batch => batch.replace("_R.csv", ""));

        // Construct query parameters
        const queryParams = new URLSearchParams();
        queryParams.append("sapCode", selectedSapCode);
        processedBatchNames.forEach(batch => queryParams.append("batchNames", batch));

        // Correct URL formatting
        const url1 = `/Graphbatch_data?${queryParams.toString()}`;

        // API call using `api.get`
        const response = await api.get(url1);

        // Set table data
        setTableData(response.data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

    // Handle batch selection
    const handleCheckboxChange = (batch) => {
        setSelectedBatches((prevSelected) =>
            prevSelected.includes(batch)
                ? prevSelected.filter((b) => b !== batch)
                : [...prevSelected, batch]
        );
    };
    const CustomLegend = (props) => {
        const { payload } = props;
        return (
          <ul className="flex space-x-4">
            {payload.map((entry, index) => (
              <li key={index} style={{ fontWeight: 'bold', color: entry.color }}>
                {entry.value}
              </li>
            ))}
          </ul>
        );
      };
    //   const captureRef = useRef(null);
    //   const handleDownloadGraph = (batchName) => {
    //     if (captureRef.current) {
    //         html2canvas(captureRef.current, { scale: 2 }).then(canvas => {
    //             const link = document.createElement("a");
    //             link.href = canvas.toDataURL("image/png");
    //             link.download =`${batchName}.png`;
    //             link.click();
    //         });
    //     }
    // };

    const captureRef = useRef(null);

const handleDownloadGraph = (batchName) => {
    if (captureRef.current) {
        html2canvas(captureRef.current, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
            
            pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
            pdf.save(`${batchName}.pdf`);
        });
    }
};
    const handleSelectChange = (e) => {
        const selectedSapCode = e.target.value;
        setSelectedSapCode(selectedSapCode);
    
        // Find the batch_name for the selected sapCode
        const selectedBatch = sapCodes.find(sap => sap.sapCode === selectedSapCode);
        if (selectedBatch) {
          setSelectedBatchName(selectedBatch.batch_name);
        }
      };
    
    // Generate Graph
    const handleGenerateGraph = async () => {
        setGraphData({});  
       
        if (!selectedSapCode) {
            alert("Please select a SAP Code.");
            return;
        }
        if (selectedBatches.length === 0) {
            alert("Please select at least one batch.");
            return;
        }
       
        setLoading(true);
        try {
            const apiUrl = `/graphs?sapCode=${selectedSapCode}&${selectedBatches.map(batch => `batchNames=${batch}`).join('&')}`;
            const response = await api.get(apiUrl);

            if (response.data) {
                setGraphData(response.data);
            } else {
                console.error("No data returned from API");
            }
        } catch (error) {
            console.error("Error fetching graph data:", error);
        } finally {
            setLoading(false);
            fetchTableData();
        }
        
    };

    // Colors for different batch lines
    const colors = ["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#800080", "#FFC0CB", "#008080", "#FF4500"];

    return (
        <div className="">
            <div className="max-w-6xl mx-auto p-1 bg-white shadow-md sticky top-0 z-18 rounded-lg">
                <div className="flex flex-wrap items-center">
                    <div className="form-group mr-2 mb-2">
                    <label htmlFor="sapCodeSelect" className="block text-md font-medium text-gray-700">Compound Name</label>
      <select
        id="sapCodeSelect"
        value={selectedSapCode}
        onChange={handleSelectChange}
        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select Compound</option>
        {Array.isArray(sapCodes) && sapCodes
          .sort((a, b) => a.batch_name.trim().localeCompare(b.batch_name.trim())) // Sort batch names
          .map((sap, index) => (
            <option key={index} value={sap.sapCode}>
              {sap.batch_name.trim()}
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
                            className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-900 focus:outline-none mr-2"
                        >
                            Search
                        </button>
                    </div>
                    <div className="form-group flex items-center mt-3">
                        <button
                            onClick={handleGenerateGraph}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 focus:outline-none mr-2"
                        >
                            Generate Graph
                        </button>
                    </div>
                    <div className="form-group flex items-center mt-3">
            <button
                onClick={()=>handleDownloadGraph(selectedBatchName)}
                className="bg-green-300 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none mr-2"
            >
                Download Graph
            </button>
        </div>
                </div>
            </div>

          {/* Batch Selection */}
<div className="max-w-6xl mx-auto mt-4">
    <div className="border border-gray-300 rounded-lg overflow-y-auto max-h-[150px] p-2">
        <table className="w-full border-collapse">
            <tbody className="grid grid-cols-4 gap-2"> {/* Apply grid to tbody */}
                {batchList.map((batch, index) => (
                    <tr key={index} className="contents"> {/* Use contents to preserve table structure */}
                        <td className="border border-gray-300 px-4 py-2 flex items-center space-x-2">
                            <input type="checkbox" className="w-6 h-6 accent-blue-500 cursor-pointer"  value={batch} onChange={() => handleCheckboxChange(batch)} />
                            <span>{batch}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

<div ref={captureRef} className="p-4 bg-white">
<h1 className="mb-2 text-center text-black">
  <span className="inline-block mr-2">ODR TEST REPORT</span>
  <span className="inline-block ml-3">Set Temp(°C) : 160</span>
  <span className="inline-block ml-3">Test Time(Mins) : 6</span>
</h1>
<div className=" max-w-6xl mx-auto mt-4 border border-gray-300">
<DataTable tableData={tableData} selectedSapCode={selectedSapCode + " /" + selectedBatchName} />
</div>



{Object.keys(graphData).length > 0 && (
    <div className="max-w-6xl mx-auto mt-6">
        <ResponsiveContainer width="100%" height={400}>
            <LineChart>
                <CartesianGrid strokeDasharray="3 3" />

                {/* X-Axis with fixed range */}
                <XAxis
                    dataKey="time"
                    type="number" // Ensures numeric scaling
                    domain={["dataMin", "dataMax"]} // Ensures X-axis stays consistent
                    allowDataOverflow={true}
                    label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
                />

                {/* Y-Axis */}
                <YAxis 
                    label={{ value: 'Torque', angle: -90, position: 'insideLeft', offset: 0 }} 
                />

                <Tooltip />
                
                {/* Legend */}
                <Legend 
                    layout="horizontal"
                    align="center"
                    verticalAlign="top"
                    wrapperStyle={{ paddingBottom: '10px' }}
                />

                {/* Lines with dynamic names and fixed X-axis */}
                {Object.keys(graphData).map((batchName, index) => (
                    <Line
                        key={batchName}
                        type="monotone"
                        data={graphData[batchName]}
                        dataKey="torque"
                        stroke={colors[index % colors.length]}
                        name={batchName}
                        dot={false}
                        strokeWidth={3}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    </div>
)}

        </div>
        </div>
    );
    
}
// code for length shrinking of batch line graph lenth 
 {/* Graph */}
//  {Object.keys(graphData).length > 0 && (
//     <div className="max-w-6xl mx-auto mt-6">
        
//         <ResponsiveContainer width="100%" height={400}>
// <LineChart>
// <CartesianGrid strokeDasharray="3 3" />

// {/* X-Axis with label */}
// <XAxis 
// dataKey="time" 
// label={{ value: 'Time', position: 'insideBottom', offset: -5 }} 
// />

// {/* Y-Axis with label */}
// <YAxis 
// label={{ value: 'Torque', angle: -90, position: 'insideLeft', offset: 0 }} 
// />

// <Tooltip />

// {/* Legend */}
// <Legend 
// layout="horizontal" 
// align="center" 
// verticalAlign="top" 
// wrapperStyle={{ paddingBottom: '10px' }}
// />

// {/* Lines with dynamic names and custom colors */}
// {Object.keys(graphData).map((batchName, index) => (
// <Line
//     key={batchName}
//     type="monotone"
//     data={graphData[batchName]}
//     dataKey="torque"
//     stroke={colors[index % colors.length]}
//     name={batchName} // This will be shown in the legend
//     dot={false}
//     strokeWidth={2} // For bold line
// />
// ))}
// </LineChart>
// </ResponsiveContainer>