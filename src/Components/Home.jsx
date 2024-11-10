
import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const [batchData, setBatchData] = useState({
    okBatches: 0,
    rejectedBatches: 0,
    holdBatches: 0,
    monthlyTotalBatches: 0,
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode); // Toggle function for dark mode

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://192.168.20.70:4435/dashboardHub")
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("Connected to SignalR");

        connection.on("ReceiveDataUpdate", (data) => {
          if (data && typeof data === 'object') {
            setBatchData({
              okBatches: data.okBatches || 0,
              rejectedBatches: data.rejectedBatches || 0,
              holdBatches: data.holdBatches || 0,
              monthlyTotalBatches: data.monthlyTotalBatches || 0,
            });
          }
        });
      } catch (error) {
        console.error("Connection failed: ", error);
        setTimeout(() => startConnection(), 5000);
      }
    };

    startConnection();

    return () => {
      connection.stop()
        .then(() => console.log("Connection stopped"))
        .catch(err => console.error("Error stopping connection: ", err));
    };
  }, []);

  const [monthlyData, setMonthlyData] = useState(new Array(12).fill(0));

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch('http://192.168.20.70:4435/WeatherForecast/allProduction');
      const data = await response.json();

      if (Array.isArray(data.data)) {
        setMonthlyData(data.data);
      }
    } catch (error) {
      console.error("Error fetching monthly data: ", error);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Production',
        backgroundColor: isDarkMode ? '#bb86fc' : '#aa5988',
        borderColor: isDarkMode ? '#3700b3' : 'pink',
        borderWidth: 3,
        hoverBackgroundColor: '#6366F1',
        hoverBorderColor: '#6366F1',
        data: monthlyData
      }
    ]
  };

  const doughnutData = {
    labels: ['OK Batches', 'Rejected Batches', 'Hold Batches'],
    datasets: [
      {
        data: [batchData.okBatches, batchData.rejectedBatches, batchData.holdBatches],
        backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
        hoverBackgroundColor: ['#34D399', '#F87171', '#FBBF24'],
      }
    ]
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} w-auto min-h-screen rounded-lg`}>
      <header className="ml-5 flex justify-between items-center p-1 rounded-lg shadow-sm mb-1">
        <div className="moving-text-container">
          <h4 className="moving-text">__Welcome To Mixing Dashboard__</h4>
        </div>
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full focus:outline-none transition-colors duration-200"
        >
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
        </button>
      </header>
      <main className="flex-grow">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Monthly Total Batches</h3>
            <p className="text-2xl text-center font-semibold text-blue-600">{batchData.monthlyTotalBatches}</p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Monthly OK Batches</h3>
            <p className="text-2xl text-center font-semibold text-green-600">{batchData.okBatches}</p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Monthly RS Batches</h3>
            <p className="text-2xl text-center font-semibold text-red-600">{batchData.rejectedBatches}</p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Monthly CC Batches</h3>
            <p className="text-2xl text-center font-semibold text-yellow-600">{batchData.holdBatches}</p>
          </div>
        </section>

        {/* Chart Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`py-10 px-2 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`} style={{ height: '300px', overflow: 'hidden' }}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Batch Production Over Year</h3>
            <div style={{ height: '100%' }}>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className={`py-10 px-2 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`} style={{ height: '300px', overflow: 'hidden' }}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Monthly Batch Quality Status Distribution</h3>
            <div style={{ height: '100%' }}>
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="mt-1">
          <h2 className="text-lg font-semibold mb-2">Detailed Batch Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Monthly Total Batches</h3>
            <p className="text-2xl text-center font-semibold text-green-600"></p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Monthly OK Batches test</h3>
            <p className="text-2xl text-center font-semibold text-green-600"></p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Monthly RS Batches test</h3>
            <p className="text-2xl text-center font-semibold text-green-600"></p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Monthly CC Batches test</h3>
            <p className="text-2xl text-center font-semibold text-green-600"></p>
          </div>
          </div>
        </section>
      </main>
    </div>
  );
}



