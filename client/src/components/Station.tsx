import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Header from './Header';


import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    useNavigate,
    useParams
} from "react-router-dom";
import { MapContainer, TileLayer, useMap, Popup, Marker, ZoomControl } from 'react-leaflet';
import L from "leaflet";


interface IObjectKeys {
    [key: string]: string | number | Date | object;
}

const customMarker = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40]
});


interface JourneyInfo extends IObjectKeys {
    _id: string,
    departureDate: Date,
    returnDate: Date,
    departureStationId: number,
    returnStationId: number,
    distance: number,
    duration: number
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


interface StationMoreInfo extends IObjectKeys {
    station: StationInfo,
    departures: JourneyInfo[],
    returns: JourneyInfo[]
}

interface Column {
    key: keyof JourneyInfo;
    label: string;
}

const InfoCard = (props: {header: string, data: string}) => {
    return (
      <div className="bg-gray-100 rounded-lg p-4 col-span-1">
        <div className="font-medium text-lg mb-2">{props.header}</div>
        <div className="text-gray-600">{props.data}</div>
      </div>
    );
};


const Station = () => {
    const navigate = useNavigate();
    let params = useParams();

    const [stationInfo, setStationInfo] = useState<StationMoreInfo | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    
    useEffect(() => {
        axios.get(`http://localhost:8080/stations/${params._id}`)
            .then((res) => {
                console.log(res.data)
                setStationInfo({
                    ...res.data,
                    station: {
                        ...res.data.station,
                        departureDate: new Date(res.data.station.departureDate),
                        returnDate: new Date(res.data.station.returnDate),
                        duration: parseInt(res.data.station.duration),
                        distance: parseInt(res.data.station.distance),
                    }
                })
                console.log(stationInfo)
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        if (stationInfo && !mapLoaded) {
          setMapLoaded(true);
          // Initialize map here, using the data from the API response
        }
    }, [stationInfo, mapLoaded]);


    const goRouteId = (id: string) => {
        navigate(`/journeys/${id}`);
    }  


    
    const columnsDeparture: Column[] = [
        { key: 'departureDate', label: 'Departure date' },
        { key: 'returnStationId', label: 'Return station' },
        { key: 'distance', label: 'Distance(m)' },
        { key: 'duration', label: 'Duration(s)' }
    ];

    const columnsReturn: Column[] = [
        { key: 'returnDate', label: 'Return date' },
        { key: 'departureStationId', label: 'Departure station' },
        { key: 'distance', label: 'Distance(m)' },
        { key: 'duration', label: 'Duration(s)' },
    ];


    function formatDate(date: Date): string {
        date = new Date(date)
        return ("0" + date.getDate()).slice(-2) + "/" +
        ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
        date.getFullYear() + " " +
        ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2)
    }


    return (
        <div className='justify-center'>
            <Header />

            <div className='text-center font-bold text-xl pt-6 pb-6 mt-16'>
                Station {stationInfo?.station.nimi}
            </div>

                {mapLoaded && stationInfo && (
            <div className='container mx-auto '>
                <div className="flex flex-col md:flex-row rounded-lg border border-gray-300 text-center">
                        <MapContainer
                            center={[stationInfo.station.yPos, stationInfo.station.xPos]}
                            zoom={16}
                            scrollWheelZoom={true}
                            style={{ width: "100%", height: "400px" }}
                            className="w-full z-0"
                        >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[stationInfo.station.yPos, stationInfo.station.xPos]} icon={customMarker}>
                            <Popup>{stationInfo.station.nimi}</Popup>
                        </Marker>
                        {/* Add markers or other elements to the map using the data from the API response */}
                        </MapContainer>

                </div>
                <div className={`grid sm:grid-cols-1 gap-4 md:grid-cols-${stationInfo.station.operaattor != " " ? 4 : 3} my-4`}>
                    <div className="grid-col-1"><InfoCard header='Address' data={stationInfo.station.osoite} /></div>
                    <div className="grid-col-1"><InfoCard header='City' data={stationInfo.station.kaupunki!=" " ? stationInfo.station.kaupunki : "Helsinki"} /></div>
                    <div className="grid-col-1"><InfoCard header='Capacity' data={stationInfo.station.kapasiteet.toString()} /></div>
                    {stationInfo.station.operaattor != " " &&
                        (<div className="grid-col-1"><InfoCard header='Operator' data={stationInfo.station.operaattor} /></div>)}

                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 text-center">
                    <div>
                        <p className='text-xl font-bold my-3'>Last 50 departures from {stationInfo.station.nimi}</p>
                        <div className='w-full overflow-x-auto flex justify-center'>
                            <table className="table-auto text-left mx-auto my-auto text-xl rounded-full border border-gray-300 mr-0 md:m-0">
                                <thead>
                                <tr className="bg-gray-200">
                                    {columnsDeparture.map((column) => (

                                        <th
                                        key={column.key}
                                        className="px-4 py-2 cursor-pointer"
                                    >
                                        {column.label}
                                    </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                    {stationInfo?.departures && stationInfo.departures.map((row, index) => (
                                        <tr key={row._id} className="hover:bg-gray-200" onClick={() => goRouteId(row._id.toString())}>
                                            <td className="px-4 py-2">{formatDate(row.departureDate)}</td>
                                            <td className="px-4 py-2">{row.returnStationId}</td>
                                            <td className="px-4 py-2">{row.distance}</td>
                                            <td className="px-4 py-2">{row.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <p className='text-xl font-bold my-3'>Last 50 returns to {stationInfo.station.nimi}</p>
                        <div className='w-full overflow-x-auto flex justify-center'>
                            <table className="table-auto text-left mx-auto my-auto text-xl rounded-full border border-gray-300 mr-0 md:m-0">
                                <thead>
                                <tr className="bg-gray-200">
                                    {columnsReturn.map((column) => (

                                        <th
                                        key={column.key}
                                        className="px-4 py-2 cursor-pointer"
                                    >
                                        {column.label}
                                    </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                    {stationInfo?.returns && stationInfo.returns.map((row, index) => (
                                        <tr key={row._id} className="hover:bg-gray-200" onClick={() => goRouteId(row._id.toString())}>
                                            <td className="px-4 py-2">{formatDate(row.returnDate)}</td>
                                            <td className="px-4 py-2">{row.departureStationId}</td>
                                            <td className="px-4 py-2">{row.distance}</td>
                                            <td className="px-4 py-2">{row.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default Station;