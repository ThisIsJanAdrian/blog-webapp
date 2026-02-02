import { useDispatch } from 'react-redux';
import { authSlice } from '../app/authSlice';
import { supabase } from '../services/supabaseClient';
import logo_dark from '../assets/babblr_dark.svg';

export default function Header() {
    const dispatch = useDispatch()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        dispatch(authSlice.actions.logout())
        window.location.href = '/login'
    }

    return (
        <header className="header">
            <div className="header-inner">
                <img
                src={logo_dark}
                alt="Babblr Logo"
                className="logo"
                onClick={() => window.location.reload()}
                />
            </div>
        </header>
    )
}
