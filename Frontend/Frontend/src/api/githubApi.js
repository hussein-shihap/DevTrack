import apiClient from "./apiClient.js";



// Helpers


const getResponseData = (response) => {

    return (
        response?.data?.data ??
        response?.data ??
        response ??
        null
    );

};



// Validate Repository Identifier


const validateRepositoryIdentifier = (
    owner,
    repositoryName
) => {

    if (
        typeof owner !== "string" ||
        !owner.trim()
    ) {

        throw new Error(
            "Repository owner is required"
        );

    }


    if (
        typeof repositoryName !== "string" ||
        !repositoryName.trim()
    ) {

        throw new Error(
            "Repository name is required"
        );

    }

};



// Get GitHub Profile


export const getGithubProfile = async () => {

    return await apiClient.get(
        "/github/profile"
    );

};



// Get GitHub Repositories


export const getGithubRepositories = async (
    options = {}
) => {

    const {
        page = 1,
        perPage = 30,
        sort = "updated",
        direction = "desc"
    } = options;


    const normalizedPage =
        Number.isInteger(Number(page)) &&
        Number(page) > 0
            ? Number(page)
            : 1;


    const normalizedPerPage =
        Number.isInteger(Number(perPage)) &&
        Number(perPage) > 0
            ? Number(perPage)
            : 30;


    const normalizedSort =
        typeof sort === "string" &&
        sort.trim()
            ? sort.trim()
            : "updated";


    const normalizedDirection =
        direction === "asc"
            ? "asc"
            : "desc";


    const params =
        new URLSearchParams({

            page:
                String(normalizedPage),

            perPage:
                String(normalizedPerPage),

            sort:
                normalizedSort,

            direction:
                normalizedDirection

        });


    return await apiClient.get(
        `/github/repositories?${params.toString()}`
    );

};



// Alias

// Used by Repositories.jsx
// Keeps compatibility with:
//
// import { getRepositories } from "../api/githubApi.js";

export const getRepositories = async (
    options = {}
) => {

    return await getGithubRepositories(
        options
    );

};



// Get GitHub Events


export const getGithubEvents = async (
    options = {}
) => {

    const {
        page = 1,
        perPage = 30
    } = options;


    const normalizedPage =
        Number.isInteger(Number(page)) &&
        Number(page) > 0
            ? Number(page)
            : 1;


    const normalizedPerPage =
        Number.isInteger(Number(perPage)) &&
        Number(perPage) > 0
            ? Number(perPage)
            : 30;


    const params =
        new URLSearchParams({

            page:
                String(normalizedPage),

            perPage:
                String(normalizedPerPage)

        });


    return await apiClient.get(
        `/github/events?${params.toString()}`
    );

};



// Get Single Repository


export const getGithubRepository = async (
    owner,
    repositoryName
) => {

    validateRepositoryIdentifier(
        owner,
        repositoryName
    );


    const encodedOwner =
        encodeURIComponent(
            owner.trim()
        );


    const encodedRepositoryName =
        encodeURIComponent(
            repositoryName.trim()
        );


    return await apiClient.get(
        `/github/repositories/${encodedOwner}/${encodedRepositoryName}`
    );

};



// Get Repository Commits


export const getGithubRepositoryCommits = async (
    owner,
    repositoryName,
    options = {}
) => {

   
    // Validate
   

    validateRepositoryIdentifier(
        owner,
        repositoryName
    );


   
    // Options
   

    const {
        page = 1,
        perPage = 30,
        author
    } = options;


   
    // Normalize Page
   

    const normalizedPage =
        Number.isInteger(Number(page)) &&
        Number(page) > 0
            ? Number(page)
            : 1;


   
    // Normalize Per Page
   

    const normalizedPerPage =
        Number.isInteger(Number(perPage)) &&
        Number(perPage) > 0
            ? Number(perPage)
            : 30;


   
    // Query Parameters
   

    const params =
        new URLSearchParams({

            page:
                String(normalizedPage),

            perPage:
                String(normalizedPerPage)

        });


   
    // Optional Author
   

    if (
        typeof author === "string" &&
        author.trim()
    ) {

        params.set(
            "author",
            author.trim()
        );

    }


   
    // Encode Repository
   

    const encodedOwner =
        encodeURIComponent(
            owner.trim()
        );


    const encodedRepositoryName =
        encodeURIComponent(
            repositoryName.trim()
        );


   
    // Endpoint
   

    const endpoint =
        `/github/repositories/${encodedOwner}/${encodedRepositoryName}/commits?${params.toString()}`;


   
    // Debug
   

    console.log(
        "GET COMMITS ENDPOINT:",
        endpoint
    );


   
    // Request
   

    return await apiClient.get(
        endpoint
    );

};



// Connect GitHub


export const connectGithub = async () => {

    const response =
        await apiClient.get(
            "/github/connect"
        );


    const data =
        getResponseData(
            response
        );


    const githubUrl =
        data?.url ||
        data?.authorizationUrl ||
        data?.githubUrl ||
        response?.data?.url;


    if (
        typeof githubUrl !== "string" ||
        !githubUrl.trim()
    ) {

        throw new Error(
            "GitHub authorization URL was not returned"
        );

    }


   
    // Security Check
   

    let parsedUrl;


    try {

        parsedUrl =
            new URL(
                githubUrl
            );

    } catch {

        throw new Error(
            "Invalid GitHub authorization URL"
        );

    }


    if (
        parsedUrl.protocol !== "https:" &&
        parsedUrl.protocol !== "http:"
    ) {

        throw new Error(
            "Invalid GitHub authorization URL"
        );

    }


   
    // Redirect
   

    window.location.assign(
        parsedUrl.toString()
    );

};



// Check GitHub Connection


export const checkGithubConnection = async () => {

    try {

        const response =
            await getGithubProfile();


        const data =
            getResponseData(
                response
            );


        const profile =
            data?.profile ||
            response?.data?.profile ||
            null;


        return {

            connected:
                Boolean(profile),

            profile

        };

    } catch (error) {

        const status =
            error?.status ??
            error?.response?.status;


        const message =
            String(
                error?.message ||
                error?.response?.data?.message ||
                ""
            ).toLowerCase();


        const notConnected =
            status === 404 ||
            message.includes(
                "github account is not connected"
            ) ||
            message.includes(
                "github is not connected"
            ) ||
            message.includes(
                "github account not connected"
            );


        if (notConnected) {

            return {

                connected: false,

                profile: null

            };

        }


        throw error;

    }

};