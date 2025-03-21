// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './Components/Sidebar';
// import Header from './Components/Header';
// import Home from './Components/Home';
// import OverallReport from './Components/OverallReport'; // Your other components
// import Monthlyreport from './Components/Monthlyreport'; // Example component
// import Graphs from './Components/Graphs';
// import './styles.css'; // Import your CSS

// function App() {
//     return (
//         <Router>
//             <div className="app-container">
//                 <Header className="fixed-header" />
//                 <Sidebar className="sidebar" />
//                 <main className="main-content ">
//                     <Routes>
//                         <Route path="/" element={<Home />} />
//                         <Route path="/OverallReport" element={<OverallReport />} />
//                         <Route path="/Monthlyreport" element={<Monthlyreport />} />
//                         <Route path="/Graphs" element={<Graphs />} />
                 
               
                       
//                     </Routes>
//                 </main>
//             </div>
//         </Router>
//     );
// }

// export default App;


// with fms integration 
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Home from "./Components/Home";
import OverallReport from "./Components/OverallReport";
import Monthlyreport from "./Components/Monthlyreport";
import Graphs from "./Components/Graphs";
import api from "./api"; // Import your API instance
import "./styles.css";

function App() {
    const [permissions, setPermissions] = useState(null);

    return (
        <Router>
            <AppContent setPermissions={setPermissions} permissions={permissions} />
        </Router>
    );
}

function AppContent({ setPermissions, permissions }) {
    const { userType, empId, plantNumber } = useExtractParams(); // Now inside Router

    useEffect(() => {
        console.log("Extracted Params - userType:", userType, "empId:", empId, "plantNumber:", plantNumber);

        if (userType === "1") {
            console.log("User is admin, setting superadmin role");
            setPermissions({ role: "superadmin" });
        } else if (empId) {
            console.log("Fetching permissions for empId:", empId);
            fetchPermissions(empId, setPermissions);
        } else {
            console.log("No valid userType or empId found");
        }
    }, [userType, empId]);

    return (
        <div className="app-container">
            <Header className="fixed-header" />
            {permissions && <Sidebar className="sidebar" permissions={permissions} />}
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/OverallReport" element={<OverallReport />} />
                    <Route path="/Monthlyreport" element={<Monthlyreport />} />
                    <Route path="/Graphs" element={<Graphs />} />
                </Routes>
            </main>
        </div>
    );
}

// Fetch permissions from API
async function fetchPermissions(empId, setPermissions) {
    try {
        console.log(`Fetching permissions for empId: ${empId}`);
        const response = await api.get(`/fmsIntegration?employeeId=${empId}`);
        console.log("Fetched permissions data:", response.data);
        setPermissions(response.data);
    } catch (error) {
        console.error("Error fetching permissions:", error);
    }
}

// Custom Hook to Extract Params from URL
function useExtractParams() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userType = searchParams.get("userType");
    console.log("Raw userType from URL:", userType);  // Debugging userType
    
    // Extract userType and other parameters
    const pathSegments = location.pathname.split("/");
    console.log("Path Segments:", pathSegments);  // Debugging path segments

    // Extract userType from query string like '/shashi/1/604/7100'
    let extractedUserType = null;
    let empId = null;
    let plantNumber = null;

    if (userType) {
        // Split the userType value by '/' and extract the relevant values
        const userTypeSegments = userType.split("/");
        extractedUserType = userTypeSegments[2] || null; // Assuming the '1' is at index 2
        empId = userTypeSegments[3] || null; // Assuming empId is at index 3
        plantNumber = userTypeSegments[4] || null; // Assuming plantNumber is at index 4
    }

    console.log("Extracted Params - userType:", extractedUserType, "empId:", empId, "plantNumber:", plantNumber);

    return {
        userType: extractedUserType,
        empId: empId,
        plantNumber: plantNumber,
    };
}

export default App;


