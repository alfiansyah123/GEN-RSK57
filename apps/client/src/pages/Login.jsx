import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = await login(password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {/* Background decoration removed to use global background */}

            <div className={`relative w-full max-w-md p-8 rounded-3xl transition-all duration-300 ${isDark ? 'glass-panel border-white/10' : 'bg-white/80 backdrop-blur-md border border-gray-100 shadow-2xl'}`}>
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <img
                            src="/login_logo.png"
                            alt="Logo"
                            className="w-32 h-auto object-contain drop-shadow-lg"
                        />
                    </div>
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        GEN LINK
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        CPA Link Generator Dashboard
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            Password
                        </label>
                        <div className="relative">
                            <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                lock
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all ${isDark
                                    ? 'bg-[#16172b] text-white border border-[#2d2d42] focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder-slate-600'
                                    : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder-gray-400'
                                    }`}
                                placeholder="Enter password"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">login</span>
                                Sign In
                            </>
                        )}
                    </button>
                </form>


            </div>
        </div>
    );
}
