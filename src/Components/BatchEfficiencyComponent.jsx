import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import api from '../api';
import '../styles.css'; // Import your CSS
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
        backgroundColor: ['#10B981', '#e42222'],  // Green for efficiency, red for remaining
        hoverBackgroundColor: ['#10B981', '#eb504e'],
      },
    ],
  };

  return (
    <div className="text-center p-0 bg-white rounded-lg shadow-md">
  <h3 className="text-lg font-semibold underline underline-offset-4  text-gray-800 mb-4 ">22 Hour's Mixing Production Efficiency</h3>
  {batchCount !== null ? (
    <div className="bg-white max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start">
    {/* Left Section: Description and Statistics */}
    <div className="md:w-1/2 md:pr-6">
  {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Efficiency Overview</h2> */}
  
  {/* Consistent alignment using grid layout */}
  <div className="grid grid-cols-2 gap-y-3">
    {/* Target Batches */}
    <span className="text-gray-700 text-lg font-medium text-start">Target Batches:</span>
    <span className="font-bold text-gray-900">132</span>
    
    {/* Batches Produced */}
    <span className="text-gray-700 text-lg font-medium text-start">Batches Produced:</span>
    <span className="font-bold text-gray-900">{batchCount}</span>
    
    {/* Efficiency */}
    <span className="text-gray-700 text-lg font-medium text-start">Efficiency:</span>
    <span className={`font-bold ${efficiency >= 75 ? 'text-green-600 ' : efficiency >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
      {efficiency.toFixed(2)}%
    </span>
    
    {/* Efficiency Lag */}
    <span className="text-gray-700 text-lg font-medium text-start">Efficiency Lag By:</span>
    <span className="text-red-600 text-lg font-medium">{(100 - efficiency).toFixed(2)}%</span>
    
   
  </div>
</div>

  
    {/* Right Section: Pie Chart */}
    <div className="md:w-1/2 flex flex-col items-center">
      <div className="w-64 h-64">
        <Pie data={chartData} />
      </div>
      {/* Labels for the Pie Chart */}
    
    </div>
  </div>
  
  ) : (
    <p className="text-gray-500">Loading...</p>
  )}
</div>

  );
};

export default BatchEfficiencyComponent;
