// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (token, id, role) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUserId(id);
        setUserRole(role);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUserId(null);
        setUserRole(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ 
            token, 
            userId, 
            userRole, 
            isAuthenticated, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);