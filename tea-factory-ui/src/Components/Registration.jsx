import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Authcontext/Authcontext'; // Adjust path if needed

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [registerAsEmployee, setRegisterAsEmployee] = useState(false); // New state
    const navigate = useNavigate();
    const { token } = useAuth(); // Get the authentication token

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
        };

        const body = {
            email,
            password,
        };

        // Include admin token if registering as employee
        if (registerAsEmployee && token) {
            headers['Authorization'] = `Bearer ${token}`;
            body['registerAsEmployee'] = true; // Optional: Explicit flag
        } else if (registerAsEmployee && !token) {
            setError('Admin token not available. Please log in as admin.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-xs">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Register</h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
                        {error}
                    </div>
                )}

                <form className="bg-white shadow-sm rounded px-4 py-6" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                   
                   
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-green-500"
                                checked={registerAsEmployee}
                                onChange={() => setRegisterAsEmployee(!registerAsEmployee)}
                            />
                            <span className="ml-2 text-gray-700 text-sm">Register as Employee (Admin Only)</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 mb-4"
                    >
                        Register
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;