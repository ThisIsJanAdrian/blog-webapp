import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import type { RootState } from './app/store'

import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import BlogFeed from './pages/BlogFeed';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/logout' element={<Logout />} />

                <Route
                    path='/feed'
                    element={
                        <ProtectedRoute>
                            <BlogFeed />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        user
                        ? <Navigate to="/feed" />
                        : <Navigate to="/login" />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}