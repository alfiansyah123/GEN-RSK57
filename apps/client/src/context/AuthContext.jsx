import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in on mount
        const authData = localStorage.getItem('admin_auth');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                setIsAuthenticated(true);
                setUser(parsed);
            } catch (e) {
                localStorage.removeItem('admin_auth');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (password) => {
        try {
            const { data, error } = await supabase.rpc('verify_admin_password', { p_password: password });

            if (error) {
                console.error('Login RPC error:', error);
                return { success: false, error: 'Login failed' };
            }

            if (data && data.length > 0) {
                const user = data[0];
                const userData = { username: user.username, token: 'supabase-session' };
                localStorage.setItem('admin_auth', JSON.stringify(userData));
                setIsAuthenticated(true);
                setUser(userData);
                return { success: true };
            } else {
                return { success: false, error: 'Invalid password' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Connection failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
