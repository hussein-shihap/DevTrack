
import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import ProtectedRoute
    from "./ProtectedRoute.jsx";

import MainLayout
    from "../layouts/MainLayout.jsx";

import Login
    from "../pages/Login.jsx";

import Register
    from "../pages/Register.jsx";

import Dashboard
    from "../pages/Dashboard.jsx";

import Repositories
    from "../pages/Repositories.jsx";

import Favorites
    from "../pages/Favorites.jsx";

import Activity
    from "../pages/Activity.jsx";

    import GoogleCallback from "../pages/GoogleCallback.jsx";


function AppRoutes() {

    return (

        <Routes>

          

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />


            <Route
                path="/login"
                element={
                    <Login />
                }
            />


            <Route
                path="/register"
                element={
                    <Register />
                }
            />


        

            <Route
                element={
                    <ProtectedRoute />
                }
            >

                <Route
                    element={
                        <MainLayout />
                    }
                >

                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard />
                        }
                    />


                    <Route
                        path="/repositories"
                        element={
                            <Repositories />
                        }
                    />


                    <Route
                        path="/favorites"
                        element={
                            <Favorites />
                        }
                    />


                    <Route
                        path="/activity"
                        element={
                            <Activity />
                        }
                    />

                </Route>

            </Route>


           

            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />





            <Route
    path="/auth/google/callback"
    element={<GoogleCallback />}
/>

        </Routes>

    );

}


export default AppRoutes;

