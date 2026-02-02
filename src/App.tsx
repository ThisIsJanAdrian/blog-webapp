import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './app/store';
import { supabase } from './services/supabaseClient';
import { authSlice } from './app/authSlice';

import AppRoutes from './AppRoutes';

import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';

export default function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const user = useSelector((state: RootState) => state.auth.user)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                dispatch(authSlice.actions.login({ email: user.email! }));
            }
            else {
                dispatch(authSlice.actions.logout());
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }
    
    return (
        <>
            <Header />
                {loading && <LoadingScreen />}
            <AppRoutes />
        </>
    )
    }