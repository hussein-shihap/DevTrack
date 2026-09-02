import {
    getGithubAuthUrl,
    getUserIdFromGithubState,
    connectGithubAccount,
    getGithubProfile,
    getGithubRepositories,
    getGithubRepository,
    getGithubRepositoryCommits,
    getGithubEvents
} from "../services/githubService.js";

import asyncHandler from "../middleware/asyncHandler.js";

import AppError from "../utils/AppError.js";



// =====================================
// Connect GitHub
// =====================================

export const githubLogin = asyncHandler(
    async (req, res) => {

        const userId =
            req.user.id;


        const url =
            await getGithubAuthUrl(
                userId
            );


        return res.status(200).json({

            success: true,

            message:
                "GitHub authorization URL generated successfully",

            data: {

                url

            }

        });

    }
);



// =====================================
// GitHub Callback
// =====================================

export const githubCallback = asyncHandler(
    async (req, res) => {

        const {
            code,
            state,
            error,
            error_description
        } = req.query;


        // =================================
        // GitHub returned an OAuth error
        // =================================

        if (error) {

            const message =
                error_description ||
                "GitHub authorization was cancelled or denied";


            throw new AppError(
                message,
                401
            );

        }


        // =================================
        // Validate code
        // =================================

        if (!code) {

            throw new AppError(
                "GitHub authorization code is missing",
                400
            );

        }


        // =================================
        // Validate state
        // =================================

        if (!state) {

            throw new AppError(
                "GitHub state is missing",
                400
            );

        }


        // =================================
        // Recover DevTrack User ID
        // =================================

        const userId =
            getUserIdFromGithubState(
                state
            );


        // =================================
        // Connect GitHub
        // =================================

        await connectGithubAccount(
            userId,
            code
        );


        // =================================
        // Redirect
        // =================================

        return res.redirect(
            "http://localhost:5173/dashboard?github=connected"
        );

    }
);



// =====================================
// Get GitHub Profile
// =====================================

export const getGithubProfileController =
    asyncHandler(
        async (req, res) => {

            const userId =
                req.user.id;


            const githubProfile =
                await getGithubProfile(
                    userId
                );


            return res.status(200).json({

                success: true,

                message:
                    "GitHub profile retrieved successfully",

                data: {

                    profile:
                        githubProfile

                }

            });

        }
    );



// =====================================
// Get GitHub Repositories
// =====================================

export const getGithubRepositoriesController =
    asyncHandler(
        async (req, res) => {

            const userId =
                req.user.id;


            const {
                page,
                perPage,
                sort,
                direction
            } = req.query;


            const repositories =
                await getGithubRepositories(
                    userId,
                    {
                        page,
                        perPage,
                        sort,
                        direction
                    }
                );


            return res.status(200).json({

                success: true,

                message:
                    "GitHub repositories retrieved successfully",

                data: {

                    repositories

                }

            });

        }
    );



// =====================================
// Get Single GitHub Repository
// =====================================

export const getGithubRepositoryController =
    asyncHandler(
        async (req, res) => {

            const userId =
                req.user.id;


            const {
                owner,
                repositoryName
            } = req.params;


            const repository =
                await getGithubRepository(
                    userId,
                    owner,
                    repositoryName
                );


            return res.status(200).json({

                success: true,

                message:
                    "GitHub repository retrieved successfully",

                data: {

                    repository

                }

            });

        }
    );



// =====================================
// Get Repository Commits
// =====================================

export const getGithubRepositoryCommitsController =
    asyncHandler(
        async (req, res) => {

            const userId =
                req.user.id;


            const {
                owner,
                repositoryName
            } = req.params;


            const {
                page,
                perPage,
                author
            } = req.query;


            const commits =
                await getGithubRepositoryCommits(
                    userId,
                    owner,
                    repositoryName,
                    {
                        page,
                        perPage,
                        author
                    }
                );


            return res.status(200).json({

                success: true,

                message:
                    "GitHub repository commits retrieved successfully",

                data: {

                    commits

                }

            });

        }
    );



// =====================================
// Get GitHub User Events
// =====================================

export const getGithubEventsController =
    asyncHandler(
        async (req, res) => {

            const userId =
                req.user.id;


            const {
                page,
                perPage
            } = req.query;


            const events =
                await getGithubEvents(
                    userId,
                    {
                        page,
                        perPage
                    }
                );


            return res.status(200).json({

                success: true,

                message:
                    "GitHub events retrieved successfully",

                data: {

                    events

                }

            });

        }
    );