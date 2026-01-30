import React from 'react';
import logo from '../assets/babblr.svg';

export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#F9F9F9',
    }}>
      <img src={logo} alt="Loading..." style={{ width: 150, height: 150 }} />
    </div>
  );
}