import express from "express";

import {
    githubLogin,
    githubCallback,
    getGithubProfileController,
    getGithubRepositoriesController,
    getGithubRepositoryController,
    getGithubRepositoryCommitsController,
    getGithubEventsController
} from "../controllers/githubController.js";

import {
    authMiddleware
} from "../middleware/authMiddleware.js";

import {
    githubRepositoryValidator
} from "../validators/githubValidator.js";

import {
    validate
} from "../middleware/validate.js";


const router =
    express.Router();







router.get(
    "/connect",
    authMiddleware,
    githubLogin
);







router.get(
    "/callback",
    githubCallback
);




// Get GitHub Profile


router.get(
    "/profile",
    authMiddleware,
    getGithubProfileController
);




// Get GitHub Repositories


router.get(
    "/repositories",
    authMiddleware,
    getGithubRepositoriesController
);




// Get Single GitHub Repository


router.get(
    "/repositories/:owner/:repositoryName",
    authMiddleware,
    githubRepositoryValidator,
    validate,
    getGithubRepositoryController
);




// Get Repository Commits


router.get(
    "/repositories/:owner/:repositoryName/commits",
    authMiddleware,
    githubRepositoryValidator,
    validate,
    getGithubRepositoryCommitsController
);




// Get GitHub User Events


router.get(
    "/events",
    authMiddleware,
    getGithubEventsController
);



export default router;