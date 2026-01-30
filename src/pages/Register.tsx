import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            }
            else if (data.user) {
                console.log('Registration successful for:', data.user.email);
                navigate('/login');
            }
        }
        catch (err) {
            setError('An unexpected error occured. Please try again.');
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type='submit'>Register</button>
            </form>
        </div>
    );
}