import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/timeTrack/context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si pasamos roles permitidos, verificamos si el usuario tiene uno de ellos
    // Incluimos "DEMO" para que el reclutador vea lo mismo que un ADMIN
    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};