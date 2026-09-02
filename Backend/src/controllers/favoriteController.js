
import asyncHandler from "../middleware/asyncHandler.js";

import AppError from "../utils/AppError.js";

import {
    getFavoriteRepositories,
    addFavoriteRepository,
    removeFavoriteRepository
} from "../services/favoriteService.js";




export const getFavoriteRepositoriesController =
    asyncHandler(
        async (req, res) => {

            const userId =
                req.user.id;


            const repositories =
                await getFavoriteRepositories(
                    userId
                );


            return res.status(200).json({

                success: true,

                message:
                    "Favorite repositories retrieved successfully",

                data: {

                    repositories

                }

            });

        }
    );


// =====================================
// Add Favorite Repository
// =====================================

export const addFavoriteRepositoryController =
    asyncHandler(
        async (req, res) => {

            const userId =
                req.user.id;


            const {
                githubRepositoryId,
                repositoryName,
                repositoryUrl
            } = req.body;


            // =================================
            // Required Fields
            // =================================

            if (
                githubRepositoryId === undefined ||
                !repositoryName ||
                !repositoryUrl
            ) {

                throw new AppError(
                    "githubRepositoryId, repositoryName and repositoryUrl are required",
                    400
                );

            }


            // =================================
            // Add Repository
            // =================================

            const favoriteRepository =
                await addFavoriteRepository({

                    userId,

                    githubRepositoryId,

                    repositoryName,

                    repositoryUrl

                });


            return res.status(201).json({

                success: true,

                message:
                    "Repository added to favorites successfully",

                data: {

                    repository:
                        favoriteRepository

                }

            });

        }
    );


// =====================================
// Remove Favorite Repository
// =====================================

export const removeFavoriteRepositoryController =
    asyncHandler(
        async (req, res) => {

            const userId =
                req.user.id;


            const githubRepositoryId =
                Number(
                    req.params.githubRepositoryId
                );


            // =================================
            // Validate ID
            // =================================

            if (
                !Number.isSafeInteger(
                    githubRepositoryId
                ) ||
                githubRepositoryId <= 0
            ) {

                throw new AppError(
                    "Invalid GitHub repository ID",
                    400
                );

            }


            // =================================
            // Remove Repository
            // =================================

            const deletedRepository =
                await removeFavoriteRepository(
                    userId,
                    githubRepositoryId
                );


            return res.status(200).json({

                success: true,

                message:
                    "Repository removed from favorites successfully",

                data: {

                    repository:
                        deletedRepository

                }

            });

        }
    );

