import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('')
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const isValidUsername = (username: string) =>
        /^[a-z0-9_]+$/.test(username)

    const isAvailableUsername = async (username: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .maybeSingle()
        
        return !data;
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const available = await isAvailableUsername(username);

        if (!isValidUsername(username)) {
            setUsernameError('Username can only contain lowercase letters, numbers, and underscores.')
            return
        }

        if (!available) {
            setUsernameError('Username is already taken.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setUsernameError('');

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
            }

            else if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ username })
                    .eq('id', data.user.id);

                if (profileError) {
                    setError(profileError.message);
                }

                else {
                    navigate('/login');
                }

                setLoading(false);
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
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    required
                />
                {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
                <br />
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
                <button type='submit' disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
            </form>
        </div>
    );
}