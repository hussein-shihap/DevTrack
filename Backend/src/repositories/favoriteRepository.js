
import db from "../config/db.js";


// =====================================
// Find Favorite Repository
// =====================================

export const findFavoriteRepository = async (
    userId,
    githubRepositoryId
) => {

    const result =
        await db.query(
            `
            SELECT
                id,
                user_id,
                github_repo_id,
                repo_name,
                repo_url,
                created_at
            FROM favorite_repositories
            WHERE user_id = $1
            AND github_repo_id = $2
            `,
            [
                userId,
                githubRepositoryId
            ]
        );


    return (
        result.rows[0] ||
        null
    );

};


// =====================================
// Get User Favorite Repositories
// =====================================

export const findFavoriteRepositoriesByUserId = async (
    userId
) => {

    const result =
        await db.query(
            `
            SELECT
                id,
                user_id,
                github_repo_id,
                repo_name,
                repo_url,
                created_at
            FROM favorite_repositories
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [
                userId
            ]
        );


    return result.rows;

};


// =====================================
// Create Favorite Repository
// =====================================

export const createFavoriteRepository = async ({
    userId,
    githubRepositoryId,
    repositoryName,
    repositoryUrl
}) => {

    const result =
        await db.query(
            `
            INSERT INTO favorite_repositories (
                user_id,
                github_repo_id,
                repo_name,
                repo_url
            )
            VALUES (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING
                id,
                user_id,
                github_repo_id,
                repo_name,
                repo_url,
                created_at
            `,
            [
                userId,
                githubRepositoryId,
                repositoryName,
                repositoryUrl
            ]
        );


    return result.rows[0];

};


// =====================================
// Delete Favorite Repository
// =====================================

export const deleteFavoriteRepository = async (
    userId,
    githubRepositoryId
) => {

    const result =
        await db.query(
            `
            DELETE FROM favorite_repositories
            WHERE user_id = $1
            AND github_repo_id = $2
            RETURNING
                id,
                user_id,
                github_repo_id,
                repo_name,
                repo_url,
                created_at
            `,
            [
                userId,
                githubRepositoryId
            ]
        );


    return (
        result.rows[0] ||
        null
    );

};

