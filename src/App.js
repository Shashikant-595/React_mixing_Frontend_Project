import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import Home from './Components/Home';
import OverallReport from './Components/OverallReport'; // Your other components
import Monthlyreport from './Components/Monthlyreport'; // Example component
import './styles.css'; // Import your CSS

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header className="fixed-header" />
                <Sidebar className="sidebar" />
                <main className="main-content ">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/OverallReport" element={<OverallReport />} />
                        <Route path="/Monthlyreport" element={<Monthlyreport />} />
                        {/* Add other routes for components here */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
