import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import SideBar from './SideBar.jsx';

const Landing = (props) => {
  return (
    <div className="landing">
      <SideBar />
      <div>Some Content</div>
    </div>
  )
}

export default Landing;