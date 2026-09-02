import {
    getGoogleAuthUrl,
    loginWithGoogle
} from "../services/googleAuthService.js";

import asyncHandler from "../middleware/asyncHandler.js";

import AppError from "../utils/AppError.js";


// =====================================
// Google Login
// =====================================

export const googleLogin = (req, res) => {

    const googleAuthUrl =
        getGoogleAuthUrl();

    return res.redirect(
        googleAuthUrl
    );

};


// =====================================
// Google Callback
// =====================================

export const googleCallback = asyncHandler(
    async (req, res) => {

        const { code } = req.query;


        // =================================
        // Validate Google callback
        // =================================

        if (!code) {

            throw new AppError(
                "Google authorization code is missing",
                400
            );

        }


        // =================================
        // Login / Register with Google
        // =================================

        const result =
            await loginWithGoogle(code);


        if (!result?.token) {

            throw new AppError(
                "Google authentication token was not generated",
                500
            );

        }


        // =================================
        // Send token to frontend
        // =================================

        return res.redirect(
            `http://localhost:5173/auth/google/callback?token=${encodeURIComponent(
                result.token
            )}`
        );

    }
);