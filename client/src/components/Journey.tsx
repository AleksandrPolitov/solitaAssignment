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


const Journey = () => {
    const navigate = useNavigate();


    

    return (
        <div className='justify-center'>
            <Header />
        </div>
    );
};

export default Journey;