import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const register = async (name, email, password, role = 'USER') => {
        const response = await api.post('/auth/register', { name, email, password, role });
        const { user, token } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
