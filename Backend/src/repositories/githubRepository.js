import db from "../config/db.js";




export const findGithubAccountByGithubId = async (
    githubId
) => {

    const result =
        await db.query(
            `
            SELECT
                id,
                user_id,
                github_id,
                github_username,
                access_token,
                created_at
            FROM github_accounts
            WHERE github_id = $1
            LIMIT 1
            `,
            [githubId]
        );


    return result.rows[0] || null;
};





export const findGithubAccountByUserId = async (
    userId
) => {

    const result =
        await db.query(
            `
            SELECT
                id,
                user_id,
                github_id,
                github_username,
                access_token,
                created_at
            FROM github_accounts
            WHERE user_id = $1
            LIMIT 1
            `,
            [userId]
        );


    return result.rows[0] || null;
};




export const findDevTrackUserById = async (
    userId
) => {

    const result =
        await db.query(
            `
            SELECT
                id,
                name,
                email
            FROM users
            WHERE id = $1
            LIMIT 1
            `,
            [userId]
        );


    return result.rows[0] || null;
};




export const createGithubAccount = async ({
    userId,
    githubId,
    githubUsername,
    accessToken
}) => {

    const result =
        await db.query(
            `
            INSERT INTO github_accounts (
                user_id,
                github_id,
                github_username,
                access_token
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                user_id,
                github_id,
                github_username,
                access_token,
                created_at
            `,
            [
                userId,
                githubId,
                githubUsername,
                accessToken
            ]
        );


    return result.rows[0];
};



export const updateGithubAccount = async (
    githubAccountId,
    githubUsername,
    accessToken
) => {

    const result =
        await db.query(
            `
            UPDATE github_accounts
            SET
                github_username = $1,
                access_token = $2
            WHERE id = $3
            RETURNING
                id,
                user_id,
                github_id,
                github_username,
                access_token,
                created_at
            `,
            [
                githubUsername,
                accessToken,
                githubAccountId
            ]
        );


    return result.rows[0] || null;
};



export const deleteGithubAccountByUserId = async (
    userId
) => {

    const result =
        await db.query(
            `
            DELETE FROM github_accounts
            WHERE user_id = $1
            RETURNING
                id
            `,
            [userId]
        );


    return result.rows[0] || null;
};