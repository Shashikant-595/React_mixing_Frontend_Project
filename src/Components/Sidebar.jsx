// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHouse, faFolderPlus, faChartLine, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
// import Swal from 'sweetalert2';
// import { Link } from 'react-router-dom'; // Import Link
// import './Sidebar.css';

// const Sidebar = () => {
//     const showSweetAlert = (title, text, icon) => {
//         Swal.fire({
//             title: title,
//             text: text,
//             icon: icon,
//             width: 400,
//             showConfirmButton: true,
//             // timer: 1000,
//         });
//     };
//     return (
//         <div className="flex">
//          {/* onClick={() => showSweetAlert('Create Category Clicked', 'Navigating to Create Category', 'info')} */}
//             <div className="icon-sidebar  sm:block label bg-gray-400" id="sidebar">
//                 <Link to="/" >
//                     <FontAwesomeIcon icon={faHouse} className="btn-scale logo-with-shadow1" style={{ color: 'black', marginTop:'10px'}} />
//                     <span>Home</span>
//                 </Link>
//                 <Link to="/OverallReport" >
//                     <FontAwesomeIcon icon={faFolderPlus} className="btn-scale logo-with-shadow1" style={{ color: 'black' }} />
//                     <span>All Report</span>
//                 </Link>
//                 <Link to="/Monthlyreport" >
//                     <FontAwesomeIcon icon={faFolderPlus} className="btn-scale logo-with-shadow1" style={{ color: 'black' }} />
//                     <span>Batch Report</span>
//                 </Link>
//                   {/* Add Graph Link */}
//                   <Link to="/Graphs">
//                     <FontAwesomeIcon icon={faChartLine} className="btn-scale logo-with-shadow1" style={{ color: 'black' }} />
//                     <span>Graph</span>
//                 </Link>
//                 {/* Add other links for your pages */}
//                 <Link to="http://192.168.20.70:96/Login.aspx" onClick={() => showSweetAlert('You are redirected on FMS', 'Logging out', 'warning')}>
//                     <FontAwesomeIcon icon={faRightFromBracket} className="logo-with-shadow1" style={{ color: '#ea3e3e' }} />
//                     <span>Logout</span>
//                 </Link>
//             </div>
//         </div>
//     );
// };
// export default Sidebar;
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFolderPlus, faChartLine, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // Import Link
import "./Sidebar.css";

const Sidebar = ({ permissions }) => {
    const showSweetAlert = (title, text, icon) => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            width: 400,
            showConfirmButton: true,
        });
    };

    // Check if the user is superadmin
    const isSuperAdmin = permissions?.role === "superadmin";

    return (
        <div className="flex">
            <div className="icon-sidebar sm:block label bg-gray-400" id="sidebar">
                <Link to="/">
                    <FontAwesomeIcon icon={faHouse} className="btn-scale logo-with-shadow1" style={{ color: "black", marginTop: "10px" }} />
                    <span>Home</span>
                </Link>

                {/* Show All Report & Batch Report only if isSuperAdmin OR mixing_report is true */}
                {(isSuperAdmin || permissions?.mixing_report) && (
                    <>
                        <Link to="/OverallReport">
                            <FontAwesomeIcon icon={faFolderPlus} className="btn-scale logo-with-shadow1" style={{ color: "black" }} />
                            <span>All Report</span>
                        </Link>
                        <Link to="/Monthlyreport">
                            <FontAwesomeIcon icon={faFolderPlus} className="btn-scale logo-with-shadow1" style={{ color: "black" }} />
                            <span>Batch Report</span>
                        </Link>
                    </>
                )}

                {/* Show Graph only if isSuperAdmin OR Graph is true */}
                {(isSuperAdmin || permissions?.Graphs) && (
                    <Link to="/Graphs">
                        <FontAwesomeIcon icon={faChartLine} className="btn-scale logo-with-shadow1" style={{ color: "black" }} />
                        <span>Graph</span>
                    </Link>
                )}

                {/* Logout Link */}
                <Link to="http://192.168.20.70:96/Login.aspx" onClick={() => showSweetAlert("You are redirected on FMS", "Logging out", "warning")}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="logo-with-shadow1" style={{ color: "#ea3e3e" }} />
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
