 import { useAuth } from './Authcontext/Authcontext';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};