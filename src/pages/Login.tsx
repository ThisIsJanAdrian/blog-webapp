import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authSlice } from '../app/authSlice';
import { supabase } from '../services/supabaseClient';

export default function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (response.error) {
                setError(response.error.message);
            }
            else if (response.data.user) {
                dispatch(authSlice.actions.login({ email: response.data.user.email! }));
                console.log('Login successful for:', response.data.user.email);
            }
        }
        catch (err) {
            setError('An unexpected error occured. Please try again.');
            console.error(err);
        }
    }

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
            </form>
        </div>
    )
}