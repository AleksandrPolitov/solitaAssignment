import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Header from './Header';

import { usePagination } from '../hooks/usePagination';

import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    useNavigate
} from "react-router-dom";
import { useLimit } from '../hooks/useLimit';

interface IObjectKeys {
    [key: string]: string | number | Date;
}

interface JourneyInfo extends IObjectKeys {
    _id: string;
    departureDate: Date;
    returnDate: Date;
    departureStationId: number;
    departureStationName: string;
    returnStationId: number;
    returnStationName: string;
    distance: number;
    duration: number;
}

interface Column {
    key: keyof JourneyInfo;
    label: string;
}


const Journeys = () => {
    const navigate = useNavigate();

    const [journeys, setJourneys] = useState<JourneyInfo[] | null>([]);
    
    const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [limit, setLimit] = useState<number>(50);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean>(true);


    const { currentPage, handlePrevClick, handleNextClick } = usePagination({
        totalPages: 10,
        onPageChange: (page) => {
            setPage(page)
        },
    });


    const options = [25, 50, 75, 100];
    const { selectedValue, handleChange } = useLimit({
        options: options,
        onChange: (value) => {
            setLimit(value)
        },
    });

    // const []

    const columns: Column[] = [
        { key: 'departureDate', label: 'Departure date' },
        { key: 'returnDate', label: 'Return date' },
        { key: 'departureStationName', label: 'From' },
        { key: 'departureStationName', label: 'To' },
        { key: 'distance', label: 'Distance(m)' },
        { key: 'duration', label: 'Duration(s)' },
        
        
    ];

    useEffect(() => {
        console.log(sortAsc)
        setLoading(true);
        axios.get(`http://localhost:8080/journeys?${page&&`page=${page}&`}${limit&&`limit=${limit}&`}${sortBy&&`sortBy=${sortBy}&`}${sortAsc&&`sortAsc=${sortAsc}`}`)
        .then((res) => {
            console.log(res.data)
            const newData: JourneyInfo[] = res.data.docs.map((j: any) => {
                return {
                    ...j,
                    departureDate: new Date(j.departureDate),
                    returnDate: new Date(j.returnDate)
                };
            });

            setLoading(false);

            setTotalPages(res.data.totalPages);
                // console.log(Object.keys(journeys[0]).filter((c) => c in Object.keys(journeys[0])))
            return setJourneys(newData);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [page, limit, sortBy, sortAsc]);

    const handleSort = (column: string) => {
        if (journeys !== null) {
            if (sortBy === column) {
                setSortAsc(!sortAsc);
                //journeys.reverse();
            } else {
                setSortAsc(true)
                //journeys.sort((a: JourneyInfo, b: JourneyInfo) => a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0);
                setSortBy(column);
            }
        }
    };

    const goRouteId = (id: string) => {
        navigate(`/journeys/${id}`);
    }  

    function formatDate(date: Date): string {
        return ("0" + date.getDate()).slice(-2) + "/" +
        ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
        date.getFullYear() + " " +
        ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2)
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <Header />
            
            {loading ?
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center font-bold text-4xl text-black">Loading...</div>
                    <div className="w-6 h-6 mx-auto text-blue-500 spinner"></div>
                </div>  :
                <>
                    <div className='text-center font-bold text-xl pt-6 pb-6 mt-16'>
                        Journeys
                    </div>
                    <div className='w-screen overflow-x-auto '>
                        <table className="table-auto md:max-w-2xl text-left mx-auto my-auto text-xl rounded-full border border-gray-300">
                            <thead>
                            <tr className="bg-gray-200">
                                {columns.map((column) => (

                                    <th
                                    key={column.key}
                                    onClick={() => {handleSort(column.key.toString())}}
                                    className="px-4 py-2 cursor-pointer"
                                >
                                    {column.label}
                                    {sortBy === column.key ? ( sortAsc ? ' 🔺' : ' 🔻') : ''}
                                </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                                {journeys && journeys.map((row, index) => (
                                <tr key={row._id} className="hover:bg-gray-200" onClick={() => goRouteId(row._id.toString())}>
                                    <td className="px-4 py-2">{formatDate(row.departureDate)}</td>
                                    <td className="px-4 py-2">{formatDate(row.returnDate)}</td>
                                    <td className="px-4 py-2 text-teal-700 z-100"><Link to={`/stations/${row.departureStationId}`}>{row.departureStationName}</Link></td>
                                    <td className="px-4 py-2 text-teal-700"><Link to={`/stations/${row.returnStationId}`}>{row.returnStationName}</Link></td>
                                    <td className="px-4 py-2">{row.distance}</td>
                                    <td className="px-4 py-2">{row.duration}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='content-center'>
                        
                        <select
                            className="block appearance-none mx-auto my-2 bg-white border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded-l"
                            value={selectedValue}
                            onChange={handleChange}
                            >
                            {options.map((option) => (
                                <option key={option} value={option}>
                                {option}
                                </option>
                            ))}
                        </select>

                        <div>
                            <button
                                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-l"
                                onClick={handlePrevClick}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            <span className="text-gray-800 font-medium py-2 px-4">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-r"
                            onClick={handleNextClick}
                            disabled={currentPage === totalPages}
                            >
                            Next
                            </button>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default Journeys;