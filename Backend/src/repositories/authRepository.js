import db from "../config/db.js";




// Find User By Email


export const findUserByEmail = async (
    email
) => {

    const result =
        await db.query(
            `
            SELECT
                id,
                name,
                email,
                password_hash,
                google_id
            FROM users
            WHERE LOWER(email) = LOWER($1)
            LIMIT 1
            `,
            [email.trim()]
        );


    return result.rows[0] || null;

};




// Create Normal User


export const createUser = async (
    name,
    email,
    passwordHash
) => {

    const result =
        await db.query(
            `
            INSERT INTO users (
                name,
                email,
                password_hash
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                name,
                email,
                google_id
            `,
            [
                name,
                email,
                passwordHash
            ]
        );


    return result.rows[0];

};




// Find User By Google ID


export const findUserByGoogleId = async (
    googleId
) => {

    const result =
        await db.query(
            `
            SELECT
                id,
                name,
                email,
                password_hash,
                google_id
            FROM users
            WHERE google_id = $1
            LIMIT 1
            `,
            [googleId]
        );


    return result.rows[0] || null;

};




// Create Google User


export const createGoogleUser = async ({
    name,
    email,
    googleId
}) => {

    const result =
        await db.query(
            `
            INSERT INTO users (
                name,
                email,
                google_id
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                name,
                email,
                google_id
            `,
            [
                name,
                email,
                googleId
            ]
        );


    return result.rows[0];

};




// Link Google Account


export const linkGoogleAccount = async (
    userId,
    googleId
) => {

    const result =
        await db.query(
            `
            UPDATE users
            SET google_id = $1
            WHERE id = $2
            RETURNING
                id,
                name,
                email,
                google_id
            `,
            [
                googleId,
                userId
            ]
        );


    return result.rows[0] || null;

};