import { useState } from "react";

const DataTable = ({ tableData, selectedSapCode }) => {
    return (
        <table className="w-full border-collapse border  border-gray-300">
            <thead className="bg-gray-200  top-0">
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Sapcode/Compound Name</th>
                    <th className="border border-gray-300 px-4 py-2">Batch Number</th>
                    <th className="border border-gray-300 px-4 py-2">ML</th>
                    <th className="border border-gray-300 px-4 py-2">MH</th>
                    <th className="border border-gray-300 px-4 py-2">Ts2</th>
                    <th className="border border-gray-300 px-4 py-2">Tc50</th>
                    <th className="border border-gray-300 px-4 py-2">Tc90</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((row, index) => (
                    <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                            {index === 0 ? selectedSapCode : ""}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 uppercase">{row.Batch_No}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.R_ml}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.R_mh}</td>
                        <td className="border border-gray-300 px-4 py-2">{(Math.ceil((row.R_ts2 / 60) * 100) / 100).toFixed(2)} </td>
                       
                        <td className="border border-gray-300 px-4 py-2">{(Math.ceil((row.R_tc50/60)*100)/100).toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">{(Math.ceil((row.R_tc90/60)*100)/100).toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">{new Date(row.Reho_Date_Time).toLocaleString("en-GB", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, })}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
