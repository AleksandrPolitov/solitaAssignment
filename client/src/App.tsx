import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Journeys from './components/Journeys';
import Journey from './components/Journey';
import Main from "./components/Main";

function MyMessage(props: { message: string }) {
    return <div>My message is: {props.message}</div>;
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/journeys" />} />
      <Route path='/journeys' element={<Journeys />} />
      <Route path='/journeys/:id' element={<Journey />} />
    </Routes>
  );
}

export default App;
