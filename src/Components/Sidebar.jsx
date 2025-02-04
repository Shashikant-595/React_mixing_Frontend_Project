import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFolderPlus, faFileLines, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom'; // Import Link
import './Sidebar.css';

const Sidebar = () => {
    const showSweetAlert = (title, text, icon) => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            width: 400,
            showConfirmButton: true,
            // timer: 1000,
        });
    };
    return (
        <div className="flex">
         {/* onClick={() => showSweetAlert('Create Category Clicked', 'Navigating to Create Category', 'info')} */}
            <div className="icon-sidebar  sm:block label bg-gray-400" id="sidebar">
                <Link to="/" >
                    <FontAwesomeIcon icon={faHouse} className="btn-scale logo-with-shadow1" style={{ color: 'black', marginTop:'10px'}} />
                    <span>Home</span>
                </Link>
                <Link to="/OverallReport" >
                    <FontAwesomeIcon icon={faFolderPlus} className="btn-scale logo-with-shadow1" style={{ color: 'black' }} />
                    <span>All Report</span>
                </Link>
                <Link to="/Monthlyreport" >
                    <FontAwesomeIcon icon={faFolderPlus} className="btn-scale logo-with-shadow1" style={{ color: 'black' }} />
                    <span>Batch Report</span>
                </Link>
                {/* Add other links for your pages */}
                <Link to="http://192.168.20.70:96/Login.aspx" onClick={() => showSweetAlert('You are redirected on FMS', 'Logging out', 'warning')}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="logo-with-shadow1" style={{ color: '#ea3e3e' }} />
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};
export default Sidebar;
