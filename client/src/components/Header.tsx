import React, {useState} from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
        <nav className="flex flex-wrap items-center justify-between px-2 py-3 bg-blue-500 mb-3 fixed top-0 w-full z-50">
            <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                <Link to="/" className="text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white">HSL bike city explorer</Link>
                <button
                    className="text-white cursor-pointer text-2xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                    type="button"
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
                <div
                className={
                    "lg:flex flex-grow items-center" +
                    (isCollapsed ? " flex" : " hidden")
                }
                id="example-navbar-danger"
                >
                <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                    <li className="nav-item">
                        <Link to="/journeys" className="pl-2 py-2 flex items-center text-lg uppercase font-bold leading-snug text-white hover:opacity-75">Journeys</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/stations" className="pl-2 py-2 flex items-center text-lg uppercase font-bold leading-snug text-white hover:opacity-75">Stations</Link>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
        </>
    );
};

export default Header;
