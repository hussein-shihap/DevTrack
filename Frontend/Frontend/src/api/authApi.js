
import apiClient from "./apiClient.js";


// =====================================
// Login
// =====================================

export const loginUser = async (
    email,
    password
) => {

    return await apiClient.post(
        "/auth/login",
        {
            email,
            password
        }
    );

};


// =====================================
// Register
// =====================================

export const registerUser = async (
    name,
    email,
    password
) => {

    return await apiClient.post(
        "/auth/register",
        {
            name,
            email,
            password
        }
    );

};

