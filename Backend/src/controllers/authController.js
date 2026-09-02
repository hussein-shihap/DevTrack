import {
    loginUser,
    registerUser
} from "../services/authService.js";

import asyncHandler from "../middleware/asyncHandler.js";


// =====================================
// Login
// =====================================

export const login = asyncHandler(
    async (req, res) => {

        const {
            email,
            password
        } = req.body;


        const result =
            await loginUser(
                email,
                password
            );


        return res.status(200).json({

            success: true,

            message: "Login successful",

            data: result

        });

    }
);


// =====================================
// Register
// =====================================

export const register = asyncHandler(
    async (req, res) => {

        const {
            name,
            email,
            password
        } = req.body;


        const result =
            await registerUser(
                name,
                email,
                password
            );


        return res.status(201).json({

            success: true,

            message: "Registration successful",

            data: result

        });

    }
);