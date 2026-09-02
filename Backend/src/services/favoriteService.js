
import {
    findFavoriteRepository,
    findFavoriteRepositoriesByUserId,
    createFavoriteRepository,
    deleteFavoriteRepository
} from "../repositories/favoriteRepository.js";

import AppError from "../utils/AppError.js";


// =====================================
// Get User Favorite Repositories
// =====================================

export const getFavoriteRepositories = async (
    userId
) => {

    const repositories =
        await findFavoriteRepositoriesByUserId(
            userId
        );


    return repositories;

};


// =====================================
// Add Repository to Favorites
// =====================================

export const addFavoriteRepository = async ({
    userId,
    githubRepositoryId,
    repositoryName,
    repositoryUrl
}) => {

    // =================================
    // Check Existing Favorite
    // =================================

    const existingRepository =
        await findFavoriteRepository(
            userId,
            githubRepositoryId
        );


    if (
        existingRepository
    ) {

        throw new AppError(
            "Repository is already in your favorites",
            409
        );

    }


    // =================================
    // Create Favorite
    // =================================

    const favoriteRepository =
        await createFavoriteRepository({

            userId,

            githubRepositoryId,

            repositoryName,

            repositoryUrl

        });


    return favoriteRepository;

};


// =====================================
// Remove Repository from Favorites
// =====================================

export const removeFavoriteRepository = async (
    userId,
    githubRepositoryId
) => {

    const deletedRepository =
        await deleteFavoriteRepository(
            userId,
            githubRepositoryId
        );


    if (
        !deletedRepository
    ) {

        throw new AppError(
            "Repository is not in your favorites",
            404
        );

    }


    return deletedRepository;

};

