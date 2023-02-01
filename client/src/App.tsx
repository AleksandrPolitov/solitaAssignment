import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Journeys from './components/Journeys';
import Journey from './components/Journey';
import Main from "./components/Main";
import Stations from './components/Stations';
import Station from './components/Station';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/journeys" />} />
      <Route path='/journeys' element={<Journeys />} />
      <Route path='/journeys/:_id' element={<Journey />} />
      <Route path='/stations' element={<Stations />} />
      <Route path='/stations/:_id' element={<Station />} />
    </Routes>
  );
}

export default App;
