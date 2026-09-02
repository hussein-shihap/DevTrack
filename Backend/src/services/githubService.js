import crypto from "crypto";

import {
    findGithubAccountByGithubId,
    findGithubAccountByUserId,
    findDevTrackUserById,
    createGithubAccount,
    updateGithubAccount
} from "../repositories/githubRepository.js";

import githubClient from "../utils/githubClient.js";

import AppError from "../utils/AppError.js";


// =====================================
// GitHub OAuth State Configuration
// =====================================

const GITHUB_STATE_SECRET =
    process.env.GITHUB_STATE_SECRET ||
    process.env.JWT_SECRET;


// =====================================
// Generate GitHub Authorization URL
// =====================================

export const getGithubAuthUrl = async (
    userId
) => {

    const state =
        createGithubState(userId);


    const params =
        new URLSearchParams({

            client_id:
                process.env.GITHUB_CLIENT_ID,

            redirect_uri:
                process.env.GITHUB_CALLBACK_URL,

            scope:
                "read:user user:email repo",

            state

        });


    return (
        `https://github.com/login/oauth/authorize?` +
        params.toString()
    );

};


// =====================================
// Create OAuth State
// =====================================

const createGithubState = (
    userId
) => {

    if (!GITHUB_STATE_SECRET) {

        throw new AppError(
            "GitHub OAuth state secret is not configured",
            500
        );

    }


    const numericUserId =
        Number(userId);


    if (
        !Number.isInteger(numericUserId) ||
        numericUserId <= 0
    ) {

        throw new AppError(
            "Invalid DevTrack user ID",
            400
        );

    }


    const payload = {

        userId:
            numericUserId,

        expiresAt:
            Date.now() +
            (5 * 60 * 1000),

        nonce:
            crypto
                .randomBytes(32)
                .toString("hex")

    };


    const encodedPayload =
        Buffer
            .from(
                JSON.stringify(payload)
            )
            .toString("base64url");


    const signature =
        crypto
            .createHmac(
                "sha256",
                GITHUB_STATE_SECRET
            )
            .update(encodedPayload)
            .digest("base64url");


    return (
        `${encodedPayload}.${signature}`
    );

};


// =====================================
// Get User ID From OAuth State
// =====================================

export const getUserIdFromGithubState = (
    state
) => {

    if (!state) {

        throw new AppError(
            "GitHub state is missing",
            400
        );

    }


    if (!GITHUB_STATE_SECRET) {

        throw new AppError(
            "GitHub OAuth state secret is not configured",
            500
        );

    }


    const parts =
        state.split(".");


    if (parts.length !== 2) {

        throw new AppError(
            "Invalid GitHub state",
            400
        );

    }


    const [
        encodedPayload,
        receivedSignature
    ] = parts;


    if (
        !encodedPayload ||
        !receivedSignature
    ) {

        throw new AppError(
            "Invalid GitHub state",
            400
        );

    }


    const expectedSignature =
        crypto
            .createHmac(
                "sha256",
                GITHUB_STATE_SECRET
            )
            .update(encodedPayload)
            .digest("base64url");


    const receivedBuffer =
        Buffer.from(
            receivedSignature,
            "utf8"
        );


    const expectedBuffer =
        Buffer.from(
            expectedSignature,
            "utf8"
        );


    if (
        receivedBuffer.length !==
        expectedBuffer.length
    ) {

        throw new AppError(
            "Invalid GitHub state",
            400
        );

    }


    if (
        !crypto.timingSafeEqual(
            receivedBuffer,
            expectedBuffer
        )
    ) {

        throw new AppError(
            "Invalid GitHub state",
            400
        );

    }


    let payload;


    try {

        payload =
            JSON.parse(
                Buffer
                    .from(
                        encodedPayload,
                        "base64url"
                    )
                    .toString("utf8")
            );

    } catch {

        throw new AppError(
            "Invalid GitHub state",
            400
        );

    }


    if (
        !payload ||
        !payload.userId ||
        !payload.expiresAt ||
        !payload.nonce
    ) {

        throw new AppError(
            "Invalid GitHub state",
            400
        );

    }


    const userId =
        Number(payload.userId);


    const expiresAt =
        Number(payload.expiresAt);


    if (
        !Number.isInteger(userId) ||
        userId <= 0
    ) {

        throw new AppError(
            "Invalid GitHub state user",
            400
        );

    }


    if (
        !Number.isFinite(expiresAt)
    ) {

        throw new AppError(
            "Invalid GitHub state expiration",
            400
        );

    }


    if (
        Date.now() >
        expiresAt
    ) {

        throw new AppError(
            "GitHub state has expired",
            400
        );

    }


    return userId;

};


