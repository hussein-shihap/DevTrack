import AppError from "./AppError.js";


// GitHub API Configuration


const GITHUB_API_URL = "https://api.github.com";

const GITHUB_API_VERSION = "2026-03-10";



// Normalize Access Token


const normalizeAccessToken = (accessToken) => {

    if (
        typeof accessToken !== "string" ||
        !accessToken.trim()
    ) {

        throw new AppError(
            "GitHub access token is missing",
            401
        );

    }

    return accessToken.trim();

};



// GitHub Request


const request = async (
    endpoint,
    accessToken,
    options = {}
) => {

    const token =
        normalizeAccessToken(
            accessToken
        );


    try {

        const response =
            await fetch(
                `${GITHUB_API_URL}${endpoint}`,
                {

                    method:
                        options.method || "GET",

                    headers: {

                        Accept:
                            "application/vnd.github+json",

                        "X-GitHub-Api-Version":
                            GITHUB_API_VERSION,

                        Authorization:
                            `Bearer ${token}`,

                        ...(options.headers || {})

                    },

                    ...(options.body !== undefined && {
                        body: options.body
                    })

                }
            );


        // =================================
        // Parse Response
        // =================================

        let data = null;


        try {

            data =
                await response.json();

        } catch {

            data = null;

        }


        // =================================
        // Invalid GitHub Credentials
        // =================================

        if (
            response.status === 401
        ) {

            console.error(
                "GitHub returned 401 Bad credentials",
                {
                    endpoint,
                    tokenExists: Boolean(token),
                    tokenLength: token.length,
                    tokenPrefix: token.slice(0, 10)
                }
            );


            throw new AppError(
                "GitHub access token is invalid or expired. Please reconnect GitHub.",
                401
            );

        }


        // =================================
        // Other GitHub API Errors
        // =================================

        if (!response.ok) {

            console.error(
                "GitHub API Error:",
                {
                    status: response.status,
                    endpoint,
                    response: data
                }
            );


            throw new AppError(

                data?.message ||
                `GitHub API request failed with status ${response.status}`,

                response.status

            );

        }


        // =================================
        // Success
        // =================================

        return data;

    } catch (error) {

        if (
            error instanceof TypeError
        ) {

            console.error(
                "GitHub connection error:",
                error
            );


            throw new AppError(
                "Unable to connect to GitHub API",
                503
            );

        }


        throw error;

    }

};



// GET


const get = (
    endpoint,
    accessToken
) => {

    return request(
        endpoint,
        accessToken,
        {
            method: "GET"
        }
    );

};



// POST


const post = (
    endpoint,
    accessToken,
    body,
    options = {}
) => {

    return request(
        endpoint,
        accessToken,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

                ...(options.headers || {})

            },

            body:
                typeof body === "string"
                    ? body
                    : JSON.stringify(body)

        }
    );

};



// PUT


const put = (
    endpoint,
    accessToken,
    body,
    options = {}
) => {

    return request(
        endpoint,
        accessToken,
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json",

                ...(options.headers || {})

            },

            body:
                typeof body === "string"
                    ? body
                    : JSON.stringify(body)

        }
    );

};



// DELETE


const remove = (
    endpoint,
    accessToken,
    options = {}
) => {

    return request(
        endpoint,
        accessToken,
        {

            method: "DELETE",

            headers: {

                ...(options.headers || {})

            }

        }
    );

};



// Export


export default {

    request,

    get,

    post,

    put,

    delete: remove

};