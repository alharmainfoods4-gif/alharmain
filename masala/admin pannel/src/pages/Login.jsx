import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.status === 'success' || data.success) {
                const user = data.data?.user || data.user;
                // Check if user is admin
                if (user.role !== 'admin') {
                    setError('Access denied. Admin privileges required.');
                    return;
                }
                login(user, data.token);
                navigate('/');
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('Server connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 mb-4 shadow-lg shadow-blue-900/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h1>
                    <p className="text-gray-400 mt-2 font-medium">Please sign in to access your dashboard</p>
                </div>

                <div className="bg-[#141414]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 bg-[#1a1a1a] border border-white/5 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pl-12 pr-12 bg-[#1a1a1a] border border-white/5 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative w-5 h-5 flex items-center justify-center">
                                    <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
                                    <div className="w-5 h-5 border-2 border-white/10 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-400 font-medium group-hover:text-gray-300">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-gray-500">
                    &copy; 2026 Al-Harmain Food Industries. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
