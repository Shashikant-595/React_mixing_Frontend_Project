import React, { useEffect, useState, useRef } from "react";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Button } from "@mui/material"; // Import Material-UI Button for styling

// ✅ Register necessary Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const RheometerGraph = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const chartRef = useRef(null); // ✅ Reference to the chart component

    useEffect(() => {
        fetch("http://localhost:4433/Mixing/graphs")  // Ensure API is running
            .then((response) => response.json())
            .then((data) => {
                const timeValues = data.map((item) => item.time);
                const torqueValues = data.map((item) => item.torque);

                setChartData({
                    labels: timeValues,
                    datasets: [
                        {
                            label: "Torque vs Time",
                            data: torqueValues,
                            borderColor: "blue",
                            borderWidth: 2,
                            fill: false,
                            pointRadius: 3,
                        },
                    ],
                });
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // ✅ Function to Download Graph as PNG
    const downloadGraph = () => {
        if (chartRef.current) {
            const link = document.createElement("a");
            link.href = chartRef.current.toBase64Image(); // Convert chart to base64 image
            link.download = "Torque_vs_Time_Graph.png"; // Set filename
            link.click(); // Trigger download
        }
    };

    return (
        <div style={{ width: "80%", height: "500px", margin: "auto" }}>
            <h2>Torque vs Time Graph</h2>
            <Line
                ref={chartRef} // ✅ Attach ref to chart
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { display: true, text: "Time (mins)" } },
                        y: { title: { display: true, text: "Torque" } },
                    },
                }}
            />
            {/* ✅ Download Button */}
            <Button 
                variant="contained" 
                color="primary" 
                onClick={downloadGraph}
                style={{ marginTop: "20px" }}
            >
                Download Graph
            </Button>
        </div>
    );
};

export default RheometerGraph;
