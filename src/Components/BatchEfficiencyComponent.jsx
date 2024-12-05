import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import api from '../api';
// Register necessary chart elements
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const BatchEfficiencyComponent = () => {
  const [batchCount, setBatchCount] = useState(null);
  const [efficiency, setEfficiency] = useState(0);

  // Fetch the batch count from the backend
  useEffect(() => {
    const fetchBatchCount = async () => {
      try {
        const response = await api.get('/_22hoursBatches'); // Use the `api` instance for the request
        const batchCount = response.data; // Axios automatically parses JSON
        setBatchCount(batchCount);

        // Calculate efficiency
        const efficiency = (batchCount / 132) * 100;
        setEfficiency(efficiency);
      } catch (error) {
        console.error('Error fetching batch count:', error);
      }
    };

    fetchBatchCount();
  }, []); // Runs once when the component is mounted

  // Pie chart data
  const chartData = {
    labels: ['Efficiency', 'Remaining'],  // Two parts: Efficiency and Remaining
    datasets: [
      {
        data: [efficiency, 100 - efficiency], // Efficiency and remaining portion
        backgroundColor: ['#4caf50', '#f44336'],  // Green for efficiency, red for remaining
        hoverBackgroundColor: ['#45a049', '#d32f2f'],
      },
    ],
  };

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-lg">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Mixing Production Efficiency</h3>
  {batchCount !== null ? (
    <div>
      <p className="text-gray-700 mb-2">22 Hours Batches Produced: <span className="font-bold">{batchCount}</span></p>
      <p className="text-gray-700 mb-4">Efficiency: <span className="font-bold">{efficiency.toFixed(2)}%</span></p>
      <div className="w-72 h-72 mx-auto">
        {/* Tailwind classes to control width, height, and centering */}
        <Pie data={chartData} />
      </div>
    </div>
  ) : (
    <p className="text-gray-500">Loading...</p>
  )}
</div>

  );
};

export default BatchEfficiencyComponent;
