    
import apiClient from "./apiClient.js";



// Helpers


const normalizeRepositoryId = (
    githubRepositoryId
) => {

    const repositoryId =
        Number(
            githubRepositoryId
        );


    if (
        !Number.isSafeInteger(repositoryId) ||
        repositoryId <= 0
    ) {

        throw new Error(
            "GitHub repository ID must be a positive integer"
        );

    }


    return repositoryId;

};


const normalizeRequiredString = (
    value,
    fieldName
) => {

    if (
        typeof value !== "string" ||
        !value.trim()
    ) {

        throw new Error(
            `${fieldName} is required`
        );

    }


    return value.trim();

};



// Get Favorite Repositories


export const getFavoriteRepositories = async () => {

    return await apiClient.get(
        "/favorites"
    );

};



// Add Repository to Favorites


export const addFavoriteRepository = async ({
    githubRepositoryId,
    repositoryName,
    repositoryUrl
} = {}) => {

    // =================================
    // Validate Repository ID
    // =================================

    const normalizedRepositoryId =
        normalizeRepositoryId(
            githubRepositoryId
        );


    // =================================
    // Validate Repository Name
    // =================================

    const normalizedRepositoryName =
        normalizeRequiredString(
            repositoryName,
            "Repository name"
        );


    // =================================
    // Validate Repository URL
    // =================================

    const normalizedRepositoryUrl =
        normalizeRequiredString(
            repositoryUrl,
            "Repository URL"
        );


    // =================================
    // Validate HTTPS URL
    // =================================

    try {

        const url =
            new URL(
                normalizedRepositoryUrl
            );


        if (
            url.protocol !== "https:"
        ) {

            throw new Error();

        }

    } catch {

        throw new Error(
            "Repository URL must be a valid HTTPS URL"
        );

    }


    // =================================
    // Add Favorite Repository
    // =================================

    return await apiClient.post(
        "/favorites",
        {

            githubRepositoryId:
                normalizedRepositoryId,

            repositoryName:
                normalizedRepositoryName,

            repositoryUrl:
                normalizedRepositoryUrl

        }
    );

};



// Remove Repository from Favorites


export const removeFavoriteRepository = async (
    githubRepositoryId
) => {

    // =================================
    // Validate Repository ID
    // =================================

    const normalizedRepositoryId =
        normalizeRepositoryId(
            githubRepositoryId
        );


    // =================================
    // Remove Favorite Repository
    // =================================

    return await apiClient.delete(
        `/favorites/${normalizedRepositoryId}`
    );

};

