import React from 'react';
import '../index.css';
import './Sidebar.css';

export default function Header() {
  return (
    <div>
        <header className="bg-gray-400 text-white p-1 flex  items-center fixed-header">
                <img
                    src="https://foreselastomech.com/wp-content/uploads/2019/03/FORES-Logo.png"
                    alt="Logo"
                    className="h-10 logo-with-shadow"
                />
             
                <div className='flex-grow text-center'>
                    {/* <h1 className='text-2xl font-bold text-white '>Fores Mixing Quality Control</h1> */}
                    <h1 className='text-2xl font-bold  text-slate-100'>Fores Mixing Quality Control</h1>
                </div>
            </header>
    </div>
  );
}
