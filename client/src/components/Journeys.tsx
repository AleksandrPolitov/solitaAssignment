import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Header from './Header';

import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    useNavigate
} from "react-router-dom";

interface IObjectKeys {
    [key: string]: string | number | Date;
}

interface JourneyInfo extends IObjectKeys {
    _id: string;
    departureDate: Date;
    returnDate: Date;
    departureStationId: number;
    returnStationId: number;
    distance: number;
    duration: number;
}

interface Column {
    key: keyof JourneyInfo;
    label: string;
}


const Table = () => {
    const navigate = useNavigate();

    const [journeys, setJourneys] = useState<JourneyInfo[] | null>([]);
    
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(50);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    // const []

    const columns: Column[] = [
        { key: 'departureDate', label: 'Departure date' },
        { key: 'returnDate', label: 'Return date' },
        { key: 'departureStationId', label: 'Departure station' },
        { key: 'returnStationId', label: 'Return station' },
        { key: 'distance', label: 'Distance(m)' },
        { key: 'duration', label: 'duration(s)' },
        
        
    ];

    useEffect(() => {
        console.log(sortAsc)
        axios.get(`http://localhost:8080/journeys?${page&&`page=${page}&`}${limit&&`limit=${limit}&`}${sortBy&&`sortBy=${sortBy}&`}${sortAsc&&`sortAsc=${sortAsc}`}`)
            .then((res) => {
            console.log(res.data)
            const newData: JourneyInfo[] = res.data.docs.map((j: any) => {
                return { ...j, departureDate: new Date(j.departureDate), returnDate: new Date(j.returnDate) };
            });


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

    return (
        <div className='justify-center'>
            <Header />
            <div className='text-center font-bold text-3xl pt-6 pb-6 mt-16'>
                Journeys
            </div>
            
            <div className='w-screen overflow-x-auto'>
                <table className="table-auto md:max-w-2xl text-left mx-auto my-auto text-xl">
                    <thead>
                    <tr className="bg-gray-200">
                        {/* {journeys && Object.keys(journeys[0]).filter((c)=>c in Object.keys(journeys[0])).map((column) => (
                        <th
                            key={column}
                            onClick={() => {handleSort(column)}}
                            className="px-4 py-2 cursor-pointer"
                        >
                            {column}
                            {sortBy === column ? ( sortAsc ? ' 🔺' : ' 🔻') : ''}
                        </th>
                        ))} */}
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
                            <tr key={index} className="hover:bg-gray-200" onClick={()=> goRouteId(row._id)}>
                                {Object.values(row).slice(1, 7).map((value, index) => (
                                    <td key={index} className="px-4 py-2">
                                        {value instanceof Date ?
                                            ("0" + value.getDate()).slice(-2) + "/" +
                                            ("0" + (value.getMonth() + 1)).slice(-2) + "/" +
                                            value.getFullYear() + " " +
                                            ("0" + value.getHours()).slice(-2) + ":" +
                                            ("0" + value.getMinutes()).slice(-2)
                                            : value.toString()}
                                    </td>
                                ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

                        
            <div className="flex flex-col items-center">
            <span className="text-sm text-gray-700 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">1</span> to <span className="font-semibold text-gray-900 dark:text-white">10</span> of <span className="font-semibold text-gray-900 dark:text-white">100</span> Entries
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>
                    Prev
                </button>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    Next
                    <svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
            </div>

        </div>
    );
};

export default Table;