import { use, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { authSlice } from '../app/authSlice';

export default function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            await supabase.auth.signOut();
            dispatch(authSlice.actions.logout());
            console.log('User logged out successfully');
            navigate('/login');
        };

        logoutUser();
    }, []);

    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
}