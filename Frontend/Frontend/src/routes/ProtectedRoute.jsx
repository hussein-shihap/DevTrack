
import {
    Navigate,
    Outlet
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";


// =====================================
// Protected Route
// =====================================

function ProtectedRoute() {

    const {
        isAuthenticated
    } = useAuth();


    // =====================================
    // Not Authenticated
    // =====================================

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // =====================================
    // Authenticated
    // =====================================

    return <Outlet />;

}


export default ProtectedRoute;

