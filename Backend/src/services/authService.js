import bcrypt from "bcrypt";

import {
    findUserByEmail,
    createUser
} from "../repositories/authRepository.js";

import { generateToken } from "../utils/generateToken.js";

import AppError from "../utils/AppError.js";


// =====================================
// Normal Login
// =====================================

export const loginUser = async (
    email,
    password
) => {

    if (!email || !password) {

        throw new AppError(
            "Email and password are required",
            400
        );

    }


    const normalizedEmail =
        email.toLowerCase().trim();


    const user =
        await findUserByEmail(
            normalizedEmail
        );


    // User does not exist
    if (!user) {

        throw new AppError(
            "Invalid email or password",
            401
        );

    }


    // Google-only account
    if (!user.password_hash) {

        throw new AppError(
            "This account uses Google login. Please continue with Google.",
            400
        );

    }


    const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password_hash
        );


    if (!isPasswordValid) {

        throw new AppError(
            "Invalid email or password",
            401
        );

    }


    const token =
        generateToken(user);


    return {

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        },

        token

    };

};



// =====================================
// Normal Register
// =====================================

export const registerUser = async (
    name,
    email,
    password
) => {

    if (!name || !email || !password) {

        throw new AppError(
            "Name, email and password are required",
            400
        );

    }


    const normalizedEmail =
        email.toLowerCase().trim();


    const existingUser =
        await findUserByEmail(
            normalizedEmail
        );


    if (existingUser) {

        throw new AppError(
            "Email is already registered",
            409
        );

    }


    const passwordHash =
        await bcrypt.hash(
            password,
            12
        );


    const user =
        await createUser(
            name.trim(),
            normalizedEmail,
            passwordHash
        );


    const token =
        generateToken(user);


    return {

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        },

        token

    };

};