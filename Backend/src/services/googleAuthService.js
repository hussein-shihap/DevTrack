import { OAuth2Client } from "google-auth-library";

import {
    findUserByEmail,
    findUserByGoogleId,
    createGoogleUser,
    linkGoogleAccount
} from "../repositories/authRepository.js";

import { generateToken } from "../utils/generateToken.js";

import AppError from "../utils/AppError.js";


// =====================================
// Google OAuth Client
// =====================================

const oauth2Client =
    new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );


// =====================================
// Generate Google Authorization URL
// =====================================

export const getGoogleAuthUrl = () => {

    return oauth2Client.generateAuthUrl({

        access_type: "offline",

        prompt: "select_account",

        scope: [
            "openid",
            "email",
            "profile"
        ]

    });

};


// =====================================
// Get Google User
// =====================================

const getGoogleUser = async (code) => {

    if (!code) {

        throw new AppError(
            "Google authorization code is missing",
            400
        );

    }


    // =================================
    // Exchange code for Google tokens
    // =================================

    const { tokens } =
        await oauth2Client.getToken(code);


    if (!tokens?.id_token) {

        throw new AppError(
            "Google ID token was not returned",
            401
        );

    }


    // =================================
    // Verify Google ID token
    // =================================

    const ticket =
        await oauth2Client.verifyIdToken({

            idToken:
                tokens.id_token,

            audience:
                process.env.GOOGLE_CLIENT_ID

        });


    const payload =
        ticket.getPayload();


    if (!payload) {

        throw new AppError(
            "Unable to read Google account information",
            401
        );

    }


    if (!payload.sub) {

        throw new AppError(
            "Google account ID is missing",
            401
        );

    }


    if (!payload.email) {

        throw new AppError(
            "Google account email is missing",
            401
        );

    }


    if (!payload.email_verified) {

        throw new AppError(
            "Google email is not verified",
            401
        );

    }


    return {

        google_id:
            payload.sub,

        email:
            payload.email.toLowerCase().trim(),

        email_verified:
            payload.email_verified,

        name:
            payload.name ||
            payload.email.split("@")[0]

    };

};


// =====================================
// Login / Register With Google
// =====================================
export const loginWithGoogle = async (
    code
) => {

    const googleUser =
        await getGoogleUser(code);


    // =================================
    // 1. Find by Google ID
    // =================================

    let user =
        await findUserByGoogleId(
            googleUser.google_id
        );


    // Google account already connected
    if (user) {

        return {

            token:
                generateToken(user)

        };

    }


    // =================================
    // 2. Find by Email
    // =================================

    user =
        await findUserByEmail(
            googleUser.email
        );


    // =================================
    // Existing DevTrack account
    // =================================

    if (user) {

        // Already connected to another Google account
        if (
            user.google_id &&
            String(user.google_id) !==
            String(googleUser.google_id)
        ) {

            throw new AppError(
                "This email is already linked to another Google account",
                409
            );

        }


        // Normal account without Google
        if (!user.google_id) {

            user =
                await linkGoogleAccount(
                    user.id,
                    googleUser.google_id
                );

        }


        // Login existing account
        return {

            token:
                generateToken(user)

        };

    }


    // =================================
    // 3. Create New Google Account
    // =================================

    user =
        await createGoogleUser({

            name:
                googleUser.name,

            email:
                googleUser.email,

            googleId:
                googleUser.google_id

        });


    if (!user) {

        throw new AppError(
            "Unable to create DevTrack account",
            500
        );

    }


    return {

        token:
            generateToken(user)

    };

};