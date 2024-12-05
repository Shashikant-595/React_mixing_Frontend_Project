
import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons
import api from '../api';
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
    allrejected:0,
    inprocess :0,
    totaltesting:0,


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
        // console.log("Connected to SignalR");

        connection.on("ReceiveDataUpdate", (data) => {
          if (data && typeof data === 'object') {
            console.log("data"+data);
            console.log("okBatches"+data.okBatches);
            console.log("rs"+data.rejectedBatches);
            console.log("holdBatches"+data.holdBatches);
            console.log("data"+data.totaltesting);
            console.log("data"+data.totaltesting);
            console.log("data"+data.totaltesting);
            console.log("data"+data.totaltesting);

            setBatchData({
              okBatches: data.okBatches || 0,
              rejectedBatches: data.rejectedBatches || 0,
              holdBatches: data.holdBatches || 0,
              monthlyTotalBatches: data.monthlyTotalBatches || 0,
              allrejected :data.allrejectedbatches || 0,
              inprocess : data.inprocess||0,
              totaltesting: data.totaltesting

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
      
      const response = await api.get('/allProduction'); // `api` automatically uses the base URL
    const data = response.data;
   
      if (Array.isArray(data.data)) {
       
        setMonthlyData(data.data);
      }
    } catch (error) {
      console.error("Error fetching monthly data: ", error);
    }
  };

  useEffect(() => {
    fetchtodaysData();
     
  }, []);

  
  //   for todays live production 
  const [toDaysdata, setData] = useState([]);
  
  const fetchtodaysData = async () => {
    try {
      const url = `/todaysData`;
      const response = await api.get(url);
  
      // The data is available in `response.data`
      if (response.status === 200 && Array.isArray(response.data)) {
        const fetchedData = response.data; // Extract the data
        // console.log("Fetched Data:", fetchedData); // Log the fetched data for debugging
        setData(fetchedData); // Update the state with the fetched data
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
  
  }

  useEffect(() => {
    fetchMonthlyData();
     
  }, []);

  console.log("monthaly data"+monthlyData);
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Batch Production',
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
    labels: ['OK Batches', 'Rejected Batches', 'InProcess Batch'],
    datasets: [
      {
        data: [batchData.okBatches, batchData.allrejected, batchData.inprocess],
        backgroundColor: ['#10B981', '#EF4444', '#FBBF24'],
        hoverBackgroundColor: ['#34D399', '#F87171', '#ffcf4e'],
      }
    ]
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} w-auto min-h-screen rounded-lg`}>
      <header className="ml-5 flex justify-between items-center p-1  mb-1">
        <div className="moving-text-container">
          {/* <h4 className="moving-text">__Welcome To Mixing Dashboard__</h4> */}
        </div>
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full focus:outline-none transition-colors duration-200"
        >
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
        </button>
      </header>
      <main className="flex-grow p-3">
      <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 text-center underline underline-offset-4`}>Monthly Batch Quality Status </h3>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-2">

        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-500 hover:shadow-2xl transition-shadow duration-300`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}> Batches Tested </h3>
            <p className="text-2xl text-center font-semibold text-pink-400">{batchData.totaltesting}</p>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-500 hover:shadow-2xl transition-shadow duration-300 `}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-center`}>  Batches Produced</h3>
            <p className="text-2xl text-center font-semibold text-blue-500">{batchData.monthlyTotalBatches}</p>
          </div>
         
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-500 hover:shadow-2xl transition-shadow duration-300`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}> Incomplete Data </h3>
            <p className="text-2xl text-center font-semibold text-yellow-500"> {batchData.inprocess}</p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-500 hover:shadow-2xl transition-shadow duration-300`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}> Rejected Batches</h3>
            <p className="text-2xl text-center font-semibold text-red-600">{batchData.allrejected}</p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-500 hover:shadow-2xl transition-shadow duration-300`}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}> Ok Batches</h3>
            <p className="text-2xl text-center font-semibold text-green-600">{batchData.okBatches}</p>
          </div>
        </section>

        {/* Chart Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-10 rounded-lg shadow-md mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`} style={{ height: '300px', overflow: 'hidden' }}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center mb-4 underline underline-offset-4`}>Batch Production Over Year</h3>
            <div style={{ height: '100%' }}>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className={`p-11 rounded-lg shadow-md  mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`} style={{ height: '300px', overflow: 'hidden' }}>
            <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center mb-4 underline underline-offset-4`}>Monthly Batch Quality Status Distribution</h3>
            <div style={{ height: '100%' }}>
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-1 gap-4 ">
  {/* <div className={`py-1 px-2 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-blue-900`} style={{ height: '300px', overflow: 'hidden' }}>
    <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 text-center`}></h3>
    <div style={{ height: '100%' }}>
      
    </div>
  </div> */}

  <div className={`py-1 px-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-slate-50'} shadow-blue-900`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 text-center underline underline-offset-4 `}>Today's Batch Testing Status</h3>
    <div style={{ flexGrow: 1, overflow: 'auto' }}>
      <table className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700 '} min-w-full rounded-lg shadow-md`}>
        <thead className="sticky top-0">
          <tr className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} uppercase text-sm leading-normal`}>
          <th className="py-4 px-2 text-left">Date&Time</th>
            <th className="px-4 py-2 text-left">Sapcode</th>
            <th className="px-4 py-2 text-left">Batch Name</th>
            <th className="py-4 px-2 text-left">Batch_No</th>  
            <th className="py-4 px-2 text-left">ML</th>
            <th className="py-4 px-2 text-left">MH</th>
            <th className="py-4 px-2 text-left">TS2</th>
            <th className="py-4 px-2 text-left">TC50</th>
            <th className="py-4 px-2 text-left">TC90</th>
            <th className="py-4 px-2 text-left">HRD</th>
            <th className="py-4 px-2 text-left">Wt</th>
            <th className="py-4 px-2 text-left">Sp-Gravity</th>
            <th className="py-4 px-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
  {toDaysdata.length > 0 ? (
    toDaysdata.map((row, index) => {
      const renderCell = (value) => {
        if (typeof value === 'string' && /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/.test(value)) {
          // Convert the date format
          const [month, day, yearAndTime] = value.split('/');
          const [year, time] = yearAndTime.split(' ');
          return `${day}/${month}/${year} ${time}`;
        }
        return typeof value === 'object' && value !== null
          ? Object.keys(value).length === 0
            ? ''
            : JSON.stringify(value)
          : value || '';
      };
      return (
        <tr key={index} className={`${isDarkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-300'}`}>
           <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.Reho_Date_Time)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.Sapcode)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.batch_name)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.Batch_No)}</td> 
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.R_ml)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.R_mh)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.R_ts2)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.R_tc50)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.R_tc90)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.Hardness)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.Batch_Weight)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.SpecificGravity)}</td>
          <td className={`${isDarkMode ? 'text-white' : 'text-gray-700'} py-4 px-2`}>{renderCell(row.status)}</td>
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
    </div>
  </div>
</section>


      </main>
    </div>
  );
}





