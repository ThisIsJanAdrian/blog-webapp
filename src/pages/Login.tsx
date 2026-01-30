import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authSlice } from '../app/authSlice';
import { supabase } from '../services/supabaseClient';

export default function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const resetPassword = () => setPassword('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                resetPassword();
            }
            else if (data.user) {
                dispatch(authSlice.actions.login({ email: data.user.email! }));
                console.log('Login successful for:', data.user.email);
                navigate('/feed');
            }
        }
        catch (err) {
            setError('An unexpected error occured. Please try again.');
            console.error(err);
        }
    }

    const navigate = useNavigate();

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type='submit'>Login</button>
                <br />
                <button type='button' onClick={() => navigate('/register')}>
                    Register
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}