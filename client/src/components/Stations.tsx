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

interface StationInfo extends IObjectKeys {
    _id: number;
    nimi: string;
    osoite: string;
    kaupunki: string;
    operaattor: string;
    kapasiteet: number;
    xPos: number;
    yPos: number;
}

interface Column {
    key: keyof StationInfo;
    label: string;
}


const Stations = () => {
    const navigate = useNavigate();

    const [stations, setStations] = useState<StationInfo[] | null>([]);
    
    const [page, setPage] = useState<number>(1);
    const [sortBy, setSortBy] = useState<string | null>('_id');
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    // const []

    const columns: Column[] = [
        { key: '_id', label: 'Id' },
        { key: 'nimi', label: 'Name' },
        { key: 'osoite', label: 'Address' },
        { key: 'kaupunki', label: 'City' },
        { key: 'operaattor', label: 'Operator' },
        { key: 'kapasiteet', label: 'Capacity' },
        
        
    ];

    useEffect(() => {
        console.log(sortAsc)
        axios.get(`http://localhost:8080/stations?${page&&`page=${page}&`}${`limit=${50}&`}${sortBy&&`sortBy=${sortBy}&`}${sortAsc&&`sortAsc=${sortAsc}`}`)
            .then((res) => {
            console.log(res.data)
            const newData: StationInfo[] = res.data.docs.map((s: StationInfo) => {
                return {
                    ...s
                };
            });
            return setStations(newData);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [page, sortBy, sortAsc]);

    const handleSort = (column: string) => {
        if (stations !== null) {
            if (sortBy === column) {
                setSortAsc(!sortAsc);
            } else {
                setSortAsc(true)
                setSortBy(column);
            }
        }
    };

    const goRouteId = (id: string) => {
        navigate(`/stations/${id}`);
    }  


    return (
        <div className='justify-center'>
            <Header />
            <div className='text-center font-bold text-xl pt-6 pb-6 mt-16'>
                Stations
            </div>
            
            <div className='w-screen overflow-x-auto '>
            <table className="table-auto md:max-w-2xl text-left mx-auto my-auto text-xl rounded-full border border-gray-300">
                    <thead>
                    <tr className="bg-gray-200">
                        {columns.map((column) => (
                        <th
                            key={column.key}
                                onClick={() => {
                                    setPage(1);
                                    handleSort(column.key.toString())
                                }}
                            className="px-4 py-2 cursor-pointer"
                            >
                            {column.label}
                            {sortBy === column.key ? ( sortAsc ? ' 🔺' : ' 🔻') : ''}
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {stations && stations.map((row, index) => (
                        <tr key={row._id} className="hover:bg-gray-200" onClick={() => goRouteId(row._id.toString())}>
                            <td className="px-4 py-2">{row._id}</td>
                            <td className="px-4 py-2">{row.nimi}</td>
                            <td className="px-4 py-2">{row.osoite}</td>
                            <td className="px-4 py-2">{row.kaupunki!="" ? row.kaupunki : "Helsinki"}</td>
                            <td className="px-4 py-2">{row.operaattor}</td>
                            <td className="px-4 py-2">{row.kapasiteet}</td>
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

export default Stations;