// =====================================
// Exchange Authorization Code
// for GitHub Access Token
// =====================================

const getGithubAccessToken = async (
    code
) => {

    if (!code) {

        throw new AppError(
            "GitHub authorization code is missing",
            400
        );

    }


    if (
        !process.env.GITHUB_CLIENT_ID ||
        !process.env.GITHUB_CLIENT_SECRET ||
        !process.env.GITHUB_CALLBACK_URL
    ) {

        throw new AppError(
            "GitHub OAuth configuration is incomplete",
            500
        );

    }


    let response;


    try {

        response =
            await fetch(
                "https://github.com/login/oauth/access_token",
                {

                    method:
                        "POST",

                    headers: {

                        Accept:
                            "application/json",

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            client_id:
                                process.env.GITHUB_CLIENT_ID,

                            client_secret:
                                process.env.GITHUB_CLIENT_SECRET,

                            code,

                            redirect_uri:
                                process.env.GITHUB_CALLBACK_URL

                        })

                }
            );

    } catch {

        throw new AppError(
            "Unable to connect to GitHub OAuth",
            503
        );

    }


    if (!response.ok) {

        throw new AppError(
            "Failed to get GitHub access token",
            401
        );

    }


    let data;


    try {

        data =
            await response.json();

    } catch {

        throw new AppError(
            "Invalid response from GitHub OAuth",
            502
        );

    }


    if (data.error) {

        throw new AppError(
            data.error_description ||
            "GitHub authorization failed",
            401
        );

    }


    if (!data.access_token) {

        throw new AppError(
            "GitHub access token was not returned",
            401
        );

    }


    return String(
        data.access_token
    ).trim();

};


// =====================================
// Get GitHub User
// =====================================

const getGithubUser = async (
    accessToken
) => {

    return githubClient.get(
        "/user",
        accessToken
    );

};


// =====================================
// Connect GitHub Account
// =====================================

