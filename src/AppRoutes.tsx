import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './app/store';

import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import BlogFeed from './pages/BlogFeed';
import BlogCreate from './pages/BlogCreate';
import BlogUpdate from './pages/BlogUpdate';
import BlogDelete from './pages/BlogDelete';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
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
                path='/create'
                element={
                    <ProtectedRoute>
                        <BlogCreate />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/blogs/:id/edit'
                element={
                    <ProtectedRoute>
                        <BlogUpdate />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/blogs/:id/delete'
                element={
                    <ProtectedRoute>
                        <BlogDelete />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/"
                element={
                    user
                    ? <Navigate to='/feed' />
                    : <Navigate to='/login' />
                }
            />
        </Routes>
    );
}