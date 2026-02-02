import React from 'react';
import logo from '../assets/babblr.svg';

export default function LoadingScreen() {
  return (
    <div className='loading-screen'>
      <img src={logo} alt="Loading..." style={{ width: 150, height: 150 }} />
    </div>
  );
}