import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Header from './Header';
import Journeys from './Journeys';

function Main() {
  return (
      <div className='Main'>
          <Header />
          <Journeys />
    </div>
  );
}

export default Main;
