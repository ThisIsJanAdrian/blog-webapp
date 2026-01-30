import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { supabase } from './services/supabaseClient';
import { authSlice } from './app/authSlice';
import AppRoutes from './AppRoutes';

export default function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

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
        return <p>Loading...</p>;
    }
    return <AppRoutes />;
}