
import {
    body,
    param
} from "express-validator";



// Add Favorite Repository Validator


export const addFavoriteRepositoryValidator = [

   
    // GitHub Repository ID
   

    body("githubRepositoryId")

        .notEmpty()

        .withMessage(
            "GitHub repository ID is required"
        )

        .isInt({
            min: 1
        })

        .withMessage(
            "GitHub repository ID must be a positive integer"
        ),


   
    // Repository Name
   

    body("repositoryName")

        .trim()

        .notEmpty()

        .withMessage(
            "Repository name is required"
        )

        .isLength({
            min: 1,
            max: 100
        })

        .withMessage(
            "Repository name must be between 1 and 100 characters"
        )

        .matches(
            /^[a-zA-Z0-9._-]+$/
        )

        .withMessage(
            "Invalid repository name format"
        ),


   
    // Repository URL
   

    body("repositoryUrl")

        .trim()

        .notEmpty()

        .withMessage(
            "Repository URL is required"
        )

        .isURL({

            protocols: [
                "https"
            ],

            require_protocol: true

        })

        .withMessage(
            "Repository URL must be a valid HTTPS URL"
        )

        .custom(
            (value) => {

                const githubUrlPattern =
                    /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/;


                if (
                    !githubUrlPattern.test(
                        value
                    )
                ) {

                    throw new Error(
                        "Repository URL must be a valid GitHub repository URL"
                    );

                }


                return true;

            }
        )

];



// Remove Favorite Repository Validator


export const removeFavoriteRepositoryValidator = [

    param(
        "githubRepositoryId"
    )

        .trim()

        .notEmpty()

        .withMessage(
            "GitHub repository ID is required"
        )

        .isInt({
            min: 1
        })

        .withMessage(
            "GitHub repository ID must be a positive integer"
        )

];

