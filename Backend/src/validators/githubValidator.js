import { param } from "express-validator";

// =====================================
// GitHub Repository Validator
// =====================================

export const githubRepositoryValidator = [

    // ---------------------------------
    // Owner
    // ---------------------------------

    param("owner")
        .trim()
        .notEmpty()
        .withMessage("GitHub owner is required")

        .isLength({ min: 1, max: 39 })
        .withMessage("GitHub owner must be between 1 and 39 characters")

        .matches(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/)
        .withMessage("Invalid GitHub owner format"),


    // ---------------------------------
    // Repository Name
    // ---------------------------------

    param("repositoryName")
        .trim()
        .notEmpty()
        .withMessage("Repository name is required")

        .isLength({ min: 1, max: 100 })
        .withMessage("Repository name must be between 1 and 100 characters")

        .matches(/^[a-zA-Z0-9._-]+$/)
        .withMessage("Invalid GitHub repository name format")
];