export const connectGithubAccount = async (
    userId,
    code
) => {

    const currentUserId =
        Number(userId);


    if (
        !Number.isInteger(currentUserId) ||
        currentUserId <= 0
    ) {

        throw new AppError(
            "Invalid DevTrack user",
            400
        );

    }


    if (!code) {

        throw new AppError(
            "GitHub authorization code is missing",
            400
        );

    }


    // =================================
    // Make sure DevTrack user exists
    // =================================

    const currentUser =
        await findDevTrackUserById(
            currentUserId
        );


    if (!currentUser) {

        throw new AppError(
            "DevTrack user was not found",
            404
        );

    }


    // =================================
    // Get GitHub Access Token
    // =================================

    const accessToken =
        (
            await getGithubAccessToken(
                code
            )
        ).trim();


    console.log(
        "GitHub OAuth token received:",
        {

            exists:
                Boolean(accessToken),

            length:
                accessToken.length,

            prefix:
                accessToken.slice(0, 10)

        }
    );


    // =================================
    // Get GitHub User
    // =================================

    const githubUser =
        await getGithubUser(
            accessToken
        );


    console.log(
        "GitHub OAuth user:",
        {

            id:
                githubUser?.id,

            login:
                githubUser?.login

        }
    );


    if (
        !githubUser?.id ||
        !githubUser?.login
    ) {

        throw new AppError(
            "Unable to retrieve GitHub account information",
            401
        );

    }


    const githubId =
        Number(githubUser.id);


    if (
        !Number.isSafeInteger(githubId) ||
        githubId <= 0
    ) {

        throw new AppError(
            "Invalid GitHub account ID",
            502
        );

    }


    const githubUsername =
        String(
            githubUser.login
        ).trim();


    if (!githubUsername) {

        throw new AppError(
            "GitHub username is missing",
            502
        );

    }


    // =================================
    // Check CURRENT DevTrack user's
    // existing GitHub connection
    // =================================

    const currentGithubAccount =
        await findGithubAccountByUserId(
            currentUserId
        );


    if (currentGithubAccount) {

        // =================================
        // SAME GitHub account
        // =================================

        if (
            String(
                currentGithubAccount.github_id
            ) ===
            String(
                githubId
            )
        ) {

            const updatedAccount =
                await updateGithubAccount(

                    currentGithubAccount.id,

                    githubUsername,

                    accessToken

                );


            if (!updatedAccount) {

                throw new AppError(
                    "Failed to refresh GitHub connection",
                    500
                );

            }


            return updatedAccount;

        }


        // =================================
        // DIFFERENT GitHub account
        // =================================

        throw new AppError(
            "Your DevTrack account is already connected to another GitHub account",
            409
        );

    }


    // =================================
    // Check GitHub ownership globally
    // =================================

    const existingGithubAccount =
        await findGithubAccountByGithubId(
            githubId
        );


    // =================================
    // GitHub does not exist
    // =================================

    if (!existingGithubAccount) {

        try {

            const createdAccount =
                await createGithubAccount({

                    userId:
                        currentUserId,

                    githubId,

                    githubUsername,

                    accessToken

                });


            console.log(
                "GitHub account saved:",
                {

                    id:
                        createdAccount?.id,

                    userId:
                        createdAccount?.user_id,

                    githubId:
                        createdAccount?.github_id,

                    username:
                        createdAccount?.github_username,

                    tokenExists:
                        Boolean(
                            createdAccount?.access_token
                        ),

                    tokenLength:
                        createdAccount?.access_token?.length,

                    tokenPrefix:
                        createdAccount?.access_token?.slice(
                            0,
                            10
                        )

                }
            );


            return createdAccount;

        } catch (error) {

            const conflictingAccount =
                await findGithubAccountByGithubId(
                    githubId
                );


            if (conflictingAccount) {

                if (
                    Number(
                        conflictingAccount.user_id
                    ) === currentUserId
                ) {

                    const updatedAccount =
                        await updateGithubAccount(

                            conflictingAccount.id,

                            githubUsername,

                            accessToken

                        );


                    if (!updatedAccount) {

                        throw new AppError(
                            "Failed to refresh GitHub connection",
                            500
                        );

                    }


                    return updatedAccount;

                }


                throw new AppError(
                    "This GitHub account is already connected to another DevTrack account",
                    409
                );

            }


            const message =
                String(
                    error?.message || ""
                );


            if (
                message
                    .toLowerCase()
                    .includes(
                        "github_accounts_user_id_key"
                    )
            ) {

                throw new AppError(
                    "Your DevTrack account is already connected to a GitHub account",
                    409
                );

            }


            if (
                message
                    .toLowerCase()
                    .includes(
                        "github_accounts_github_id_key"
                    )
            ) {

                throw new AppError(
                    "This GitHub account is already connected to another DevTrack account",
                    409
                );

            }


            throw error;

        }

    }


    // =================================
    // Existing GitHub account owner
    // =================================

    const githubOwner =
        await findDevTrackUserById(
            existingGithubAccount.user_id
        );


    if (!githubOwner) {

        throw new AppError(
            "This GitHub connection belongs to an invalid DevTrack account. Please contact support",
            409
        );

    }


    throw new AppError(
        "This GitHub account is already connected to another DevTrack account",
        409
    );

};


// =====================================
// Get Connected GitHub Account
// =====================================

const getConnectedGithubAccount = async (
    userId
) => {

    const numericUserId =
        Number(userId);


    if (
        !Number.isInteger(numericUserId) ||
        numericUserId <= 0
    ) {

        throw new AppError(
            "Invalid DevTrack user",
            400
        );

    }


    const githubAccount =
        await findGithubAccountByUserId(
            numericUserId
        );


    if (!githubAccount) {

        throw new AppError(
            "GitHub account is not connected",
            404
        );

    }


    if (
        typeof githubAccount.access_token !== "string" ||
        !githubAccount.access_token.trim()
    ) {

        throw new AppError(
            "GitHub access token is missing",
            401
        );

    }


    const normalizedAccount = {

        ...githubAccount,

        access_token:
            githubAccount.access_token.trim()

    };


    console.log(
        "GitHub account loaded from DB:",
        {

            id:
                normalizedAccount.id,

            userId:
                normalizedAccount.user_id,

            githubId:
                normalizedAccount.github_id,

            username:
                normalizedAccount.github_username,

            tokenExists:
                Boolean(
                    normalizedAccount.access_token
                ),

            tokenLength:
                normalizedAccount.access_token.length,

            tokenPrefix:
                normalizedAccount.access_token.slice(
                    0,
                    10
                )

        }
    );


    return normalizedAccount;

};


