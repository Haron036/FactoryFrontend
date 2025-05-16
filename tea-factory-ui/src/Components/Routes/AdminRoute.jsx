import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Authcontext/Authcontext";


const AdminRoute = () => {
    const { isAuthenticated, userRole } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userRole !== "Admin") {
        // Redirect to a "not authorized" page or the homepage with a message
        return <Navigate to="/unauthorized" state={{ message: "Admin privileges required." }} replace />;
    }

    // If authenticated and is an admin, render the child routes
    return <Outlet />;
};

export default AdminRoute;