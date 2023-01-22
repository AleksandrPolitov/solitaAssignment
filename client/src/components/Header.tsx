import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Header = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <header className="fixed top-0 w-full z-50">
            <nav className="bg-blue-500 py-4 container mx-auto flex justify-between items-center px-3">
                <div className="text-white font-medium"><Link to="/" className="block py-2">HSL bike city explorer</Link></div>
                <div className="md:hidden sm:block">
                    <button
                    className="text-white"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                    <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="menu w-6 h-6"
                    >
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    </button>
                </div>
                <div className={`md:block sm:hidden ${isCollapsed ? "hidden" : ""}`}>
                    <div className={`fixed top-0 left-0 right-0 bottom-0 bg-blue-500 text-white text-lg p-6`}>
                        <div className='h-4 w-4 ml-auto flex'>
                            <button
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="h-full w-full"
                            >
                                <svg viewBox="0 0 20 20" fill="white">
                                <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                                </svg>
                            </button> 
                        </div>

                        <Link to="/journeys" className="block py-2">Home</Link>
                        <Link to="/stations" className="block py-2">Stations</Link>
                        <Link to="/add" className="block py-2">Add</Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
