import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { TOKEN_KEY, USER_KEY } from '../config/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        // Check if user is already logged in
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            console.log('AuthContext: User restored from storage:', currentUser);
            setUser(currentUser);
        } else {
            console.log('AuthContext: No user in storage');
        }
        setLoading(false);
        console.log('AuthProvider initialized, loading:', false);
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        // Automatically login after register if backend returns token
        if (data.token) {
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            setUser(data.user);
        }
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    const value = {
        user,
        loading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
