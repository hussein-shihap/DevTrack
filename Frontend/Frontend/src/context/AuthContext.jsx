
import {
    createContext,
    useContext,
    useState
} from "react";



// Auth Context


const AuthContext =
    createContext(null);



// Auth Provider


export const AuthProvider = ({
    children
}) => {


    
    // JWT Token
    

    const [token, setToken] =
        useState(() => {

            try {

                return localStorage.getItem(
                    "devtrack_token"
                );

            } catch (error) {

                console.error(
                    "Cannot access DevTrack token storage",
                    error
                );

                return null;

            }

        });


    
    // Login
    

    const login = (
        authToken
    ) => {

        // =================================
        // Validate Token
        // =================================

        if (!authToken) {

            console.error(
                "Login failed: authentication token is missing"
            );

            return false;

        }


        // =================================
        // Update React State
        // =================================

        setToken(authToken);


        // =================================
        // Save Token
        // =================================

        try {

            localStorage.setItem(
                "devtrack_token",
                authToken
            );

        } catch (error) {

            console.error(
                "Failed to save authentication token",
                error
            );

            return false;

        }


        return true;

    };


    
    // Logout
    

    const logout = () => {

        setToken(null);


        try {

            localStorage.removeItem(
                "devtrack_token"
            );

        } catch (error) {

            console.error(
                "Failed to remove authentication token",
                error
            );

        }

    };


    
    // Authentication Status
    

    const isAuthenticated =
        Boolean(token);


    
    // Provider
    

    return (

        <AuthContext.Provider
            value={{

                token,

                login,

                logout,

                isAuthenticated

            }}
        >

            {children}

        </AuthContext.Provider>

    );

};



// useAuth Hook


export const useAuth = () => {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;

};