// =====================================
// Get GitHub Profile
// =====================================

export const getGithubProfile = async (
    userId
) => {

    const githubAccount =
        await getConnectedGithubAccount(
            userId
        );


    return githubClient.get(
        "/user",
        githubAccount.access_token
    );

};


// =====================================
// Get GitHub Repositories
// =====================================

export const getGithubRepositories = async (
    userId,
    options = {}
) => {

    const githubAccount =
        await getConnectedGithubAccount(
            userId
        );


    const page =
        Number(options.page) > 0
            ? Number(options.page)
            : 1;


    const perPage =
        Number(options.perPage) > 0
            ? Math.min(
                Number(options.perPage),
                100
            )
            : 30;


    const allowedSortValues = [
        "created",
        "updated",
        "pushed",
        "full_name"
    ];


    const allowedDirectionValues = [
        "asc",
        "desc"
    ];


    const sort =
        allowedSortValues.includes(
            options.sort
        )
            ? options.sort
            : "updated";


    const direction =
        allowedDirectionValues.includes(
            options.direction
        )
            ? options.direction
            : "desc";


    const endpoint =
        `/user/repos?` +
        new URLSearchParams({

            visibility:
                "all",

            affiliation:
                "owner,collaborator,organization_member",

            sort,

            direction,

            page:
                String(page),

            per_page:
                String(perPage)

        }).toString();


    return githubClient.get(
        endpoint,
        githubAccount.access_token
    );

};


// =====================================
// Get Single GitHub Repository
// =====================================

export const getGithubRepository = async (
    userId,
    owner,
    repositoryName
) => {

    const githubAccount =
        await getConnectedGithubAccount(
            userId
        );


    if (
        !owner ||
        !repositoryName
    ) {

        throw new AppError(
            "Repository owner and name are required",
            400
        );

    }


    const endpoint =
        `/repos/${encodeURIComponent(owner)}` +
        `/${encodeURIComponent(repositoryName)}`;


    return githubClient.get(
        endpoint,
        githubAccount.access_token
    );

};


// =====================================
// Get Repository Commits
// =====================================

export const getGithubRepositoryCommits = async (
    userId,
    owner,
    repositoryName,
    options = {}
) => {

    const githubAccount =
        await getConnectedGithubAccount(
            userId
        );


    if (
        !owner ||
        !repositoryName
    ) {

        throw new AppError(
            "Repository owner and name are required",
            400
        );

    }


    const page =
        Number(options.page) > 0
            ? Number(options.page)
            : 1;


    const perPage =
        Number(options.perPage) > 0
            ? Math.min(
                Number(options.perPage),
                100
            )
            : 30;


    const params =
        new URLSearchParams({

            page:
                String(page),

            per_page:
                String(perPage)

        });


    if (options.author) {

        params.set(
            "author",
            String(options.author)
        );

    }


    const endpoint =
        `/repos/${encodeURIComponent(owner)}` +
        `/${encodeURIComponent(repositoryName)}` +
        `/commits?${params.toString()}`;


    try {

        return await githubClient.get(
            endpoint,
            githubAccount.access_token
        );

    } catch (error) {

        const message =
            String(
                error?.message || ""
            ).toLowerCase();


        if (
            message.includes(
                "git repository is empty"
            )
        ) {

            return [];

        }


        throw error;

    }

};


// =====================================
// Get GitHub User Events
// =====================================

export const getGithubEvents = async (
    userId,
    options = {}
) => {

    const githubAccount =
        await getConnectedGithubAccount(
            userId
        );


    const page =
        Number(options.page) > 0
            ? Number(options.page)
            : 1;


    const perPage =
        Number(options.perPage) > 0
            ? Math.min(
                Number(options.perPage),
                100
            )
            : 30;


    const endpoint =
        `/users/${encodeURIComponent(
            githubAccount.github_username
        )}/events?` +
        new URLSearchParams({

            page:
                String(page),

            per_page:
                String(perPage)

        }).toString();


    return githubClient.get(
        endpoint,
        githubAccount.access_token
    );

};