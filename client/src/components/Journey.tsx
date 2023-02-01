import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Header from './Header';

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

interface IObjectKeys {
    [key: string]: string | number | Date | object;
}

interface IStation {
    _id: Number,
    nimi: String,
    namn: String,
    name: String,
    osoite: String,
    adress: String,
    kaupunki: String,
    stad: String,
    operaattor: String,
    kapasiteet: Number,
    xPos: Number,
    yPos: Number
}

interface JourneyMoreInfo extends IObjectKeys {
    journey: {
        _id: string;
        departureDate: Date;
        returnDate: Date;
        departureStationId: number;
        returnStationId: number;
        distance: number;
        duration: number;
    },
    stations: {
        departure: IStation,
        return: IStation
    }

}


const Journey = () => {
    let params = useParams();

    const [journey, setJourney] = useState<JourneyMoreInfo | null>(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/journeys/${params._id}`)
            .then((res) => {
                setJourney({
                    ...res.data,
                    journey: {
                        ...res.data.journey,
                        departureDate: new Date(res.data.journey.departureDate),
                        returnDate: new Date(res.data.journey.returnDate),
                        duration: parseInt(res.data.journey.duration),
                        distance: parseInt(res.data.journey.distance),
                    }
                })
                console.log(journey)
        })
        .catch((error) => {
            console.error(error);
        });
    }, [params._id]);

    return (
        <div className='justify-center'>
            <Header />

            <div className='text-center font-bold text-xl pt-6 pb-6 mt-16'>
                Journey #{journey?.journey._id}
            </div>

            <div className='container mx-auto'>
                <div className="flex flex-col md:flex-row rounded-lg border border-gray-300 text-center h-auto ">
                    <div className="md:w-5/12 sm:w-full hover:bg-gray-100  border-gray-300 align-middle flex flex-col justify-center cursor-pointer py-6">
                        <Link to={`/stations/${journey?.stations.departure._id}`} className="h-full align-middle flex flex-col justify-center cursor-pointer">
                            <div className='font-semibold text-lg'>
                                From
                            </div>
                            <div className='text-2xl font-bold my-2'>
                                {journey?.stations.departure.name}
                            </div>
                            <div className='text-lg'> 
                                {journey?.journey.departureDate &&
                                    ("0" + journey?.journey.departureDate.getDate()).slice(-2) + "/" +
                                    ("0" + (journey?.journey.departureDate.getMonth() + 1)).slice(-2) + "/" +
                                    journey?.journey.departureDate.getFullYear() + " " +
                                    ("0" + journey?.journey.departureDate.getHours()).slice(-2) + ":" +
                                    ("0" + journey?.journey.departureDate.getMinutes()).slice(-2)}
                            </div>
                        </Link>
                    </div>
                    <div className="md:w-2/12 p-4 sm:w-full h-full mx-auto my-auto text-sm font-medium align-middle flex flex-col justify-center">
                        <div className='h-full align-middle flex flex-col justify-center'>

                        <div>Distance: {journey && journey.journey.distance} m</div>
                        <div>Duration: {journey ? (
                            (journey.journey.duration > 3600 ? Math.floor(journey.journey.duration / 3600).toString().padStart(2, '0') + ":" : "").toString() +
                            (journey.journey.duration > 60 ? Math.floor(journey.journey.duration % 3600 / 60).toString().padStart(2, '0') + ":" : "").toString() +
                            (Math.floor(journey.journey.duration % 60).toString().padStart(2, '0').toString().padStart(2, '0'))
                        ) : ""}
                        </div>
                        </div>
                    </div>
                    <div className="md:w-5/12 sm:w-full hover:bg-gray-100  border-gray-300 py-6">
                        <Link to={`/stations/${journey?.stations.return._id}`} className="h-full align-middle flex flex-col justify-center cursor-pointer">
                            <div className='font-semibold text-lg'>
                                To
                            </div>
                            <div className='text-2xl font-bold my-2'>
                                {journey?.stations.return.name}
                            </div>
                            <div className='text-lg'>
                                {journey?.journey.departureDate &&
                                    ("0" + journey?.journey.departureDate.getDate()).slice(-2) + "/" +
                                    ("0" + (journey?.journey.departureDate.getMonth() + 1)).slice(-2) + "/" +
                                    journey?.journey.departureDate.getFullYear() + " " +
                                    ("0" + journey?.journey.departureDate.getHours()).slice(-2) + ":" +
                                    ("0" + journey?.journey.departureDate.getMinutes()).slice(-2)}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Journey;