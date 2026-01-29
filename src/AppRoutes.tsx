import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';

export const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </BrowserRouter>
)